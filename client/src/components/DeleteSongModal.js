import {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalStoreContext } from '../store'

function DeleteSongModal(props){
    const {store} = useContext(GlobalStoreContext);
    store.history = useHistory();

    function handleConfirmRemoveSong(event){
        event.stopPropagation();
        // store.editSong();
        // console.log("DELETE TEST" , store.markedIndex);
        store.addDeleteSongTransaction(store.markedIndex);
        store.closeModal("remove-song-modal");
    }

    function handleCancelRemoveSong(event) {
        event.stopPropagation();
        store.closeModal("remove-song-modal");
    }

    // let songName = store.currentList.songs[store.markedIndex];
    // let songName = "";
    // if(store.currentList != null && store.markedIndex != null){
    //     songName = store.currentList.songs[store.markedIndex].title;
    // }

    let deleteSongDialogBox = 
    <div
        id="remove-song-modal"
        // className={modalClass}
        className="modal" 
        data-animation="slideInOutLeft">
        <div className="modal-root" id='verify-remove-song-root'>
            <div className="modal-north">
                Remove Song?
            </div>
            <div className="modal-center">
                <div className="modal-center-content">
                    Are you sure you wish to permanently remove song from the playlist?
                </div>
            </div>
            <div className="modal-south">
                <input type="button" id="remove-song-confirm-button" className="modal-button" onClick={handleConfirmRemoveSong} value='Confirm' />
                <input type="button" id="remove-song-cancel-button" className="modal-button" onClick={handleCancelRemoveSong} value='Cancel' />
            </div>
        </div>
    </div>

    return(deleteSongDialogBox);
}

export default DeleteSongModal;