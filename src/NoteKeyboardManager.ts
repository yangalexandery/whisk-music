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

    addDownKey(k: string): boolean {
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

    public emitStateChanged() {
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
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            let k = e.key.toLowerCase();
            this.removeDownKey(k);
            this.emit(NoteKeyboardManager.KEY_END, k);
            this.emitStateChanged();
        });
    }
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