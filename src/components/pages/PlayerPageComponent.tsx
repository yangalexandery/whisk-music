import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import * as Tone from "tone";
import * as Soundfont from "soundfont-player";

import { AudioOutputHelper } from "../../AudioOutputHelper";
import { INoteInfo } from "../../models/INoteInfo";
import { NoteInfoList, getStarterNotes } from "../../models/NoteInfoList";
import { Key } from "../Key";
import { NoteMap } from "./NoteMap";
import { Stopwatch } from "./Stopwatch";
import { OpenSansFont } from "../../styles/GlobalStyles";
import { Screen, ScreenModel } from "../Screen";
import { NoteUIPositionList } from "../../models/NoteUIPositionList";
import { ITotalNoteState, makeNewITotalNoteState, NoteKeyboardManager } from "../../NoteKeyboardManager";
import { Metronome } from "../Metronome";

@Radium
export class PlayerPageComponent extends React.Component<IPlayerPageComponentProps, IPlayerPageComponentState> {
    props: IPlayerPageComponentProps;
    state: IPlayerPageComponentState;

    // Class variables
    noteKeyboardManager: NoteKeyboardManager;
    audioOutputHelper: Promise<AudioOutputHelper>;
    keyMapping: {[key: string]: INoteInfo};

    drawPending: boolean;
    rafId: any;
    time: number;
    synth: Tone.Synth;
    recording: number;
    record: string;
    exampleRecord: string;
    screen: Screen;
    screenModel: ScreenModel;
    instr: any;
    metronome: Metronome;
    metronomeInstr: any;
    framesSinceMetronomePlayed: number;
    ac: AudioContext
    keyToNotes: {[key: string]: any[]};

    constructor(props: IPlayerPageComponentProps) {
        super(props);

        // State variables
        this.state = {
            noteState: {
                down: [],
            },
            soundOption: 'acoustic_grand_piano',
            recording: 0,
            drawPending: false,
        };

        // Initialization of class variables
        this.keyMapping = {};

        let starterNotes = getStarterNotes();
        this.audioOutputHelper = AudioOutputHelper.getInstance(starterNotes);
        this.keyMapping["z"] = starterNotes[0];
        this.keyMapping["x"] = starterNotes[1];
        this.keyMapping["c"] = starterNotes[2];

        this.keyToNotes = {};
        this.recording = 0;
        this.record = '';
        this.noteKeyboardManager = new NoteKeyboardManager(this);
        this.noteKeyboardManager.attachListeners();

        // Keyboard listener to play sounds
        // TODO: REFACTOR THIS PART
        this.noteKeyboardManager.on(NoteKeyboardManager.KEY_START, (k: string) => {
            if (k in NoteMap) {
                this.screenModel.addPlayerTick();
                // this.instr.play(NoteMap[k]);
                
                if(!this.keyToNotes[k]) {
                    this.keyToNotes[k] = [];
                }
                this.keyToNotes[k].push(this.instr.play(NoteMap[k]));
                if (this.state.recording) {
                    this.record = this.record + 'Play ' + k + ' ' + NoteMap[k] + ' ' + (new Date().getTime() - this.state.recording) + ' ' + this.state.soundOption + ';';
                }
            } else {
                if (k in this.keyMapping) {
                    this.screenModel.addPlayerTick();

                    if(!this.keyToNotes[k]) {
                        this.keyToNotes[k] = [];
                    }
                    this.audioOutputHelper.then(helper => {
                        this.keyToNotes[k].push(helper.playNote(this.keyMapping[k], true, 100000));
                    });
                    if (this.state.recording) {
                        this.record = this.record + 'Play ' + k + ' ' + NoteMap[k] + ' ' + (new Date().getTime() - this.state.recording) + ' ' + this.state.soundOption + ';';
                    }
                }
            }
            if (k === 'm') {
                this.metronome.mute = !this.metronome.mute;
            }
        });

        // Keyboard listener to end sounds
        this.noteKeyboardManager.on(NoteKeyboardManager.KEY_END, (k: string) => {
            if (k in NoteMap) {// HACKY, will prob break with changes
                if (!this.keyToNotes[k]) {
                    this.keyToNotes[k] = [];
                }
                this.keyToNotes[k].map((note, i) => {
                    note.stop();
                });
                this.keyToNotes[k] = [];
                if (this.state.recording) {
                    this.record = this.record + 'Release ' + k + ' ' + NoteMap[k] + ' ' + (new Date().getTime() - this.state.recording) + ' ' + this.state.soundOption + ';';
                }
            } else {
                if (k in this.keyMapping) {
                    if (!this.keyToNotes[k]) {
                        this.keyToNotes[k] = [];
                    }
                    this.audioOutputHelper.then(helper => {
                        this.keyToNotes[k].map((note, i) => {
                            note.stop();
                        });
                    });
                    this.keyToNotes[k] = [];
                    if (this.state.recording) {
                        this.record = this.record + 'Release ' + k + ' ' + NoteMap[k] + ' ' + (new Date().getTime() - this.state.recording) + ' ' + this.state.soundOption + ';';
                    }
                }
            }
        });

        // Run if state changed
        this.noteKeyboardManager.on(NoteKeyboardManager.STATE_CHANGED, (state: ITotalNoteState) => {
            this.setState({
                noteState: state
            });
        });

        // Initialize instrument
        // TODO: Have multiple instruments that can be played at the same time
        this.raf();
        this.ac = new AudioContext();

        Soundfont.instrument(this.ac, this.state.soundOption).then(this.bindInstrument.bind(this));

        this.metronome = new Metronome();
        this.framesSinceMetronomePlayed = 0;
        this.metronome.on(Metronome.BEAT_START, (k: string) => {
            if (this.metronome && this.framesSinceMetronomePlayed > 10 ) {
                console.log("good");
                this.framesSinceMetronomePlayed = 0;
                if (!this.metronome.mute) {
                    this.metronomeInstr.play("D4").stop(this.ac.currentTime + 0.25);
                }
            }
        });
        Soundfont.instrument(this.ac, "taiko_drum").then(this.bindMetronome.bind(this));
        this.screenModel = new ScreenModel(750, this.metronome);
    }

