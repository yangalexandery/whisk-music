import {INoteInfo, makeINoteInfo} from "./INoteInfo";
import {resDir} from "../server/Server";
import * as path from "path";
import {rootPath} from "../server/Env";

export class NoteInfoList {
    static readonly notes: INoteInfo[] = [
        // NOTE IDs MUST CORRESPOND TO THEIR ORDERINGS
        // consider making this into a map
        makeINoteInfo(-1, "", "", ""),
        makeINoteInfo(0, "kick-drum-1", "Kick", getSoundFileUrl("kick-drum-1")),
        makeINoteInfo(1, "kick-drum-2", "Kick", getSoundFileUrl("kick-drum-2")),
        makeINoteInfo(10, "snare-drum-1", "Snare", getSoundFileUrl("snare-drum-1")),
        makeINoteInfo(11, "snare-drum-2", "Snare", getSoundFileUrl("snare-drum-2")),
        makeINoteInfo(12, "snare-drum-3", "Snare", getSoundFileUrl("snare-drum-3")),
        makeINoteInfo(13, "snare-drum-4", "Snare", getSoundFileUrl("snare-drum-4")),
        makeINoteInfo(20, "hihat-1", "Hihat", getSoundFileUrl("hihat-1")),
        makeINoteInfo(21, "hihat-2", "Hihat", getSoundFileUrl("hihat-2")),
        makeINoteInfo(22, "hihat-3", "Hihat", getSoundFileUrl("hihat-3")),
        makeINoteInfo(23, "hihat-4", "Hihat", getSoundFileUrl("hihat-4")),
    ];
}

function getSoundFileUrl(noteName: string): string {
    return rootPath + "res/notes/" + noteName + ".mp3";
}

// function makeSoundFileList(noteName: string): string[] {
//     return ["1", "2", "3", "4", "5", "6"].map(s => rootPath + "res/notes/" + noteName + "-" + s + ".mp3");
// }