import React, { useState } from "react";
import "./create_album.css";
import axios from "axios";
import xmark from "../../data/xmark.png";

export default function CreateAlbum(props) {
    const [albumName, setAlbumName] = useState("");

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          return parts.pop().split(";").shift();
        }
    };

    const userID = getCookie("userID");

    const handleAlbumChange = (event) => {
        setAlbumName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Add this line to prevent the default form submission behavior
        axios.post("http://127.0.0.1:5000/add", JSON.stringify({
            target: "album",
            userID: userID,
            name: albumName,
            dateCreated: "2023-04-07 00:00:00"
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            alert("Album created successfully!");
        })
        .catch((error) => {
            console.log('Error', error.response.data);
            alert("Failed to create album. Please try again later.");
        });
    };

    const handleClose = () => {
        // Add the functionality to close the album creation form
        props.setShowCreateAlbum(false);
    };

    return (
        <div className="create-album-overlay">
            <img src={xmark} alt="Close" className="create-album-close" onClick={handleClose} />
            <div className="create-album-backdrop"></div>
            <div className="create-album">
                <div className="create-album_title">Create New Album</div>
                <form onSubmit={handleSubmit}>
                    <div className="album-details">
                        <label htmlFor="album">Album Name:</label>
                        <input 
                            type="text"
                            id="albumName"
                            value={albumName}
                            onChange={handleAlbumChange}
                        />
                        <div className="buttons">
                            <button type="submit">Create Album</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
