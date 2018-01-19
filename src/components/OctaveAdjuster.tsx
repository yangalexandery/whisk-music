import * as React from "react";
import * as Radium from "radium";

import { SidePanel } from "./SidePanel";
import { PlayerPageComponent } from "./pages/PlayerPageComponent";
import { Unselectable } from "../styles/GlobalStyles";

@Radium
export class OctaveAdjuster extends React.Component<IOctaveAdjusterProps, IOctaveAdjusterState> {
    props: IOctaveAdjusterProps;
    state: IOctaveAdjusterState;

    constructor(props: IOctaveAdjusterProps) {
    	super(props);

    	this.state = {
    		octave: this.props.parent.octave,
            // arrowDirectionLeft: props.arrowDirectionLeft
    	};
    }

    render() {
    	return (
    		<div style={[
    			OctaveAdjuster.styles.base,
                {display: "flex"}
    		]}>
                <div style={[
                    OctaveAdjuster.styles.arrow,
                    OctaveAdjuster.styles.flex,
                    Unselectable
                    // {borderRight: "1px solid black"}
                ]}>
                    {"<"}
                </div>
                <div style={[
                    {borderLeft: "1px solid black", borderRight: "1px solid black", flexGrow: "1", height: "100%", fontSize: "16px"},
                    OctaveAdjuster.styles.flex,
                    Unselectable
                ]}>
                    {"C" + (this.state.octave).toString() + "-" + "E" + (this.state.octave + 2).toString()}
                </div>
                <div style={[
                    OctaveAdjuster.styles.arrow,
                    OctaveAdjuster.styles.flex,
                    Unselectable
                    // {borderLeft: "1px solid black"}
                ]}>
                    {">"}
                </div>                
    		</div>
    	);
    }

    private arrow() {
        // if (this.state.arrowDirectionLeft) {
        //     return "<";
        // }
        return ">";
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


export interface IOctaveAdjusterProps {
    parent: PlayerPageComponent;
}


export interface IOctaveAdjusterState {
    octave: number;
}