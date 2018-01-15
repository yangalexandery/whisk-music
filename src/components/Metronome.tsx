import * as React from "react";
import * as Radium from "radium";
import {EventEmitter} from "events";


export class Metronome extends EventEmitter {
	public static readonly BEAT_START = "beat_start";

	constructor() {
		super();
	}
}