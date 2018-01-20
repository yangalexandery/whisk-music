import * as React from "react";
import * as Radium from "radium";

import { PlayerPageComponent } from "./pages/PlayerPageComponent";
import { InstrumentOption } from "./InstrumentOption";
import { OpenSansFont } from "../styles/GlobalStyles";


@Radium
export class SoundOptions extends React.Component<ISoundOptionsProps, ISoundOptionsState> {
    props: ISoundOptionsProps;
    state: ISoundOptionsState;


    constructor(props: ISoundOptionsProps) {
    	super(props);
    }

    render() {
    	return (
            <div className="container" style={{fontSize: "16px"}}>
                {/*<b>{"Change Instrument"}</b>*/}
                <div className="row">
                    <div className="col-sm-12">
                        <div style={{fontSize: "16px", marginTop: "15px"}}>
                            {"Change Instrument"}
                        </div>
                        <br/>
                        {
                            PlayerPageComponent.pianoInstrOptions.map((pianoInstrOption, i) => {
                                return <InstrumentOption key={i} value={pianoInstrOption.label} name={pianoInstrOption.name} pageOwner={this.props.parent}
                                        ref={(instrOption) => {
                                            if (instrOption && pianoInstrOption.label == this.props.parent.state.soundOption) {
                                                this.props.parent.soundOptionComponent = instrOption;
                                            }
                                        }}/>
                            })
                        }

                    </div>
                </div>
            </div>
    	);
    }

    private static styles = {

    }
}


export interface ISoundOptionsProps {
    parent: PlayerPageComponent;
}


export interface ISoundOptionsState {
    collapsed: false;
}