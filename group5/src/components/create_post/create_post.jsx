import React, { useState } from "react";
import "./create_post.css";
import axios from "axios";
import photo from "../../data/photo.png"

export default function CreatePost(props) {
  const [file, setFile] = useState(null);

  const handleClose = () => {
    props.setShowCreate(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    try {
      const data = new FormData();
      data.append("target", "photo");
      data.append("albumID", 200054);
      data.append("caption", "A caption that got inserted with /add");
      data.append("data", file);

      const response = await axios.post(
        "http://127.0.0.1:5000/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-post-overlay">
      <div className="create-post-backdrop"></div>
      <div className="create-post">
        <div className="create-post_title">Create New Post</div>
        <form onSubmit={handleSubmit} onDrop={handleDrop}>
          <div className="dropzone">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
            {file ? (
              <img src={URL.createObjectURL(file)} alt="preview" />
            ) : (
              <>
                <p>Drag and drop a photo here, or click to select a file!</p>
                <img src={photo} alt="Select Photo" className="select_photo"></img>
              </>
            )}
          </div>
          <button type="submit">Upload</button>
          <button onClick={handleClose}>Close</button>
        </form>
      </div>
    </div>
  );
}
