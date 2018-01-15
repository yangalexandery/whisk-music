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
			makeINoteUIPosition("W", 87, "#777"),
			makeINoteUIPosition("E", 69, "#777"),
			makeINoteUIPosition("R", 82),
			makeINoteUIPosition("T", 84, "#777"),
			makeINoteUIPosition("Y", 89, "#777"),
			makeINoteUIPosition("U", 85, "#777"),
			makeINoteUIPosition("I", 73),
			makeINoteUIPosition("O", 79, "#777"),
			makeINoteUIPosition("P", 80, "#777"),
			makeINoteUIPosition("[", 91)
		]
	}
}

function makeMiddleRow(): INoteUIRow {
	return {
		notePositions: [
			makeINoteUIPosition("A", 65, "#eee"),
			makeINoteUIPosition("S", 83, "#eee"),
			makeINoteUIPosition("D", 68, "#eee"),
			makeINoteUIPosition("F", 70, "#eee"),
			makeINoteUIPosition("G", 71, "#eee"),
			makeINoteUIPosition("H", 72, "#eee"),
			makeINoteUIPosition("J", 74, "#eee"),
			makeINoteUIPosition("K", 75, "#eee"),
			makeINoteUIPosition("L", 76, "#eee"),
			makeINoteUIPosition(";", 59, "#eee")
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