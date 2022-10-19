import {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalStoreContext } from '../store'

function DeleteListModal(props) {
    const {store} = useContext(GlobalStoreContext);
    store.history = useHistory();

    function handleConfirmDeleteList(event) {
        event.stopPropagation();
        // console.log()
        store.deleteList(store.markDeleteList._id);
        store.closeListModal();
    }

    function handleCancelDeleteList(event) {
        event.stopPropagation();
        store.closeListModal();
    }

    let listName = "";
    if(store.currentList == null && store.markDeleteList != null){
        listName = store.markDeleteList.name;
    }

    let deleteListDialogBox = 
        <div
            id="delete-list-modal"
            className="modal"
            data-animation="slideInOutLeft">
            <div className="modal-root" id='verify-delete-list-root'>
                <div className="modal-north">
                Delete Playlist?
                </div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently delete {listName} playlist?
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" id="remove-song-confirm-button" className="modal-button" onClick={handleConfirmDeleteList} value='Confirm' />
                    <input type="button" id="remove-song-cancel-button" className="modal-button" onClick={handleCancelDeleteList} value='Cancel' />
                </div>
            </div>
        </div>
    
    return deleteListDialogBox;
}

export default DeleteListModal;