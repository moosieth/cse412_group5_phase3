import React, { useState } from "react";
import "./create_post.css";
import axios from "axios";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import photo from "../../data/photo.png";
import xmark from "../../data/xmark.png";

export default function CreatePost(props) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [album, setAlbum] = useState("");
  const [fileSelected, setFileSelected] = useState(false);

  const handleClose = () => {
    props.setShowCreate(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
    setFileSelected(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFileSelected(true);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleAlbumChange = (event) => {
    setAlbum(event.target.value);
  };

  const uploadImageAndGetUrl = async (file) => {
    const storageRef = ref(storage, `upload_images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
  
    try {
      const firebaseStorageUrl = await uploadImageAndGetUrl(file);
      console.log("Firebase Storage URL:", firebaseStorageUrl);
  
      axios.post("http://127.0.0.1:5000/add", JSON.stringify({
        target: "photo",
        albumID: album,
        caption: caption,
        data: firebaseStorageUrl,
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log(response.data);
        alert("Post created successfully!");
      })
      .catch((error) => {
        console.log('Error:', error.response.data);
        alert("Failed to create post. Please try again later.");
      });
  
    } catch (error) {
      console.error(error.response.data);
      alert("Failed to create post. Please try again later.");
    }
    setFile(null);
    setCaption("");
    setAlbum("");
    setFileSelected(false);
  };   
  

  return (
    <div className="create-post-overlay">
      <img src={xmark} alt="Close" className="create-post-close" onClick={handleClose} />
      <div className="create-post-backdrop"></div>
      <div className="create-post">
        <div className="create-post_title">Create New Post</div>
        <form onSubmit={handleSubmit} onDrop={handleDrop}>
          {!fileSelected ? (
            <>
              <div className="dropzone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <p>Drag and drop a photo here, or click to select a file!</p>
                <img
                  src={photo}
                  alt="Select Photo"
                  className="select_photo"
                ></img>
              </div>
            </>
          ) : (
            <div>
              <img src={URL.createObjectURL(file)} alt="preview" className="preview"/>
              <div className="post-details">
                <label htmlFor="caption">Caption:</label>
                <input
                  type="text"
                  id="caption"
                  value={caption}
                  onChange={handleCaptionChange}
                />
                <label htmlFor="album">Album:</label>
                <select id="album" value={album} onChange={handleAlbumChange}>
                  <option value="">Select Album</option>
                  <option value={200000}>Album 1</option>
                  <option value={200001}>Album 2</option>
                  <option value={200002}>Album 3</option>
                </select>
              </div>
              <div className="buttons">
                <button type="submit">Post</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}