import * as React from "react";
import * as ReactDom from "react-dom";

import {InitializationState} from "../models/IInitializationState";
import {TestPageComponent} from "../components/pages/TestPageComponent";
import {PlayerPageComponent} from "../components/pages/PlayerPageComponent";
import {StyleRoot} from "radium";

declare const initializedState: InitializationState;

ReactDom.render(
	<StyleRoot>
		<PlayerPageComponent/>
	</StyleRoot>,
	document.getElementById("app-container")
);