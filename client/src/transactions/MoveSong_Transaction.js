import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that creates a song
 * in the playlist. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, start, end) {
        super();
        this.store = initStore;
        this.startIndex = start;
        this.endIndex = end;
    }

    doTransaction() {
        this.store.moveSong(this.startIndex, this.endIndex);
    }
    
    undoTransaction() {
        this.store.moveSong(this.endIndex, this.startIndex);
    }
}