import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import * as Tone from "tone";
import * as Soundfont from "soundfont-player";

import {Key} from "../Key";
import {NoteMap} from "./NoteMap";
import {OpenSansFont} from "../../styles/GlobalStyles";
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

    screen: Screen;
    instr: any;
    ac: AudioContext
    keyToNotes: {[key: string]: any[]};

    constructor(props: IPlayerPageComponentProps) {
        super(props);

        this.state = {
            noteState: {
                down: [],
                // played: []
            },
            soundOption: '',
            drawPending: false,
            pianoInstrument: "acoustic_grand_piano"
        };

        //this.ac = new AudioContext();
        //this.audio = null;
        this.synth = new Tone.PolySynth(4, Tone.Synth).toMaster();
        this.recording = 0;
        this.record = '';
        this.exampleRecord = "Play j D4 444;Release j D4 651;Play k E4 997;Release k E4 1238;Play a E3 1603;Release a E3 1845;Play l F4 2186;Release l F4 2416;Play s F3 2884;Release s F3 3128;";
        this.keyToNotes = {};

        this.noteKeyboardManager = new NoteKeyboardManager(this);
        this.noteKeyboardManager.attachListeners();

        // Play the example record
        //this.playRecord(this.exampleRecord);

        // Keyboard listener to play sounds
        this.noteKeyboardManager.on(NoteKeyboardManager.KEY_START, (k: string) => {
            this.screen.addPlayerTick();
            if (k in NoteMap) {
                // this.instr.play(NoteMap[k]);
                if(!this.keyToNotes[k]) {
                    this.keyToNotes[k] = [];
                }
                this.keyToNotes[k].push(this.instr.play(NoteMap[k]));
                // this.synth.triggerAttack(NoteMap[k]);
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
                if (!this.keyToNotes[k]) {
                    this.keyToNotes[k] = [];
                }

                this.keyToNotes[k].map((note, i) => {
                    note.stop();
                });
                this.keyToNotes[k] = [];
                // this.synth.triggerRelease(NoteMap[k]);

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

        this.raf();

        this.ac = new AudioContext();
        Soundfont.instrument(this.ac, this.state.pianoInstrument).then(this.bindPianoInstrument.bind(this));//function (clavinet) {
            // clavinet.play('C4');
            // this.time = 0.0;
            // this.instr = clavinet;
        // });
    }

    bindPianoInstrument(instr: any) {
        this.instr = instr
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

    private _create() {
        alert("Moo!");
    }

    render() {
        var SoundOptions = this.SoundOptions.bind(this)
        return (

            <div style={[
                
                PlayerPageComponent.styles.base,
                PlayerPageComponent.styles.flex
            ]}>
                <div style={{width: "15%", paddingRight: "5em"}}>
                <div style={[OpenSansFont]}>
                    <SoundOptions />
                </div>
                </div>
                <div style={{width: "60%"}}>
                    <div style={[
                        PlayerPageComponent.styles.flex,
                        PlayerPageComponent.styles.visualContainer
                    ]}>
                        <div style={[
                            PlayerPageComponent.styles.flex,
                            PlayerPageComponent.styles.screenContainer
                        ]}>
                            <Screen ref={(screen) => {this.screen = screen;}}/>
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

    private handleOptionChange(changeEvent) {
        this.setState({
              soundOption: changeEvent.target.value
        });
    }

    private handleFormSubmit(formSubmitEvent) {
        formSubmitEvent.preventDefault();
        console.log(this.state.soundOption);
        switch (this.state.soundOption) {
            
            case 'Synth':
                this.synth = new Tone.PolySynth(4, Tone.Synth).toMaster();
                break;
            case 'MonoSynth':
                this.synth = new Tone.PolySynth(4, Tone.MonoSynth).toMaster();
                break;
            case 'PluckSynth':
                this.synth = new Tone.PolySynth(4, Tone.PluckSynth).toMaster();
                break;
            case 'MembraneSynth':
                this.synth = new Tone.PolySynth(4, Tone.MembraneSynth).toMaster();
                break;
            default:
                console.log("Default option");
        }
        
        //console.log('You have selected:' + this.state.soundOption);
    }

    SoundOptions() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">

            <form onSubmit={this.handleFormSubmit.bind(this)}>
            <div className="radio">
                <label>
                  <input type="radio" value="Synth" checked={this.state.soundOption === 'Synth'} onChange={this.handleOptionChange.bind(this)} />
                  Synth
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="MonoSynth" checked={this.state.soundOption === 'MonoSynth'} onChange={this.handleOptionChange.bind(this)} />
                  Mono Synth
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="PluckSynth" checked={this.state.soundOption === 'PluckSynth'} onChange={this.handleOptionChange.bind(this)}/>
                  Pluck Synth
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="MembraneSynth" checked={this.state.soundOption === 'MembraneSynth'} onChange={this.handleOptionChange.bind(this)}/>
                  Membrane Synth
                </label>
              </div>
              <br />
              <button className="btn btn-default" type="submit">Change Synth</button>
            </form>

          </div>
        </div>
      </div>
    );
    }

    getTimeStamp() {
        return performance.now(); // let's just do this for now
        // return IS_IOS ? new Date().getTime() : performance.now();
    }

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

        if (this.screen) {
            this.screen.update(deltaTime);
        }
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

export interface IPlayerPageComponentState {
    noteState: ITotalNoteState;
    soundOption: string;
    drawPending: boolean;
    pianoInstrument: string;
}