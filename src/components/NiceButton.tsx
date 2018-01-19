import * as React from "react";
import * as Radium from "radium";

import { SidePanel } from "./SidePanel";
import { Unselectable } from "../styles/GlobalStyles";

@Radium
export class NiceButton extends React.Component<INiceButtonProps, INiceButtonState> {
    props: INiceButtonProps;
    state: INiceButtonState;


    constructor(props: INiceButtonProps) {
    	super(props);

    	this.state = {
    		hover: false,
            arrowDirectionLeft: props.arrowDirectionLeft
    	};
    }

    render() {
    	return (
    		<div style={[
    			NiceButton.styles.base,
    			NiceButton.styles.hoverState(this.state.hover),
                Unselectable
    		]} onMouseEnter={this.toggleHover.bind(this)} onMouseLeave={this.toggleHover.bind(this)}
            onClick={this.onClick.bind(this)}>
    		    {this.arrow()}
    		</div>
    	);
    }

    private arrow() {
        if (this.state.arrowDirectionLeft) {
            return "<";
        }
        return ">";
    }

    private toggleHover() {
    	this.setState({hover: !this.state.hover});
    }

    private onClick() {
        this.setState({arrowDirectionLeft: !this.state.arrowDirectionLeft});
        this.props.parent.toggleCollapse();
    }

    private static styles = {
    	base: {
    		border: "1px solid black",
    		borderRadius: "4px",
    		boxSizing: "border-box",
    		height: "75px",
    		width: "1.75em",
    		marginLeft: "0.25em",
    		marginRight: "0.5em",
    		display: "flex",
    		justifyContent: "center",
    		alignItems: "center"
    	},
    	hoverState: (hover: boolean) => {
    		if (hover) {
    			return {
    				backgroundColor: "#ccc",
    			}
    		}
    		return {};
    	}
    }
}


export interface INiceButtonProps {
    arrowDirectionLeft: boolean;
    parent: SidePanel;
}


export interface INiceButtonState {
	hover: boolean;
    arrowDirectionLeft: boolean;
}