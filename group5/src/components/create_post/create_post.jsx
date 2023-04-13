import React, { useState } from "react";
import "./create_post.css";
import axios from "axios";
import photo from "../../data/photo.png";

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    const data = new FormData();
    data.append("target", "photo");
    data.append("albumID", album);
    data.append("caption", caption);
    data.append("data", file);
  
    console.log("FormData contents:", data.get("albumID"), data.get("caption"), data.get("data"));
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      alert("Post created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create post. Please try again later.");
    }
    setFile(null);
    setCaption("");
    setAlbum("");
    setFileSelected(false);
  };
  

  return (
    <div className="create-post-overlay">
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
              <div className="buttons">
                <button onClick={handleClose}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <img src={URL.createObjectURL(file)} alt="preview" />
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
                <button onClick={handleClose}>Cancel</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

