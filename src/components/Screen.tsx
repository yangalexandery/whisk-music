import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";

@Radium
export class Screen extends React.Component<IScreenProps, IScreenState> {
    props: IScreenProps;
    state: IScreenState;

    canvas: HTMLCanvasElement;

    componentDidMount() {
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        const ctx = this.canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(375, 0);
        ctx.lineTo(375, 25);
        ctx.stroke();
    }

    constructor(props: IScreenProps) {
        super(props);

        this.state = {
            ticks: [
                {pos: -300},
                {pos: -200},
                {pos: -100},
                {pos: 0},
                {pos: 100},
                {pos: 200},
                {pos: 300}
            ]
        };
    }

    render() {
        return (
            <canvas id="myCanvas" width="750" height="25" ref={(canvas) => {this.canvas = canvas;}} style={[
                // OpenSansFont,
                Screen.styles.base
                // Screen.styles.dummyState(this.props.isDummy)
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
}

export interface IScreenProps {

}

export interface IScreenState {
    ticks: Tick[];
}
