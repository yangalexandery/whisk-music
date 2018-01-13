export interface INoteUIPosition {
    keyboardCharacter: string;
    index: number;
}

export function makeINoteUIPosition(keyboardCharacter: string, index: number) {
    return {
        keyboardCharacter: keyboardCharacter,
        index: index,
    };
}