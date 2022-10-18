import {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalStoreContext } from '../store'

function EditSongModal(props){
    const {store} = useContext(GlobalStoreContext);
    store.history = useHistory();


    let editSongDialogBox = 
    <div
        className="modal" 
        id="edit-song-modal" 
        data-animation="slideInOutLeft">
            <div className="modal-root" id='verify-edit-song-root'>
                <div className="modal-north">
                    Edit Song
                </div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        <div id="edit-modal-content">
                            <p>Title: </p> 
                            <input type="text" id="edit-song-title" />
                            <br />
                            <p>Artist: </p>
                            <input type="text" id="edit-song-artist" />
                            <br />
                            <p>YouTube Id: </p>
                            <input type="text" id="edit-song-youTubeId" />
                        </div>
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" 
                        id="edit-song-confirm-button" 
                        className="modal-button" 
                        onClick={this.props.editSongCallback}
                        value='Confirm' />
                    <input type="button" 
                        id="edit-song-cancel-button" 
                        className="modal-button" 
                        onClick={hideEditSongModalCallback}
                        value='Cancel' />
                </div>
            </div>
    </div>

    if(store.modalActive()){
        document.getElementById("edit-song-modal").classList.add("is-visible");
    }

    return(editSongDialogBox);
}

export default EditSongModal;