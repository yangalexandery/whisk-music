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
    }

    render() {
        return (
            <div style={[
                OpenSansFont,
                Key.styles.base,
                Key.styles.space(this.props.isSpace),
                Key.styles.downState(this.props.isDown)
                // Key.styles.dummyState(this.props.isDummy)
            ]}>
                {this.props.notePosition.keyboardCharacter}
            </div>
        );
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1em",
            borderRadius: "4px",
            border: "1px solid black"
        },
        space: (isSpace: boolean) => {
            if (isSpace) {
                return {
                    width: `${Key.SPACEWIDTH}px`
                };
            }

            return {};
        },
        downState: (isDown: boolean) => {
            if (isDown) {
                return {
                    backgroundColor: "red"
                };
            }

            return {};
        }
        // dummyState: (isDummy: boolean) => {
        //     if (isDummy) {
        //         return {
        //             border: "none",
        //             color: "rgb(225, 225, 225)",
        //             backgroundColor: "rgba(225, 225, 225, 0)"
        //         };
        //     }

        //     return {};
        // }
    };
}

export interface IKeyProps {
    notePosition: INoteUIPosition;
    isSpace: boolean;
    isDown: boolean;
}

export interface IKeyState {

}