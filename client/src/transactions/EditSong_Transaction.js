import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that creates a song
 * in the playlist. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, editSongIndex, oldSongData, newSongData) {
        super();
        this.store = initStore;
        this.index = editSongIndex;
        this.oldSong = oldSongData;
        this.newSong = newSongData;
    }

    doTransaction() {
        this.store.editSong(this.index, this.newSong);
    }
    
    undoTransaction() {
        this.store.editSong(this.index, this.oldSong);
    }
}