import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
// import EditSongModal from './components'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_SONG: "MARK_SONG",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        markDeleteList: null,
        markedIndex: null,
        modalActive: false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markDeleteList: payload.idNamePair,
                    modalActive: payload.modalBool
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            //MARK SONG FOR DELETE & EDIT
            case GlobalStoreActionType.MARK_SONG: {
                return setStore({
                    modalActive: payload.modalBool,
                    markedIndex: payload.index,
                    currentList: payload.currentList,
                    idNamePairs: store.idNamePairs
                })
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            console.log(response)
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log(playlist)
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        // tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    store.clearTransactionStack = function () {
        tps.clearAllTransactions();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }

    // store.isListNameEditActive = function() {
    //     return store.listNameActive;
    // }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    store.hasUndoTransaction = function () {
        return tps.hasTransactionToUndo();
    }

    store.hasRedoTransaction = function () {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    //ADD LIST FUNCTION
    store.createNewList = function () {
        async function asyncCreateNewList(){
            let newList = {name: "Untitled" + (store.idNamePairs.length + 1) , songs: []}
            let response = await api.createNewPlaylist(newList);
            let playlist = response.data.playlist;
            if (response.data.success) {
                async function getListPairs(playlist){
                    response = await api.getPlaylistPairs();
                    if(response.data.success){
                        let pairArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: {
                                idNamePairs: pairArray,
                                playlist: playlist
                            }
                        })
                    }
                }
                getListPairs(playlist);
            }
            store.setCurrentList(playlist._id);
        }
        asyncCreateNewList();
    }

    //ADD SONG FUNCTION
    store.addNewSong = function (index, song){
        //GET THE CURRENTLIST
        async function asyncAddNewSong() {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(index == null || song == null){
                    let newSong = {title: "Untitled", artist: "Unknown", youTubeId: "dQw4w9WgXcQ"}
                    playlist.songs.push(newSong);
                }else{
                    playlist.songs.splice(index, 0, song);
                }

                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if(response.data.success) {
                        async function getPlaylistById () {
                            response = await api.getPlaylistById(store.currentList._id);
                            if(response.data.success){
                                let newPlaylist = response.data.playlist;
                                storeReducer({
                                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                                    payload: newPlaylist
                                });
                            }
                        }
                        getPlaylistById();
                    }
                }
                updateList(playlist);
            }
        }
        asyncAddNewSong();
    }

    //MARK LIST FOR DELETION
    store.markListforDeletion = function(idNamePair) {
        let modalStatus = !store.modalActive;
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: {
                idNamePair: idNamePair,
                modalBool: modalStatus,
            }
        });
    }

    //FUNCTION TO DELETE LIST
    store.deleteList = function(id) {
        async function asyncDeleteList(id) {
            let response = await api.deletePlaylist(id);
            if(response.data.success) {
                async function getListPairs(){
                    response = await api.getPlaylistPairs();
                    if(response.data.success){
                        let pairArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: pairArray
                        })
                    }
                }
                getListPairs();
            }
        }
        asyncDeleteList(id);
    }

    //DELETE SONG FUNCTION
    store.deleteSong = function (index){
        //GET THE CURRENTLIST
        async function asyncDeleteSong(index) {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.splice(index, 1);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if(response.data.success) {
                        async function getPlaylistById () {
                            response = await api.getPlaylistById(store.currentList._id);
                            if(response.data.success){
                                let newPlaylist = response.data.playlist;
                                storeReducer({
                                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                                    payload: newPlaylist
                                });
                            }
                        }
                        getPlaylistById();
                    }
                }
                updateList(playlist);
            }
        }
        asyncDeleteSong(index);
    }

    //EDIT SONG
    store.markSong = function (index){
        let modalStatus = !store.modalActive;
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: {
                index: index,
                modalBool: modalStatus,
                currentList: store.currentList
            }
        });
    }

    
    store.showModal = function(modalType) {
        document.getElementById(modalType).classList.add("is-visible");
    }

    store.closeModal = function (modalType){
        document.getElementById(modalType).classList.remove("is-visible");

        let modalStatus = !store.modalActive;
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: {
                index: null,
                modalBool: modalStatus,
                currentList: store.currentList
            }
        });
    }

    store.closeListModal = function (){
        document.getElementById("delete-list-modal").classList.remove("is-visible");
        let modalStatus = !store.modalActive;
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: {
                idNamePair: null,
                modalBool: modalStatus,
            }
        });
    }

    store.editSong = function(index, song){
         //GET THE CURRENTLIST
         async function asyncEditSong(index, song) {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.splice(index, 1, song);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if(response.data.success) {
                        async function getPlaylistById () {
                            response = await api.getPlaylistById(store.currentList._id);
                            if(response.data.success){
                                let newPlaylist = response.data.playlist;
                                storeReducer({
                                    type: GlobalStoreActionType.MARK_SONG,
                                    payload: {
                                        index: null,
                                        modalBool: !store.modalActive,
                                        currentList: newPlaylist
                                    }
                                });
                            }
                        }
                        getPlaylistById();
                    }
                }
                updateList(playlist);
            }
        }
        asyncEditSong(index, song);
    } 

    
    // MOVE SONG
    store.moveSong = function(start, end) {
        async function asyncMoveSong(start, end) {
            let response = await api.getPlaylistById(store.currentList._id);
            if(response.data.success) {
                const list = response.data.playlist;
                if (start < end) {
                    let temp = list.songs[start];
                    for (let i = start; i < end; i++) {
                        list.songs[i] = list.songs[i + 1];
                    }
                    list.songs[end] = temp;
                }
                else if (start > end) {
                    let temp = list.songs[start];
                    for (let i = start; i > end; i--) {
                        list.songs[i] = list.songs[i - 1];
                    }
                    list.songs[end] = temp;
                }
                async function updateList(list) {
                    console.log("updating")
                    let response = await api.updatePlaylistById(list._id, list);
                    if(response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: list
                        });
                    }
                }
                updateList(list);
            }
        }
        asyncMoveSong(start, end);
    }

    //TRANSACTIONS
    store.addAddSongTransaction = (list) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let transaction = new AddSong_Transaction(store, list);
        tps.addTransaction(transaction);
    }

    store.addDeleteSongTransaction = (index) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = store.currentList.songs[index];
        let transaction = new DeleteSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }

    store.addMoveSongTransaction = (startIndex, endIndex) => {
        let transaction = new MoveSong_Transaction(store, startIndex, endIndex);
        tps.addTransaction(transaction);
    }

    store.addEditSongTransaction = () => {
        let oldSong = store.currentList.songs[store.markedIndex];
        let newTitle = document.getElementById("edit-song-title").value;
        let newArtist = document.getElementById("edit-song-artist").value;
        let newYoutubeId = document.getElementById("edit-song-youTubeId").value;
        let newSong = {
            title: newTitle,
            artist: newArtist,
            youTubeId: newYoutubeId
        }
        let transaction = new EditSong_Transaction(store, store.markedIndex, oldSong, newSong);
        tps.addTransaction(transaction);
    }
    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}