import {INoteUIPosition, makeINoteUIPosition} from "./INoteUIPosition";

export interface INoteUIRow {
	notePositions: INoteUIPosition[];
	// rowType: UIRowType; 
}

export class NoteUIPositionList {
	static readonly numberRow: INoteUIRow = makeNumberRow();
	static readonly topRow: INoteUIRow = makeTopRow();
	static readonly middleRow: INoteUIRow = makeMiddleRow();
	static readonly bottomRow: INoteUIRow = makeBottomRow();
	static readonly spaceRow: INoteUIRow = makeSpaceRow();
}

function makeNumberRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("1", " ", "1", 49, "#ccffff"),
			makeINoteUIPosition("2", " ", "2", 50, "#ccffff"),
			makeINoteUIPosition("3", " ", "3", 51, "#ccffff"),
			makeINoteUIPosition("4", " ", "4", 52, "#ccffff"),
			makeINoteUIPosition("5", " ", "5", 53, "#ccffff"),
			makeINoteUIPosition("6", " ", "6", 54, "#ccffff")
			/*makeINoteUIPosition("7", 55),
			makeINoteUIPosition("8", 56),
			makeINoteUIPosition("9", 57),
			makeINoteUIPosition("0", 48),
			makeINoteUIPosition("-", 45),
			makeINoteUIPosition("=", 61)*/
		]
	}
}

function makeTopRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition(" ", "Q", "Q", 81),
			makeINoteUIPosition("C#", "W", "W", 87, "#888"),
			makeINoteUIPosition("D#", "E", "E", 69, "#888"),
			makeINoteUIPosition(" ", "R", "R", 82),
			makeINoteUIPosition("F#", "T", "T", 84, "#888"),
			makeINoteUIPosition("G#", "Y", "Y", 89, "#888"),
			makeINoteUIPosition("A#", "U", "U", 85, "#888"),
			makeINoteUIPosition(" ", "I", "I", 73),
			makeINoteUIPosition("C#", "O", "O", 79, "#888"),
			makeINoteUIPosition("D#", "P", "P", 80, "#888"),
			makeINoteUIPosition(" ", "[", "[", 91)
		]
	}
}

function makeMiddleRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("C", "A", "A", 65, "#eee"),
			makeINoteUIPosition("D", "S", "S", 83, "#eee"),
			makeINoteUIPosition("E", "D", "D", 68, "#eee"),
			makeINoteUIPosition("F", "F", "F", 70, "#eee"),
			makeINoteUIPosition("G", "G", "G", 71, "#eee"),
			makeINoteUIPosition("A", "H", "H", 72, "#eee"),
			makeINoteUIPosition("B", "J", "J", 74, "#eee"),
			makeINoteUIPosition("C", "K", "K", 75, "#eee"),
			makeINoteUIPosition("D", "L", "L", 76, "#eee"),
			makeINoteUIPosition("E", ";", ";", 59, "#eee")
		]
	}
}

function makeBottomRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("Kick", "Z", "Z", 90, "#99ffcc"),
			makeINoteUIPosition("Snare", "X", "X", 88, "#99ffcc"),
			makeINoteUIPosition("Hihat", "C", "C", 67, "#99ffcc"),
			makeINoteUIPosition(" ", "V", "V", 86),
			makeINoteUIPosition(" ", "B", "B", 66),
			makeINoteUIPosition(" ", "N", "N", 78),
			makeINoteUIPosition("M", "M", "M", 77, "#ffff99"),
			makeINoteUIPosition(" ", ",", ",", 44),
			makeINoteUIPosition(" ", ".", ".", 46)
		]
	}
}

function makeSpaceRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("STOP RECORDING", "SPACE", " ", 32)
		]
	}
}