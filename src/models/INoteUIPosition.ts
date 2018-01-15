export interface INoteUIPosition {
    keyboardCharacter: string;
    index: number;
    color: string;
}

export function makeINoteUIPosition(keyboardCharacter: string, index: number, color?: string) {
    if (color) {
    	return {
    		keyboardCharacter: keyboardCharacter,
    		index: index,
    		color: color
    	}
    }
    return {
        keyboardCharacter: keyboardCharacter,
        index: index,
        color: "white"
    };
}