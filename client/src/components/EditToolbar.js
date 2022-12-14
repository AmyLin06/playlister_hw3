import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.clearTransactionStack();
        store.closeCurrentList();
    }
    function handleAddSong() {
        // store.addNewSong();
        store.addAddSongTransaction(store.closeCurrentList);
    }

    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus || store.modalActive || store.currentList == null}
                value="+"
                className={enabledButtonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={editStatus || store.modalActive || !store.hasUndoTransaction() || store.currentList == null}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
                // disabled={store.hasUndoTransaction}
            />
            <input
                type="button"
                id='redo-button'
                disabled={editStatus || store.modalActive || !store.hasRedoTransaction() || store.currentList == null}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
                // disabled={store.hasRedoTransaction}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus || store.modalActive || store.currentList == null}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;