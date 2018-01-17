import * as React from "react";
import * as Radium from "radium";

import { PlayerPageComponent } from "./pages/PlayerPageComponent";

@Radium
export class InstrumentOption extends React.Component<IInstrumentOptionProps, IInstrumentOptionState> {
	props: IInstrumentOptionProps;
	state: IInstrumentOptionState;


	constructor(props: IInstrumentOptionProps) {
		super(props);

		this.state = {selected: this.props.pageOwner.state.soundOption === this.props.value};
	}

	render() {
		return (<div className="radio" style={[
					 InstrumentOption.styles.instrOption,
					 InstrumentOption.styles.selectedState(this.state.selected)
					 ]} onClick={this.handleClick.bind(this)}>
					{this.props.name}
	            </div>) 
	}

	handleClick() {
		console.log(this.props.value);

		if (this.props.pageOwner.soundOptionComponent) {
			this.props.pageOwner.soundOptionComponent.unSelect();
		}

		this.props.pageOwner.changeSoundOption(this.props.value);
		// this.props.pageOwner.soundOptionComponent = this;
		// this.props.pageOwner.setState({soundOption: this.props.value});
		this.setState({selected: true});
	}

	unSelect() {
		this.setState({selected: false});
	}

	private static styles = {
        instrOption: {
            height: "25px",
            marginBottom: "5px",
            marginLeft: "10px",
            marginRight: "10px",
            border: "1px solid black",
            borderRadius: "4px",
            padding: "5px",
            display: "flex",
            // justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
        },
        selectedState: (selected: boolean) => {
            if (selected) {
                return {
                    backgroundColor: "#aaa"
                };
            }

            return {};
        }	
    }
}

export interface IInstrumentOptionProps {
	pageOwner: PlayerPageComponent;

	key: number;
	value: string;
	name: string;
}

export interface IInstrumentOptionState {
	selected: boolean;
}