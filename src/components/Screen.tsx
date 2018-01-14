import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";

@Radium
export class Screen extends React.Component<IScreenProps, IScreenState> {
    props: IScreenProps;
    state: IScreenState;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    notePlayedThisFrame: boolean;
    // componentDidMount() {
    //     this.updateCanvas();
    // }

    // componentDidUpdate() {
    //     this.updateCanvas();
    // }

    updateCanvas() {
        this.clearCanvas();

        const ctx = this.canvas.getContext("2d");
        ctx.scale(1, 25);

        for (let tick of this.state.playerTicks) {
            ctx.strokeStyle = tick.color;
            ctx.strokeRect(Math.round(tick.pos), 0, 1, 1);
        }

        for (let tick of this.state.systemTicks) {
            ctx.strokeStyle = tick.color;
            ctx.strokeRect(Math.round(tick.pos), 0, 1, 1);
        }
    }

    clearCanvas() {
        this.canvas.width = this.canvas.width; // hacky way, but improves performance
        // const ctx = this.canvas.getContext("2d");

        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(deltaTime: number) {
        let maxPos = 375;

        for (let tick of this.state.playerTicks) {
            if (!tick.isMiddle) {
                tick.pos -= Screen.PIXELS_PER_SECOND * deltaTime / 1000.0;
            }
        }

        for (let tick of this.state.systemTicks) {
            if (!tick.isMiddle) {
                tick.pos -= Screen.PIXELS_PER_SECOND * deltaTime / 1000.0;
            }
            maxPos = Math.max(maxPos, tick.pos);
        }

        this.state.systemTicks = this.state.systemTicks.filter(tick => tick.pos > 0);
        this.state.playerTicks = this.state.playerTicks.filter(tick => tick.pos > 0);

        if (maxPos < 600) {
            this.state.systemTicks.push({pos: maxPos + 150, isMiddle: false, color: "black"});
        }

        this.notePlayedThisFrame = false;

        this.updateCanvas();
    }

    addPlayerTick() {
        if (!this.notePlayedThisFrame) {
            this.notePlayedThisFrame = true;
            this.state.playerTicks.push({pos: 375, isMiddle: false, color: "red"});
        }
    }

    constructor(props: IScreenProps) {
        super(props);

        this.state = {
            systemTicks: [
                {pos:  375, isMiddle: true , color: "black"},
                {pos:   75, isMiddle: false, color: "black"},
                {pos:  225, isMiddle: false, color: "black"},
                {pos:  375, isMiddle: false, color: "black"},
                {pos:  525, isMiddle: false, color: "black"},
                {pos:  675, isMiddle: false, color: "black"},
            ],
            playerTicks: []
        };
    }

    render() {
        return (
            <canvas id="myCanvas" width="750" height="1" 
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
                //     this.state.systemTicks.map((tickInfo, i) => {
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

    private static readonly PIXELS_PER_SECOND = 60;

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
            borderRadius: "2px",
            border: "1px solid black"
        },
        marker: {
            position: "relative",
            width: "1px",
            height: `${Screen.HEIGHT}px`,
            color: "black",
            backgroundColor: "black"
        },
        midMarker: {
            left: "3px",
            width: "3px",
        },
        redMarker: {
            width: "2px",
            backgroundColor: "red"
        }
    };
}

export interface Tick {
    pos: number;
    isMiddle: boolean;
    color: string;
}

export interface IScreenProps {

}

export interface IScreenState {
    systemTicks: Tick[];
    playerTicks: Tick[];
}
