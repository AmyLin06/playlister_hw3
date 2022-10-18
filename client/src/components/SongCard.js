import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleRemoveSong(event) {
        store.markSong(index);
        store.showModal("remove-song-modal");
    }

    function handleEditSong(event) {
        store.markSong(index);
        store.showModal("edit-song-modal");
    
        document.getElementById("edit-song-title").value = song.title;
        document.getElementById("edit-song-artist").value = song.artist;
        document.getElementById("edit-song-youTubeId").value = song.youTubeId;
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
    }

    function handleDragLeave(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));

        // store.moveSong(sourceIndex, targetIndex);
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleEditSong}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >   
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}
                target="_blank">
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemoveSong}
            />
        </div>
    );
}

export default SongCard;