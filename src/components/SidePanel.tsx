import * as React from "react";
import * as Radium from "radium";

import { PlayerPageComponent } from "./pages/PlayerPageComponent";
import { Stopwatch } from "./pages/Stopwatch";
import { OpenSansFont } from "../styles/GlobalStyles";
import { SoundOptions } from "./SoundOptions";
import { NiceButton } from "./NiceButton";
import { OctaveAdjuster } from "./OctaveAdjuster";

@Radium
export class SidePanel extends React.Component<ISidePanelProps, ISidePanelState> {
    props: ISidePanelProps;
    state: ISidePanelState;


    constructor(props: ISidePanelProps) {
    	super(props);

    	this.state = {
    		collapsed: false,
    	};
    }

    render() {
        var DownloadButton = this.DownloadButton.bind(this);
        var FileSelector = this.FileSelector.bind(this);

        if (this.props.leftPanel) {
            return (
                <div style={[
                    {height: "100%", display: "flex"}, 
                    SidePanel.styles.border(this.props.leftPanel, this.state.collapsed)
                ]}>
                    <div style={[
                        OpenSansFont, 
                        { paddingTop: "2em", flexGrow: "1", height: "100%", float: "left"},
                        SidePanel.styles.collapsed(this.state.collapsed)
                    ]}>
                        <Stopwatch />
                        <br/>
                        <SoundOptions parent={this.props.parent}/>
                        {/*<br/> <br/>
                        <h1 style={{fontSize: '1.2em'}}>Play or Load Recording</h1>
                        <br/>
                        <RecordButton /> 
                        <br/>
                        <FileSelector />*/}
                        <DownloadButton />
                        {/*<FileSelector />*/}
                        <OctaveAdjuster parent={this.props.parent} />
                    </div>
                    <div style={[
                        SidePanel.styles.flex,
                        { width: "2.5em", height: "100%", float: "right"}
                    ]}>
                        <NiceButton parent={this} arrowDirectionLeft={true}/>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={[
                    {height: "100%", display: "flex"}, 
                    SidePanel.styles.border(this.props.leftPanel, this.state.collapsed)
                ]}>
                    <div style={[
                        SidePanel.styles.flex,
                        { width: "2.5em", height: "100%", float: "left"}
                    ]}>
                        <NiceButton parent={this} arrowDirectionLeft={false}/>
                    </div>
                    <div style={[
                        OpenSansFont, 
                        { paddingTop: "2em", flexGrow: "1", height: "100%", float: "right"},
                        SidePanel.styles.collapsed(this.state.collapsed)
                    ]}>

                    </div>
                </div>
            );                    
        }
    }

    toggleCollapse() {
        this.setState({collapsed: !this.state.collapsed});
    }

    private DownloadButton() {
        return (
            <div>
                <br/>
                <br/>
                <button onClick={() => this.props.parent.downloadRecordings()}>Download Recordings</button>
            </div>
        );
    }

    private handleChange(selectorFiles: FileList) {
        // console.log(selectorFiles[0]);
        let reader = new FileReader();
        reader.onload = function(){
            // console.log(reader.result);
            this.props.parent.playRecord(reader.result);

        }.bind(this);
        reader.readAsText(selectorFiles[0]);
    }

    private FileSelector() {
        return (
            <div>
                <input type="file" onChange={ (e) => this.handleChange.bind(this, e.target.files) } />
            </div>
        );
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
        flex: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row"
        },
        border: (leftPanel: boolean, collapse: boolean) => {
            if (collapse) {return {};}
            if (leftPanel) {
                return {borderRight: "0px solid black"};
            }
            return {borderLeft: "0px solid black"};
        },
        collapsed: (collapse: boolean) => {
            if (collapse) {
                return {display: "none"};
            }
            return {};
        }
    }
}


export interface ISidePanelProps {
    parent: PlayerPageComponent;
    leftPanel: boolean;
}


export interface ISidePanelState {
    collapsed: boolean;
}