import * as React from "react";
import * as Radium from "radium";

@Radium
export class TestPageComponent extends React.Component<ITestPageComponentProps, ITestPageComponentState> {
    props: ITestPageComponentProps;
    state: ITestPageComponentState;

    constructor(props: ITestPageComponentProps) {
        super(props);
    }

    render() {
        return (
            <div>
                TestPageComponent
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%"
        }
    }
}

export interface ITestPageComponentProps {

}

export interface ITestPageComponentState {

}