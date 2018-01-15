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
			makeINoteUIPosition("W", 87, "#aaa"),
			makeINoteUIPosition("E", 69, "#aaa"),
			makeINoteUIPosition("R", 82),
			makeINoteUIPosition("T", 84, "#aaa"),
			makeINoteUIPosition("Y", 89, "#aaa"),
			makeINoteUIPosition("U", 85, "#aaa"),
			makeINoteUIPosition("I", 73),
			makeINoteUIPosition("O", 79, "#aaa"),
			makeINoteUIPosition("P", 80, "#aaa"),
			makeINoteUIPosition("[", 91)
		]
	}
}

function makeMiddleRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("A", 65, "#ddd"),
			makeINoteUIPosition("S", 83, "#ddd"),
			makeINoteUIPosition("D", 68, "#ddd"),
			makeINoteUIPosition("F", 70, "#ddd"),
			makeINoteUIPosition("G", 71, "#ddd"),
			makeINoteUIPosition("H", 72, "#ddd"),
			makeINoteUIPosition("J", 74, "#ddd"),
			makeINoteUIPosition("K", 75, "#ddd"),
			makeINoteUIPosition("L", 76, "#ddd"),
			makeINoteUIPosition(";", 59, "#ddd")
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