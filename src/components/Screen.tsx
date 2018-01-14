import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";

@Radium
export class Screen extends React.Component<IScreenProps, IScreenState> {
    props: IScreenProps;
    state: IScreenState;

    tmp: number;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

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

        // ctx.save();
        // ctx.beginPath();
        // ctx.strokeRect(125, 0, 1, 3);
        for (let tick of this.state.ticks) {
            ctx.strokeRect(tick.pos, 0, 1, 1);
            // ctx.moveTo(tick.pos, 0);
            // ctx.lineTo(tick.pos, 2);
        }
        // ctx.stroke();
        // ctx.restore();
    }

    clearCanvas() {
        this.canvas.width = this.canvas.width; // hacky way, but improves performance
        // const ctx = this.canvas.getContext("2d");

        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(deltaTime: number) {
        let maxPos = 375;

        for (let tick of this.state.ticks) {
            if (!tick.isMiddle) {
                tick.pos -= 1;
            }
            maxPos = Math.max(maxPos, tick.pos);
        }

        this.state.ticks = this.state.ticks.filter(tick => tick.pos > 0);

        if (maxPos < 600) {
            this.state.ticks.push({pos: maxPos + 150, isMiddle: false});
        }

        this.updateCanvas();
    }

    constructor(props: IScreenProps) {
        super(props);

        this.state = {
            ticks: [
                {pos:  375, isMiddle: true },
                {pos:   75, isMiddle: false},
                {pos:  225, isMiddle: false},
                {pos:  375, isMiddle: false},
                {pos:  525, isMiddle: false},
                {pos:  675, isMiddle: false},
            ]
        };

        this.tmp = 0;
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
                //     this.state.ticks.map((tickInfo, i) => {
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
}

export interface IScreenProps {

}

export interface IScreenState {
    ticks: Tick[];
}
