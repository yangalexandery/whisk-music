export interface INoteUIPosition {
    keyboardCharacter: string;
    keyContent: string;
    content: string;
    index: number;
    color: string;
    isDummy: boolean;
}

export function makeINoteUIPosition(content: string, keyContent: string, keyboardCharacter: string, index: number, color?: string, isDummy = false) {
    if (color) {
    	return {
            content: content,
            keyContent: keyContent,
            keyboardCharacter: keyboardCharacter,
    		index: index,
            color: color,
            isDummy: isDummy
    	}
    }
    return {
        content: content,
        keyContent: keyContent,
        keyboardCharacter: keyboardCharacter,
        index: index,
        color: "white",
        isDummy: isDummy
    };
}