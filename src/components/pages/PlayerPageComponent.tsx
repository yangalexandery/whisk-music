import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import * as Tone from "tone";
import * as Soundfont from "soundfont-player";

import { AudioOutputHelper } from "../../AudioOutputHelper";
import { INoteInfo } from "../../models/INoteInfo";
import { getStarterNotes } from "../../models/NoteInfoList";
import { Key } from "../Key";
import { InstrumentOption } from "../InstrumentOption";
import { NoteMap } from "./NoteMap";
import { Screen, ScreenModel } from "../Screen";
import { NoteUIPositionList } from "../../models/NoteUIPositionList";
import { NoteKeyboardManager } from "../../NoteKeyboardManager";
import { Metronome } from "../Metronome";
import { SidePanel } from "../SidePanel";

@Radium
export class PlayerPageComponent extends React.Component<IPlayerPageComponentProps, IPlayerPageComponentState> {
    props: IPlayerPageComponentProps;
    state: IPlayerPageComponentState;

    // Class variables
    noteKeyboardManager: NoteKeyboardManager;
    audioOutputHelper: Promise<AudioOutputHelper>;
    keyMapping: {[key: string]: INoteInfo};
    charToKey: {[keyChar: string]: Key};

    drawPending: boolean;
    rafId: any;
    time: number;
    synth: Tone.Synth;

    // Variables relating to recording and playing
    record: string;
    recordingTime: number;
    recordingKey: string;
    playMapping: {[key: string]: boolean};
    curKeys: {[key: string]: number};
    recordings: {[key: string]: string};
    loop: {[key: string]: number};

    // Variables relating to screen and metronome
    screen: Screen;
    screenModel: ScreenModel;
    instr: any;
    metronome: Metronome;
    metronomeInstr: any;
    precision: number = 4;
    framesSinceMetronomePlayed: number;
    ac: AudioContext
    keyToNotes: {[key: string]: any[]};
    soundOptionComponent: InstrumentOption;
    octave: number;
    octaveUp: boolean;


