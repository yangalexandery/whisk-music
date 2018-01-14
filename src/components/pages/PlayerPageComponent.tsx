import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import * as Tone from "tone";

import {Key} from "../Key";
import {NoteMap} from "./NoteMap";
import {Screen} from "../Screen";
import {NoteUIPositionList} from "../../models/NoteUIPositionList";
import {ITotalNoteState, makeNewITotalNoteState, NoteKeyboardManager} from "../../NoteKeyboardManager";

@Radium
export class PlayerPageComponent extends React.Component<IPlayerPageComponentProps, IPlayerPageComponentState> {
    props: IPlayerPageComponentProps;
    state: IPlayerPageComponentState;

    noteKeyboardManager: NoteKeyboardManager;
    drawPending: boolean;
    rafId: any;
    time: number;
    //ac: AudioContext;
    //audio: AudioBuffer;
    synth: Tone.Synth;
    recording: number;
    record: string;
    exampleRecord: string;

    constructor(props: IPlayerPageComponentProps) {
        super(props);

        this.state = {
            noteState: {
                down: []
                // played: []
            },
            drawPending: false
        };

        //this.ac = new AudioContext();
        //this.audio = null;
        this.synth = new Tone.PolySynth(4, Tone.Synth).toMaster();
        this.recording = 0;
        this.record = '';
        this.exampleRecord = "Play j D4 444;Release j D4 651;Play k E4 997;Release k E4 1238;Play a E3 1603;Release a E3 1845;Play l F4 2186;Release l F4 2416;Play s F3 2884;Release s F3 3128;";
        

        this.noteKeyboardManager = new NoteKeyboardManager(this);
        this.noteKeyboardManager.attachListeners();

        // Play the example record
        //this.playRecord(this.exampleRecord);

        // Keyboard listener to play sounds
        this.noteKeyboardManager.on(NoteKeyboardManager.KEY_START, (k: string) => {
            if (k in NoteMap) {
                this.synth.triggerAttack(NoteMap[k]);
                if (this.recording) {
                    this.record = this.record + 'Play ' + k + ' ' + NoteMap[k] + ' ' + (new Date().getTime() - this.recording) + ';';
                    console.log(this.record);
                }
                
                /*this.loadSound("/res/" + noteMap[k] + ".mp3", () => {
                    this.playSound(this.audio);
                    console.log("Played sound with key " + k);
                })*/
            }
            if (k === ' ') {
                if (this.recording) {
                    console.log(this.record);
                    console.log("Stop recording");
                    this.recording = 0;
                    this.record = '';
                    // this.noteKeyboardManager.removeDownKey(' ');
                } else {
                    console.log("Start recording");
                    this.recording = new Date().getTime();
                    // this.noteKeyboardManager.addDownKey(' ');
                }


                
                /*if (this.isKeyDown(' ')) {
                    
                } else {
                    
                }*/

            }
        });

        // Keyboard listener to end sounds
        this.noteKeyboardManager.on(NoteKeyboardManager.KEY_END, (k: string) => {
            if (k in NoteMap) {
                this.synth.triggerRelease(NoteMap[k]);

                if (this.recording) {
                    this.record = this.record + 'Release ' + k + ' ' + NoteMap[k] + ' ' + (new Date().getTime() - this.recording) + ';';
                    console.log(this.record);
                }
                /*this.loadSound("/res/" + noteMap[k] + ".mp3", () => {
                    this.playSound(this.audio);
                    console.log("Played sound with key " + k);
                })*/
            }
        //     this.audioOutputHelper.then(helper => {
        //         this.singleNotePlayer.stopNote(helper, note);
        //     });
        });

        this.noteKeyboardManager.on(NoteKeyboardManager.STATE_CHANGED, (state: ITotalNoteState) => {
            this.setState({
                noteState: state
            });
        });
    }

    /* From https://www.html5rocks.com/en/tutorials/webaudio/intro/
    private loadSound(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        var self = this;

        // Decode asynchronously
        request.onload = function() {
            self.ac.decodeAudioData(request.response,
                 function(buffer) {
                     self.audio = buffer;
                     callback();
                 });
            
        }
        request.send();
        console.log(request.response);
    }*/

    /* From https://www.html5rocks.com/en/tutorials/webaudio/intro/
    private playSound(buffer) {
        var source = this.ac.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(this.ac.destination);
        source.start(0);
    }*/

    private playRecord(record: string) {
        var lines = record.split(';');
        //console.log(lines);

        //var time: number = new Date().getTime();
        for (var i in lines) {
            var tokens = lines[i].split(' ');
            console.log(tokens);
            console.log(tokens[1]);
            if (tokens[0] === 'Play') {
                console.log(tokens[1]);
                //setInterval(this.noteKeyboardManager.addDownKey(tokens[1]), tokens[3]);
                this.synth.triggerAttack(tokens[2], Number(tokens[3]) / 1000);
            } else {
                //setInterval(this.noteKeyboardManager.removeDownKey(tokens[1]), tokens[3]);
                this.synth.triggerRelease(tokens[2], Number(tokens[3]) / 1000);
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
        return (
            <div style={[
                PlayerPageComponent.styles.base,
                PlayerPageComponent.styles.flex
            ]}>
                <div style={{width: "100%"}}>
                    <div style={[
                        PlayerPageComponent.styles.flex,
                        PlayerPageComponent.styles.visualContainer
                    ]}>
                        <div style={[
                            PlayerPageComponent.styles.flex,
                            PlayerPageComponent.styles.screenContainer
                        ]}>
                            <Screen/>
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
                                        return <Key key={i} notePosition={notePos} isSpace={false}
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
                                        return <Key key={i} notePosition={notePos} isSpace={false}
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
                                        return <Key key={i} notePosition={notePos} isSpace={false}
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
                                        return <Key key={i} notePosition={notePos} isSpace={true}
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

    raf() {
        if (!this.drawPending) {
            this.drawPending = true;
            this.rafId = requestAnimationFrame(this.updateClock.bind(this));
        }
    }

    updateClock() {

    }

    // updateClock() {
    //     this.drawPending = false;
    //     let now = getTimeStamp();
    //     let deltaTime = now - (this.time || now);
    // }

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

export interface IPlayerPageComponentState {
    noteState: ITotalNoteState;
    drawPending: boolean;
}