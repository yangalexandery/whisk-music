import * as React from "react";
import * as Radium from "radium";

@Radium
export class NiceButton extends React.Component<INiceButtonProps, INiceButtonState> {
    props: INiceButtonProps;
    state: INiceButtonState;


    constructor(props: INiceButtonProps) {
    	super(props);

    	this.state = {
    		hover: false
    	};
    }

    render() {
    	return (
    		<div style={[
    			NiceButton.styles.base,
    			NiceButton.styles.hoverState(this.state.hover)
    		]} onMouseEnter={this.toggleHover.bind(this)} onMouseLeave={this.toggleHover.bind(this)}>
    		{"<"}
    		</div>
    	);
    }

    private toggleHover() {
    	this.setState({hover: !this.state.hover});
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

}


export interface INiceButtonState {
	hover: boolean;
}