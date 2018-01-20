import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";
import {Metronome} from "./Metronome";

export class ScreenModel {
    width: number;

    systemTicks: Tick[];
    playerTicks: Tick[];

    notePlayedThisFrame: boolean;
    framesSinceMetronomePlayed: number;
    bpm: number;
    pixelsPerSecond: number;
    intervalBetweenTicks: number;

    metronome: Metronome;
    screen: Screen;

    constructor(width: number, metronome: Metronome) {
        this.width = width;
        this.notePlayedThisFrame = false;
        this.systemTicks = [{pos: this.width / 2.0, isMiddle: true, color: "black"}];
        this.playerTicks = [];

        this.bpm = 100;
        this.intervalBetweenTicks = 50;

        this.metronome = metronome;
        this.framesSinceMetronomePlayed = 0;

        this.pixelsPerSecond = this.intervalBetweenTicks * this.bpm / 60.0;
    }

    addPlayerTick() {
        if (!this.notePlayedThisFrame) {
            this.notePlayedThisFrame = true;
            this.playerTicks.push({pos: this.width / 2.0, isMiddle: false, color: "red"});
        }
    }

    setBPM(newBPM: number) {
        this.bpm = newBPM;
        this.pixelsPerSecond = this.intervalBetweenTicks * this.bpm / 60.0;
    }

    update(deltaTime: number) {
        let maxPos = this.width / 2.0;

        for (let tick of this.playerTicks) {
            if (!tick.isMiddle) {
                tick.pos -= this.pixelsPerSecond * deltaTime / 1000.0;
            }
        }

        for (let tick of this.systemTicks) {
            if (!tick.isMiddle) {
                tick.pos -= this.pixelsPerSecond * deltaTime / 1000.0;
                if (this.width / 2.0 - 3 < tick.pos && tick.pos < this.width / 2.0 + 1) {
                    this.metronome.emit(Metronome.BEAT_START, "");
                }
            }
            maxPos = Math.max(maxPos, tick.pos);
        }

        this.systemTicks = this.systemTicks.filter(tick => tick.pos > 0);
        this.playerTicks = this.playerTicks.filter(tick => tick.pos > 0);

        if (maxPos < this.width - this.intervalBetweenTicks) {
            this.systemTicks.push({pos: maxPos + this.intervalBetweenTicks, isMiddle: false, color: "black"});
        }

        this.notePlayedThisFrame = false;

        if (this.screen) {
            this.screen.updateCanvas();
        }
    }

    setScreen(screen: Screen) {
        this.screen = screen;
    }
}

@Radium
export class Screen extends React.Component<IScreenProps, IScreenState> {
    props: IScreenProps;
    state: IScreenState;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    updateCanvas() {
        this.clearCanvas();

        const ctx = this.canvas.getContext("2d");
        ctx.scale(1, 1);

        ctx.strokeRect(0, 13, 750, 1);
        for (let tick of this.props.screenModel.playerTicks) {
            ctx.strokeStyle = tick.color;
            ctx.strokeRect(Math.round(tick.pos), 0, 1, 25);
        }

        for (let tick of this.props.screenModel.systemTicks) {
            ctx.strokeStyle = tick.color;
            if (tick.isMiddle) {
                ctx.strokeRect(Math.round(tick.pos), 0, 1, 25);
            } else {
                if (!this.props.screenModel.metronome.mute) {
                    ctx.strokeRect(Math.round(tick.pos), 7, 1, 13);
                }
            }
        }
        ctx.strokeRect(0, 6, 1, 15);
        ctx.strokeRect(749, 6, 1, 15);
    }

    clearCanvas() {
        this.canvas.width = this.canvas.width; // hacky way, but improves performance
        // const ctx = this.canvas.getContext("2d");

        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    constructor(props: IScreenProps) {
        super(props);
    }

    render() {
        return (
            <canvas id="myCanvas" width="750" height="25" 
                ref={(canvas) => {
                    this.canvas = canvas;
                    // this.canvas.getContext("2d").scale(0.2, 0.2);
                }} style={[
                Screen.styles.base
            ]}>
            </canvas>
                // <div style={[
                //     Screen.styles.marker,
                //     Screen.styles.midMarker
                // ]}></div>
                // {
                //     this.systemTicks.map((tickInfo, i) => {
                //         return <div style={[
                //             Screen.styles.marker,
                //             {left: `${tickInfo.pos - i + 1}px`}
                //         ]}></div>;
                //     })
                // }        
        );
    }

    private static readonly WIDTH = 750;
    private static readonly HEIGHT = 25;

    private static styles = {
        base: {
            width: `${Screen.WIDTH}px`,
            height: `${Screen.HEIGHT}px`,
            fontWeight: "bold",
            backgroundColor: "white",
            color: "black",
            // marginLeft: "10px",
            // marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1em",
            // borderRadius: "2px",
            // border: "1px solid black"
        },
    };
}

export interface Tick {
    pos: number;
    isMiddle: boolean;
    color: string;
}

export interface IScreenProps {
    screenModel: ScreenModel;
}

export interface IScreenState {

}