    private bindInstrument(instr: any) {
        this.instr = instr;

        Soundfont.instrument(this.ac, this.state.soundOption).then(this.bindPianoInstrument.bind(this));//function (clavinet) {
    }

    bindPianoInstrument(instr: any) {
        this.instr = instr;
    }

    bindMetronome(instr: any) {
        this.metronomeInstr = instr;
    }

    // Triggers a note
    private triggerNote(note) {
        // If instrument is not correct, set it to correct instrument
        if (!(note[4] === this.state.soundOption)) {
            this.setState({soundOption: note[4]});
            this.updateInstrument();
            // console.log("Instrument changed to " + note[4]);
        }
        let k = note[1];
        if (this.noteKeyboardManager.addDownKey(k)) {
                this.noteKeyboardManager.emit(NoteKeyboardManager.KEY_START, k);
                this.noteKeyboardManager.emitStateChanged();
        }
    }

    // Releases a note
    private releaseNote(note) {
        let k = note[1];
        this.noteKeyboardManager.removeDownKey(k);
        this.noteKeyboardManager.emit(NoteKeyboardManager.KEY_END, k);
        this.noteKeyboardManager.emitStateChanged();
    }

    // Plays a recording string
    // TODO: Play recording from an uploaded file
    private playRecord(record: string) {
        var lines = record.split(';');
        var currentTime: number = new Date().getTime();
        for (var i in lines) {
            var tokens = lines[i].split(' ');
            if (tokens[0] === 'Play') {
                // console.log("Set timeout trigger for note " + tokens[1]);
                setTimeout(this.triggerNote.bind(this, tokens), currentTime + Number(tokens[3]) - new Date().getTime());
            } else {
                // console.log("Set timeout release for note " + tokens[1]);
                setTimeout(this.releaseNote.bind(this, tokens), currentTime + Number(tokens[3]) - new Date().getTime());
            }
        }
    }

    private isKeyDown(k: string): boolean {
        if (!k) {
            return false;
        }
        const isUserDown = this.state.noteState.down.filter(down => down.key === k).length === 1;
        return isUserDown;
    }

