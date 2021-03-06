import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";
import {INoteUIPosition} from "../models/INoteUIPosition";

@Radium
export class Key extends React.Component<IKeyProps, IKeyState> {
    props: IKeyProps;
    state: IKeyState;

    constructor(props: IKeyProps) {
        super(props);

        this.state = {
            down: null,
            raise: false
        };
    }

    render() {
        return (
            <div style={[
                OpenSansFont,
                Key.styles.base,
                Key.styles.setColor(this.props.color),
                Key.styles.space(this.props.isSpace),
                Key.styles.downState(this.state.down),
                Key.styles.dummyState(this.props.notePosition.isDummy)
            ]}>
                <div style={[
                    OpenSansFont,
                    Key.styles.middle,
                    Key.styles.spaceMiddle(this.props.isSpace),
                    Key.styles.adjustFont(this.props.notePosition.content, this.props.isSpace)
                ]}>
                    {this.getContent()}
                </div>
                <div style={[
                    OpenSansFont,
                    Key.styles.corner
                ]}>
                    {this.props.notePosition.keyContent}
                </div>
            </div>
        );
    }

    setKeyRaise(status: boolean) {
        this.setState({raise: status});
    }

    private getContent() {
        if (this.state.raise) {
            return this.props.notePosition.content + "\u2191";
        }
        return this.props.notePosition.content;
    }

    private static readonly WIDTH = 50;
    private static readonly HEIGHT = 50;

    private static readonly SPACEWIDTH = 400;

    private static styles = {
        base: {
            width: `${Key.WIDTH}px`,
            height: `${Key.HEIGHT}px`,
            fontWeight: "bold",
            backgroundColor: "white",
            color: "black",
            marginLeft: "10px",
            marginRight: "10px",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            fontSize: "1em",
            borderRadius: "4px",
            border: "1px solid black"
        },
        middle: {
            width: `${Key.WIDTH - 20}px`,
            height: `${Key.HEIGHT - 20}px`,
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1em",
        },
        corner: {
            float: "right",
            width: "100%",
            height: "10px",
            fontSize: "0.5em",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "left",
            textAlign: "right",
            paddingRight: "4px",
        },
        setColor: (color: string) => {
            return {
                backgroundColor: color
            };
        },
        space: (isSpace: boolean) => {
            if (isSpace) {
                return {
                    width: `${Key.SPACEWIDTH}px`
                };
            }

            return {};
        },
        spaceMiddle: (isSpace: boolean) => {
            if (isSpace) {
                return {
                    width: `${Key.SPACEWIDTH - 20}px`
                }
            }
        },
        downState: (isDown: number) => {
            if (isDown) {
                return {
                    backgroundColor: "#ff9999"
                };
            }

            return {};
        },
        adjustFont: (content: string, isSpace: boolean) => {
            if (content.length > 2 && !isSpace) {
                return {
                    fontSize: "0.8em"
                }
            }
            return {};
        },
        dummyState: (isDummy: boolean) => {
            if (isDummy) {
                return {
                    border: "none",
                    color: "rgb(225, 225, 225)",
                    backgroundColor: "rgba(225, 225, 225, 0)"
                };
            }

            return {};
        }
    };
}

export interface IKeyProps {
    notePosition: INoteUIPosition;
    isSpace: boolean;
    color: string;
}

export interface IKeyState {
    down: number;
    raise: boolean;
}