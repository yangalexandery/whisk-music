import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import {Key} from "../Key";
import {NoteUIPositionList} from "../../models/NoteUIPositionList";
import {ITotalNoteState, makeNewITotalNoteState, NoteKeyboardManager} from "../../NoteKeyboardManager";

@Radium
export class PlayerPageComponent extends React.Component<IPlayerPageComponentProps, IPlayerPageComponentState> {
    props: IPlayerPageComponentProps;
    state: IPlayerPageComponentState;

    noteKeyboardManager: NoteKeyboardManager;

    constructor(props: IPlayerPageComponentProps) {
        super(props);

        this.state = {
            noteState: {
                down: []
                // played: []
            }
        };

        this.noteKeyboardManager = new NoteKeyboardManager(this);

        this.noteKeyboardManager.attachListeners();

        this.noteKeyboardManager.on(NoteKeyboardManager.STATE_CHANGED, (state: ITotalNoteState) => {
            this.setState({
                noteState: state
            });
        });
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
                        PlayerPageComponent.styles.keyboardContainer
                    ]}>
                        <div>
                            <div style={[
                                PlayerPageComponent.styles.flex,
                                PlayerPageComponent.styles.noteContainer
                            ]}>
                                {
                                    NoteUIPositionList.topRow.notePositions.map((notePos, i) => {
                                        let k = notePos.keyboardCharacter;
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
                                        let k = notePos.keyboardCharacter;
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
                                        let k = notePos.keyboardCharacter;
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
                                        let k = notePos.keyboardCharacter;
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
            padding: "10px"
        },
        keyboardContainer: {
            width: "100%",
            height: "200px"
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
}