    render() {
        var SoundOptions = this.SoundOptions.bind(this);
        var RecordButton = this.RecordButton.bind(this);
        var FileSelector = this.FileSelector.bind(this);
        return (
            <div style={[

                PlayerPageComponent.styles.base,
                PlayerPageComponent.styles.flex
            ]}>
                <div style={{ width: "15%", paddingRight: "5em" }}>
                    <div style={[OpenSansFont]}>
                        <Stopwatch />
                        <br/>
                        <SoundOptions />
                        <br/> <br/>
                        <h1 style={{fontSize: '1.2em'}}>Play or Load Recording</h1>
                        <br/>
                        <RecordButton /> 
                        <br/>
                        <FileSelector />
                    </div>
                </div>
                <div style={{ width: "60%" }}>
                    <div style={[
                        PlayerPageComponent.styles.flex,
                        PlayerPageComponent.styles.visualContainer
                    ]}>
                        <div style={[
                            PlayerPageComponent.styles.flex,
                            PlayerPageComponent.styles.screenContainer
                        ]}>
                            <Screen ref={(screen) => {
                                if (screen) {
                                    this.screenModel.setScreen(screen);
                                }
                            }} screenModel={this.screenModel}/>
                        </div>
                    </div>
                    <div style={[
                        PlayerPageComponent.styles.flex,
                        PlayerPageComponent.styles.keyboardContainer
                    ]}>
                        <div>
                            <div style={[
                                PlayerPageComponent.styles.flex,
                                PlayerPageComponent.styles.noteContainer
                            ]}>
                                {
                                    NoteUIPositionList.topRow.notePositions.map((notePos, i) => {
                                        let k = notePos.keyboardCharacter.toLowerCase();
                                        // let note = getINoteInfoForPositionIndex(notePos.index, this.noteKeyboardManager.pitchShift, notePos.isDummy);
                                        return <Key key={i} notePosition={notePos} isSpace={false} color={notePos.color}
                                                    isDown={this.isKeyDown(k)}/>;
                                    })
                                }
                            </div>
                            <div style={[
                                PlayerPageComponent.styles.flex,
                                PlayerPageComponent.styles.noteContainer
                            ]}>
                                {
                                    NoteUIPositionList.middleRow.notePositions.map((notePos, i) => {
                                        let k = notePos.keyboardCharacter.toLowerCase();
                                        // let note = getINoteInfoForPositionIndex(notePos.index, this.noteKeyboardManager.pitchShift, notePos.isDummy);
                                        return <Key key={i} notePosition={notePos} isSpace={false} color={notePos.color}
                                                    isDown={this.isKeyDown(k)}/>;
                                    })
                                }
                            </div>
                            <div style={[
                                PlayerPageComponent.styles.flex,
                                PlayerPageComponent.styles.noteContainer
                            ]}>
                                {
                                    NoteUIPositionList.bottomRow.notePositions.map((notePos, i) => {
                                        let k = notePos.keyboardCharacter.toLowerCase();
                                        // let note = getINoteInfoForPositionIndex(notePos.index, this.noteKeyboardManager.pitchShift, notePos.isDummy);
                                        return <Key key={i} notePosition={notePos} isSpace={false} color={notePos.color}
                                                    isDown={this.isKeyDown(k)}/>;
                                    })
                                }
                            </div>
                            <div style={[
                                PlayerPageComponent.styles.flex,
                                PlayerPageComponent.styles.noteContainer
                            ]}>
                                {
                                    NoteUIPositionList.spaceRow.notePositions.map((notePos, i) => {
                                        let k = " ";
                                        // let note = getINoteInfoForPositionIndex(notePos.index, this.noteKeyboardManager.pitchShift, notePos.isDummy);
                                        return <Key key={i} notePosition={notePos} isSpace={true} color={notePos.color}
                                                    isDown={this.isKeyDown(k)}/>;
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private changeSoundOption(option: string) {
        this.setState({ soundOption: option });
        this.updateInstrument();
    }


    private updateInstrument() {
        Soundfont.instrument(this.ac, this.state.soundOption).then(this.bindInstrument.bind(this));
    }

    private handleOptionChange(changeEvent) {
        this.setState({
            soundOption: changeEvent.target.value
        });
        // Doesn't work for some reason, delayed by one change: this.updateInstrument();
    }

    // I don't think this is ever called because form is never submitted (no button)
    private handleFormSubmit(formSubmitEvent) {
        formSubmitEvent.preventDefault();
        this.updateInstrument();
    }

    // Radio buttons to toggle sound types
    private SoundOptions() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <h1 style={{fontSize: '1.2em'}}>Change Instrument</h1>
                        <br/>
                        <form onSubmit={this.handleFormSubmit.bind(this)}>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="acoustic_grand_piano" checked={this.state.soundOption === 'acoustic_grand_piano'} onChange={this.handleOptionChange.bind(this)} />
                                    Piano

                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="clavinet" checked={this.state.soundOption === 'clavinet'} onChange={this.handleOptionChange.bind(this)} />
                                    Clavinet
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="marimba" checked={this.state.soundOption === 'marimba'} onChange={this.handleOptionChange.bind(this)} />
                                    Marimba
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="alto_sax" checked={this.state.soundOption === 'alto_sax'} onChange={this.handleOptionChange.bind(this)} />
                                    Alto Sax
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="bassoon" checked={this.state.soundOption === 'bassoon'} onChange={this.handleOptionChange.bind(this)} />
                                    Bassoon
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="clarinet" checked={this.state.soundOption === 'clarinet'} onChange={this.handleOptionChange.bind(this)} />
                                    Clarinet
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="flute" checked={this.state.soundOption === 'flute'} onChange={this.handleOptionChange.bind(this)} />
                                    Flute
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="cello" checked={this.state.soundOption === 'cello'} onChange={this.handleOptionChange.bind(this)} />
                                    Cello
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="violin" checked={this.state.soundOption === 'violin'} onChange={this.handleOptionChange.bind(this)} />
                                    Violin
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="steel_drums" checked={this.state.soundOption === 'steel_drums'} onChange={this.handleOptionChange.bind(this)} />
                                    Steel Drums
                                </label>
                            </div>

                            <div className="radio">
                                <label>
                                    <input type="radio" value="woodblock" checked={this.state.soundOption === 'woodblock'} onChange={this.handleOptionChange.bind(this)} />
                                    Woodblock
                                </label>
                            </div>
                            <br />
                            <button className="btn btn-default" type="submit">Change Instrument</button>
                        </form>

                    </div>
                </div>
            </div>
        );
    }


    private handleRecording() {
        if (this.state.recording) {

            // Download the recording
            var element = document.createElement("a");
            var file = new Blob([this.record], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = "recording.txt";
            element.click();

            this.setState({ recording: 0 });
            this.record = '';

        } else {
            // Start recording
            this.setState({ recording: new Date().getTime() });
        }
    }

    // Button to record compositions
    private RecordButton() {
        return (
            <div>
                <button onClick={() => this.handleRecording()}>{this.state.recording ? 'Stop Recording' : 'Start Recording'}</button>
            </div>
        );
    }

    private handleChange(selectorFiles: FileList) {
        // console.log(selectorFiles[0]);
        var reader = new FileReader();
        reader.onload = function(){
            // console.log(reader.result);
            this.playRecord(reader.result);

        }.bind(this);
        reader.readAsText(selectorFiles[0]);
    }

    private FileSelector() {
        return (
            <div>
                <input type="file" onChange={ (e) => this.handleChange(e.target.files) } />
            </div>
        );
    }

    getTimeStamp() {
        return performance.now(); // let's just do this for now
        // return IS_IOS ? new Date().getTime() : performance.now();
    }

    // Request animation frame
    raf() {
        if (!this.drawPending) {
            this.drawPending = true;
            this.rafId = requestAnimationFrame(this.updateClock.bind(this));
        }
    }

    updateClock() {
        this.drawPending = false;
        var now = this.getTimeStamp();
        var deltaTime = now - (this.time || now);
        this.time = now;

        if (this.screenModel) {
            this.screenModel.update(deltaTime);
        }
        // TODO: updateMetronome(deltaTime);

        this.framesSinceMetronomePlayed++;
        // updateMetronome(deltaTime);

        this.raf();
    }

    private static readonly buttonColor = "rgb(192, 192, 192)";
    private static styles = {
        base: {
            width: "100vw",
            height: `calc(100vh)`// - ${ControllerBarComponent.HEIGHT})`
        },
        share: {
            opacity: 0.5,
            transition: "200ms",
            cursor: "pointer",
            fontSize: "2em",
            marginBottom: "20px",
            userSelect: "none",
            ":hover": {
                opacity: 1,
                fontWeight: "bold",
            }
        },
        flex: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row"
        },
        flexCol: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        },
        homeButton: {
            padding: "10px 5px 10px 5px",
            backgroundColor: "white",
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "black",
            border: "none",
            cursor: "pointer",
            transition: "200ms",
            fontSize: "3em",
            opacity: 0.4,
            ":hover": {
                opacity: 1,
                transform: "scale(1.1)"
            }
        },
        flootifyButton: {
            position: "initial",
            textAlign: "center",
            top: "initial",
            left: "initial",
            margin: "0 auto",
            fontSize: "2em",
        },
        pitchButtonsContainer: {
            width: "15%",
            height: "200px"
        },
        noteContainer: {
            width: "100%",
            padding: "10px 0px 10px 0px"
        },
        keyboardContainer: {
            width: "100%",
            height: "350px"
        },
        visualContainer: {
            width: "100%",
            height: "200px",
        },
        screenContainer: {
            width: "750px",
            height: "25px",
            backgroundColor: "gray"
        },
        buttonContainer: {
            width: "100%"
        },
        button: {
            border: "none",
            padding: "15px",
            margin: "15px",
            fontSize: "0.8em",
            cursor: "pointer",
            backgroundColor: color(PlayerPageComponent.buttonColor).hex(),
            ":hover": {
                backgroundColor: color(PlayerPageComponent.buttonColor).darken(0.5).hex()
            },
            ":disabled": {
                backgroundColor: color(PlayerPageComponent.buttonColor).lighten(0.2).hex(),
                cursor: "initial"
            }
        },
        youtubeIdInput: {
            width: "300px",
            padding: "10px 10px 10px 10px",
            borderRadius: "4px",
            transition: "200ms",
            border: "1px solid rgb(200, 200, 200)",
            outline: "none",
            margin: "20px",
            ":focus": {
                boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.5)"
            }
        },
        overlay: {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            backgroundColor: "rgba(255, 255, 255, 0.8)"
        }
    };
}

export interface IPlayerPageComponentProps {

}

// State variables
export interface IPlayerPageComponentState {
    noteState: ITotalNoteState;
    soundOption: string;
    recording: number;
    drawPending: boolean;
}