    constructor(props: IPlayerPageComponentProps) {
        super(props);

        // State variables
        this.state = {
            soundOption: 'acoustic_grand_piano',
            drawPending: false,
        };

        // Initialization of class variables
        this.keyMapping = {};
        this.playMapping = {
            '2': false,
            '4': false,
            '6': false
        };
        this.charToKey = {};
        this.curKeys = {};

        let starterNotes = getStarterNotes();
        this.audioOutputHelper = AudioOutputHelper.getInstance(starterNotes);
        this.keyMapping["z"] = starterNotes[0];
        this.keyMapping["x"] = starterNotes[1];
        this.keyMapping["c"] = starterNotes[2];

        this.keyToNotes = {};
        this.recordingKey = '';
        this.record = '';
        this.recordings = {
            '1': '',
            '3': '',
            '5': ''
        };
        this.loop = {
            '2': 0,
            '4': 0,
            '6': 0
        }
        this.noteKeyboardManager = new NoteKeyboardManager(this);
        this.noteKeyboardManager.attachListeners();
        this.octaveUp = false;
        this.octave = 3;

        // Keyboard listener to play sounds
        // TODO: REFACTOR THIS PART
        this.noteKeyboardManager.on(NoteKeyboardManager.KEY_START, (k: string) => {
            if (k in NoteMap) {
                this.screenModel.addPlayerTick();
                // this.instr.play(NoteMap[k]);
                
                if(!this.keyToNotes[k]) {
                    this.keyToNotes[k] = [];
                }
                //console.log(this.getNoteToPlay(k));
                this.keyToNotes[k].push(this.instr.play(this.getNoteToPlay(k)));
                if (this.recordingTime) {
                    let curTime = new Date().getTime();
                    this.record = this.record + 'Play ' + k + ' ' + NoteMap[k].note + ' ' + (this.roundToBeat(this.screenModel.bpm, curTime - this.recordingTime)) + ' ' + this.state.soundOption + '~';
                    this.curKeys[k] = curTime;
                }
            } else {

                // Z, X, C percussion keys

                if (k in this.keyMapping) {
                    this.screenModel.addPlayerTick();

                    if(!this.keyToNotes[k]) {
                        this.keyToNotes[k] = [];
                    }
                    this.audioOutputHelper.then(helper => {
                        this.keyToNotes[k].push(helper.playNote(this.keyMapping[k], true, 100000));
                    });
                    if (this.recordingTime) {
                        let curTime = new Date().getTime();
                        this.record = this.record + 'Play ' + k + ' ' + NoteMap[k].note + ' ' + (this.roundToBeat(this.screenModel.bpm, curTime - this.recordingTime)) + ' ' + this.state.soundOption + '~';
                        this.curKeys[k] = curTime;
                    }
                }
            } 

            if (k in this.recordings) {
                this.recordingKey = k;
                this.recordingTime = new Date().getTime();
                this.downKey(' ');
                this.metronome.mute = true;
                this.metronome.mute = false;
            }

            if (k in this.playMapping) {
                if (this.loop[k]) {
                    this.endLoop(k);
                } else{
                    var toPlay = this.recordings[String.fromCharCode(k.charCodeAt(0) - 1)];
                    this.playLoop(k, toPlay);
                }
            }

            if (k === 'm') {
                this.metronome.mute = !this.metronome.mute;
            }
            //console.log(k);
            if (k === 'shift') {
                this.octaveUp = true;
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
                if (this.recordingTime) {
                    let curTime = new Date().getTime();
                    this.record = this.record + 'Release ' + k + ' ' + NoteMap[k].note + ' ' + ((this.roundToBeat(this.screenModel.bpm, this.curKeys[k] - this.recordingTime)) + curTime - this.curKeys[k]) + ' ' + this.state.soundOption + '~';
                    this.curKeys[k] = 0;
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
                    if (this.recordingTime) {
                        let curTime = new Date().getTime();
                        this.record = this.record + 'Release ' + k + ' ' + NoteMap[k].note + ' ' + ((this.roundToBeat(this.screenModel.bpm, this.curKeys[k] - this.recordingTime)) + curTime - this.curKeys[k]) + ' ' + this.state.soundOption + '~';
                        this.curKeys[k] = 0;
                    }
                }
            }
            if (k === ' ') {
                if (!(this.recordingKey === '')) {
                    this.recordings[this.recordingKey] = this.record;
                    
                    // this.downloadRecording(this.recordingKey, this.record);
                    this.record = '';
                    this.recordingKey = '';
                    this.recordingTime = 0;
                    this.metronome.mute = true;
                }
            }
            if (k === 'shift') {
                this.octaveUp = false;
            }
        });


        // Initialize instrument
        this.raf();
        this.ac = new AudioContext();

        Soundfont.instrument(this.ac, this.state.soundOption).then(this.bindInstrument.bind(this));

        this.metronome = new Metronome();
        this.framesSinceMetronomePlayed = 0;
        this.metronome.on(Metronome.BEAT_START, (k: string) => {
            if (this.metronome && this.framesSinceMetronomePlayed > 10 ) {
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

    private roundUpToWholeBeat(bpm: number, time: number) {
        let msPerBeat = 60 * 1000 / bpm;
        let numBeats = Math.round(time / msPerBeat + 0.5);
        return numBeats * msPerBeat;
    }

    private roundToBeat(bpm: number, time: number) {
        let msPerBeat = 60 * 1000 / bpm / this.precision;
        let numBeats = Math.round(time / msPerBeat);
        return numBeats * msPerBeat;
    }

    bindPianoInstrument(instr: any) {
        this.instr = instr;
    }

    bindMetronome(instr: any) {
        this.metronomeInstr = instr;
    }

    private getNoteToPlay(k: string) {
        if (this.octaveUp) {
            // console.log(NoteMap[k].note + (NoteMap[k].octave + 1).toString());
            return NoteMap[k].note + (NoteMap[k].octave + this.octave + 1).toString();
        }
        return NoteMap[k].note + (NoteMap[k].octave + this.octave).toString();
    }

    private downKey(k: string) {
        if (this.noteKeyboardManager.addDownKey(k)) {
            this.noteKeyboardManager.emitStateChanged();
        }
    }

    // Triggers a note
    private triggerNote(recordingKey: string, tokens) {
        
        if (this.loop[recordingKey]) {
            // If instrument is not correct, set it to correct instrument
            if (!(tokens[4] === this.state.soundOption)) {
                this.setState({soundOption: tokens[4]});
                this.updateInstrument();
                // console.log("Instrument changed to " + note[4]);
            }
            let k = tokens[1];
            if (this.noteKeyboardManager.addDownKey(k)) {
                this.noteKeyboardManager.emit(NoteKeyboardManager.KEY_START, k);
                this.noteKeyboardManager.emitStateChanged();
            }
        }
        
    }

    // Releases a note
    private releaseNote(recordingKey: string, note) {
        let k = note[1];
        this.noteKeyboardManager.removeDownKey(k);
        this.noteKeyboardManager.emit(NoteKeyboardManager.KEY_END, k);
        this.noteKeyboardManager.emitStateChanged();
    }

    // Plays a recording string
    // TODO: Play recording from an uploaded file
    playRecord(k: string, record: string) {
        console.log("Key: " + k + ", Record: " + record);
        let lines = record.split('~');
        let currentTime: number = new Date().getTime();
        for (let i in lines) {
            let tokens = lines[i].split(' ');
            if (tokens[0] === 'Play') {
                // console.log("Set timeout trigger for note " + tokens[1]);
                setTimeout(this.triggerNote.bind(this, k, tokens), currentTime + Number(tokens[3]) - new Date().getTime());
            } else {
                // console.log("Set timeout release for note " + tokens[1]);
                setTimeout(this.releaseNote.bind(this, k, tokens), currentTime + Number(tokens[3]) - new Date().getTime());
            }
        }
    }

    playLoop(k: string, record: string) {
        let lines = record.split('~');

        if (lines.length >= 2) {
            let recordLength = this.roundUpToWholeBeat(this.screenModel.bpm, Number(lines[lines.length - 2].split(' ')[3]));
            let currentTime: number = new Date().getTime();
            console.log("Play loop of length " + recordLength + " of ");
            this.playRecord(k, record);
            this.loop[k] = setInterval(this.playRecord.bind(this, k, record), recordLength);
        }
        
    }

    endLoop(k: string) {
        clearInterval(this.loop[k]);
        console.log("Clearing loop from key " + k);
        this.loop[k] = 0;
    }

    render() {
        return (
            <div style={[
                PlayerPageComponent.styles.base,
                PlayerPageComponent.styles.flex
            ]}>
                <div style={{ width: "95%", height: "95%", display: "flex" }}>
                    <div style={{ width: "17%", height: "95%", float: "left"}}>
                        <SidePanel parent={this} leftPanel={true} />
                    </div>
                    <div style={{ width: "80%" }}>
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
                                        NoteUIPositionList.numberRow.notePositions.map((notePos, i) => {
                                            let k = notePos.keyboardCharacter.toLowerCase();

                                            return <Key key={i} notePosition={notePos} isSpace={false} color={notePos.color}
                                                        ref={(key) => {this.charToKey[k] = key;}}/>;
                                        })
                                    }
                                </div>
                                <div style={[
                                    PlayerPageComponent.styles.flex,
                                    PlayerPageComponent.styles.noteContainer
                                ]}>
                                    {
                                        NoteUIPositionList.topRow.notePositions.map((notePos, i) => {
                                            let k = notePos.keyboardCharacter.toLowerCase();

                                            return <Key key={i} notePosition={notePos} isSpace={false} color={notePos.color}
                                                        ref={(key) => {this.charToKey[k] = key;}}/>;
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

                                            return <Key key={i} notePosition={notePos} isSpace={false} color={notePos.color}
                                                        ref={(key) => {this.charToKey[k] = key;}}/>;
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

                                            return <Key key={i} notePosition={notePos} isSpace={false} color={notePos.color}
                                                        ref={(key) => {this.charToKey[k] = key;}}/>;
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

                                            return <Key key={i} notePosition={notePos} isSpace={true} color={notePos.color}
                                                        ref={(key) => {this.charToKey[k] = key;}}/>;
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public changeSoundOption(option: string) {
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
        this.updateInstrument();
    }

    // I don't think this is ever called because form is never submitted (no button)
    public handleFormSubmit(formSubmitEvent) {
        formSubmitEvent.preventDefault();
        this.updateInstrument();
    }

    downloadRecording(key: string, record: string) {
        let element = document.createElement("a");
        let file = new Blob([record], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = key + "-recording.txt";
        element.click();
    }

    downloadRecordings() {
        for (var i in this.recordings) {
            this.downloadRecording(i, this.recordings[i]);
        }
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
        let now = this.getTimeStamp();
        let deltaTime = now - (this.time || now);
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
    soundOption: string;
    drawPending: boolean;
}