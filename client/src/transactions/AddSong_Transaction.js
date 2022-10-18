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
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, currentList) {
        super();
        this.store = initStore;
        this.currentList = currentList;
    }

    doTransaction() {
        this.store.addNewSong(null, null);
    }
    
    undoTransaction() {
        this.store.deleteSong(this.currentList - 1);
    }
}