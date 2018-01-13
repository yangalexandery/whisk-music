import {INoteUIPosition, makeINoteUIPosition} from "./INoteUIPosition";

export interface INoteUIRow {
	notePositions: INoteUIPosition[];
	// rowType: UIRowType; 
}

export class NoteUIPositionList {
	static readonly topRow: INoteUIRow = makeTopRow();
	static readonly middleRow: INoteUIRow = makeMiddleRow();
	static readonly bottomRow: INoteUIRow = makeBottomRow();
	static readonly spaceRow: INoteUIRow = makeSpaceRow();
}

function makeTopRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("Q", 81),
			makeINoteUIPosition("W", 87),
			makeINoteUIPosition("E", 69),
			makeINoteUIPosition("R", 82),
			makeINoteUIPosition("T", 84),
			makeINoteUIPosition("Y", 89),
			makeINoteUIPosition("U", 85),
			makeINoteUIPosition("I", 73),
			makeINoteUIPosition("O", 79),
			makeINoteUIPosition("P", 80),
			makeINoteUIPosition("[", 91)
		]
	}
}

function makeMiddleRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("A", 65),
			makeINoteUIPosition("S", 83),
			makeINoteUIPosition("D", 68),
			makeINoteUIPosition("F", 70),
			makeINoteUIPosition("G", 71),
			makeINoteUIPosition("H", 72),
			makeINoteUIPosition("J", 74),
			makeINoteUIPosition("K", 75),
			makeINoteUIPosition("L", 76),
			makeINoteUIPosition(";", 59)
		]
	}
}

function makeBottomRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("Z", 90),
			makeINoteUIPosition("X", 88),
			makeINoteUIPosition("C", 67),
			makeINoteUIPosition("V", 86),
			makeINoteUIPosition("B", 66),
			makeINoteUIPosition("N", 78),
			makeINoteUIPosition("M", 77),
			makeINoteUIPosition(",", 44),
			makeINoteUIPosition(".", 46)
		]
	}
}

function makeSpaceRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("SPACE", 32)
		]
	}
}