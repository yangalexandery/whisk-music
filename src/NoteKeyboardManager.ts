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
        let key = this.playerPageComponent.charToKey[k];
        if (key && !key.state.down) {
            key.setState({down: new Date().getTime()});
            
            return true;
        }

        return false;
    }

    removeDownKey(k: string) {
        let key = this.playerPageComponent.charToKey[k];
        if (key && key.state.down) {
            key.setState({down: null});
        }
    }

    public emitStateChanged() {
        this.emit(NoteKeyboardManager.STATE_CHANGED, <ITotalNoteState> {
            down: this.down.slice(),
        });
    }

    public attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            let k = e.key.toLowerCase();
            if (this.addDownKey(k)) {
                this.emit(NoteKeyboardManager.KEY_START, k);
            }
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            let k = e.key.toLowerCase();
            this.removeDownKey(k);
            this.emit(NoteKeyboardManager.KEY_END, k);
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