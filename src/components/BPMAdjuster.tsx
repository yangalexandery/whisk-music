import * as React from "react";
import * as Radium from "radium";

import { SidePanel } from "./SidePanel";
import { ScreenModel } from "./Screen";
import { Unselectable } from "../styles/GlobalStyles";

@Radium
export class BPMAdjuster extends React.Component<IBPMAdjusterProps, IBPMAdjusterState> {
    props: IBPMAdjusterProps;
    state: IBPMAdjusterState;

    constructor(props: IBPMAdjusterProps) {
    	super(props);

    	this.state = {
    		bpm: this.props.parent.bpm,
            leftHover: false,
            rightHover: false,
            // arrowDirectionLeft: props.arrowDirectionLeft
    	};
    }

    render() {
    	return (
    		<div style={[
    			BPMAdjuster.styles.base,
                {display: "flex"}
    		]}>
                <div style={[
                    BPMAdjuster.styles.arrow,
                    BPMAdjuster.styles.flex,
                    BPMAdjuster.styles.hoverState(this.state.leftHover),
                    Unselectable
                    // {borderRight: "1px solid black"}
                ]} onMouseEnter={this.toggleLeftHover.bind(this)} onMouseLeave={this.toggleLeftHover.bind(this)}
                onClick={this.decrementBPM.bind(this)}>
                    {"<"}
                </div>
                <div style={[
                    {borderLeft: "1px solid black", borderRight: "1px solid black", flexGrow: "1", height: "100%", fontSize: "15px"},
                    BPMAdjuster.styles.flex,
                    Unselectable
                ]}>
                    {(this.state.bpm).toString() + " BPM"}
                </div>
                <div style={[
                    BPMAdjuster.styles.arrow,
                    BPMAdjuster.styles.flex,
                    BPMAdjuster.styles.hoverState(this.state.rightHover),
                    Unselectable
                    // {borderLeft: "1px solid black"}
                ]} onMouseEnter={this.toggleRightHover.bind(this)} onMouseLeave={this.toggleRightHover.bind(this)}
                onClick={this.incrementBPM.bind(this)}>
                    {">"}
                </div>                
    		</div>
    	);
    }

    private toggleLeftHover() {
        this.setState({leftHover: !this.state.leftHover});
    }

    private toggleRightHover() {
        this.setState({rightHover: !this.state.rightHover});
    }

    private decrementBPM() {
        if (this.state.bpm > 32) {
            this.props.parent.setBPM(this.state.bpm - 4);
            this.setState({bpm: this.state.bpm - 4});
        }
    }

    private incrementBPM() {
        if (this.state.bpm < 240) {
            this.props.parent.setBPM(this.state.bpm + 4);
            this.setState({bpm: this.state.bpm + 4});
        }
    }
    // private toggleHover() {
    // 	this.setState({hover: !this.state.hover});
    // }

    // private onClick() {
    //     this.setState({arrowDirectionLeft: !this.state.arrowDirectionLeft});
    //     this.props.parent.toggleCollapse();
    // }

    private static styles = {
    	base: {
    		border: "1px solid black",
    		borderRadius: "4px",
    		boxSizing: "border-box",
    		height: "30px",
    		width: "125px",
    		// marginLeft: "0.25em",
    		// marginRight: "0.5em",
    		display: "flex",
    		justifyContent: "center",
    		alignItems: "center"
    	},
        flex: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row"
        },
    	hoverState: (hover: boolean) => {
    		if (hover) {
    			return {
    				backgroundColor: "#ccc",
    			}
    		}
    		return {};
    	},
        arrow: {
            height: "100%",
            width: "20px"
        }
    }
}


export interface IBPMAdjusterProps {
    parent: ScreenModel;
}


export interface IBPMAdjusterState {
    bpm: number;
    leftHover: boolean;
    rightHover: boolean;
}