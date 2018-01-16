export interface INoteInfo {
    noteId: number;
    name: string;
    label: string;
    soundFileUrl: string
}

export function makeINoteInfo(id: number, name: string, label: string, soundFileUrl: string) {
    return {
        noteId: id,
        name: name,
        label: label,
        soundFileUrl: soundFileUrl,
    };
}