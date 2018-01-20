export interface INoteUIPosition {
    keyboardCharacter: string;
    keyContent: string;
    content: string;
    index: number;
    color: string;
}

export function makeINoteUIPosition(content: string, keyContent: string, keyboardCharacter: string, index: number, color?: string) {
    if (color) {
    	return {
            content: content,
            keyContent: keyContent,
            keyboardCharacter: keyboardCharacter,
    		index: index,
    		color: color
    	}
    }
    return {
        content: content,
        keyContent: keyContent,
        keyboardCharacter: keyboardCharacter,
        index: index,
        color: "white"
    };
}