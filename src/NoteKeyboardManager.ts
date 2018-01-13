// import {INoteInfo} from "./models/INoteInfo";
import {EventEmitter} from "events";
// import {ICompositionNote} from "./models/ICompositionNote";
import {
    // getINoteInfoForPositionIndex, getUIPositionForNote, getUIPositionWithCharacter,
    NoteUIPositionList
} from "./models/NoteUIPositionList";
import {PlayerPageComponent} from "./components/pages/PlayerPageComponent";

export class NoteKeyboardManager extends EventEmitter {
    public static readonly KEY_START = "key_start";
    public static readonly KEY_END = "key_end";
    public static readonly STATE_CHANGED = "state_changed";

    pitchShift: number;
    // notes: INoteInfo[];
    down: IDownNote[];
    // played: ICompositionNote[];
    playerPageComponent: PlayerPageComponent;

    constructor(playerPageComponent: PlayerPageComponent) {
        super();

        // this.notes = notes;
        this.down = [];
        // this.played = [];
        // this.pitchShift = pitchShift;
        this.playerPageComponent = playerPageComponent;
    }

    // private isKeyboardEventForNote(note: INoteInfo, e: KeyboardEvent) {
    //     let position = getUIPositionForNote(note, this.pitchShift);
    //     return position.keyboardCharacter.toLowerCase() === e.key.toLowerCase();
    // }

    addDownKey(k: string): boolean {
        console.log(this.down);
        if (!this.down.filter(down => k === down.key)[0]) {
            this.down.push({
                key: k,
                start: new Date().getTime()
            });

            return true;
        }

        return false;
    }

    removeDownKey(k: string) {
        const toRemove = this.down.filter(down => k === down.key)[0] as IDownNote;
        this.down = this.down.filter(down => k !== down.key);
        let endTime = new Date().getTime();
        // const toPush: ICompositionNote = {
        //     noteInfo: toRemove.note,
        //     start: this.playerPageComponent.state.videoPosition * 1000 - (endTime - toRemove.start),
        //     end: this.playerPageComponent.state.videoPosition * 1000
        // };
        // this.played.push(toPush);
    }

    private emitStateChanged() {
        this.emit(NoteKeyboardManager.STATE_CHANGED, <ITotalNoteState> {
            down: this.down.slice(),
            // played: this.played.slice()
        });
    }

    public attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            let k = e.key.toLowerCase();
            if (this.addDownKey(k)) {
                this.emit(NoteKeyboardManager.KEY_START, k);
                this.emitStateChanged();
            }
            // for (let note of this.notes) {
            //     if (this.isKeyboardEventForNote(note, e)) {
            //         if (note.name == "Ds4") {
            //             this.playerPageComponent.handleOpenModal();
            //             break;
            //         }
            //         if (this.addDownNote(note)) {
            //             this.emit(NoteKeyboardManager.NOTE_START, note);
            //             this.emitStateChanged();
            //         }
            //     }
            // }
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            let k = e.key.toLowerCase();
            this.removeDownKey(k);
            this.emit(NoteKeyboardManager.KEY_END, k);
            this.emitStateChanged();
            // for (let note of this.notes) {
            //     if (this.isKeyboardEventForNote(note, e)) {
            //         if (note.name == "Ds4") {
            //             break;
            //         }
            //         this.removeDownNote(note);
            //         this.emit(NoteKeyboardManager.NOTE_END, note);
            //         this.emitStateChanged();
            //     }
            // }
        });
    }

    // public clearPlayedNotes(): void {
    //     this.played = [];
    //     this.emitStateChanged();
    // }
}

export interface IDownNote {
    key: string;
    start: number;
}

export interface ITotalNoteState {
    down: IDownNote[];
    // played: ICompositionNote[];
}

export function makeNewITotalNoteState() {
    let down: IDownNote[] = [];
    // let played: ICompositionNote[] = [];
    return {
        down: down,
        // played: played
    };
}