import React, { useState, useEffect } from "react";
import "./create_post.css";
import axios from "axios";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import photo from "../../data/photo.png";
import xmark from "../../data/xmark.png";
import "react-image-crop/dist/ReactCrop.css";

export default function CreatePost(props) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [albums, setAlbums] = useState([]);
  const [albumChosen, setAlbumChosen] = useState("");
  const [curTag, setCurTag] = useState("");
  const [tags, setTags] = useState([]);
  const [pID, setPID] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  };

  const handleClose = () => {
    props.setShowCreatePost(false);
  };

  const handleSpace = (e) => {
    if (e.keyCode === 32) {
      setTags(oldTags => [...oldTags, curTag]);
      console.log(tags);
      setCurTag("");
    }
  }

  const fetchAlbums = async () => {
    const userID = getCookie("userID");

    axios.get("http://127.0.0.1:5000/searchalbum", {
      params: { userID: userID, name: "" }
    }).then((response) => {
      setAlbums(response.data);
    })
  };

  const handleTagChange = (event) => {
    setCurTag(event.target.value);
  };

  const handleAlbumChange = (event) => {
    setAlbumChosen(event.target.value);
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

  const uploadImageAndGetUrl = async (file) => {
    const storageRef = ref(storage, `upload_images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleSubmit = async (event) => {
    const userID = getCookie("userID");

    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    try {
      const firebaseStorageUrl = await uploadImageAndGetUrl(file);
      console.log("Firebase Storage URL:", firebaseStorageUrl);

      await axios.post("http://127.0.0.1:5000/add", JSON.stringify({
        target: "photo",
        albumID: albumChosen,
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

    await sleep(3000);

    const pidRES = await axios.get("http://127.0.0.1:5000/justposted", {
      params: { userID: userID }
    });

    console.log(pidRES.data);

    tags.map((tag) => {
      console.log(pID);
      axios.post("http://127.0.0.1:5000/add", JSON.stringify({
        target: "tag",
        name: tag,
        photoID: pidRES.data[0][0]
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          console.log(response);
          alert("Post tagged successfully!");
        })
        .catch((error) => {
          /*console.log('Error:', error.response.data);*/
          alert("Failed to add tags to post. Please try again later.");
        });
    })

    setFile(null);
    setCaption("");
    setAlbumChosen("");
    setTags([]);
    setFileSelected(false);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);


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
              <img src={URL.createObjectURL(file)} alt="preview" className="preview" />
              <div className="post-details">
                <label htmlFor="caption">Caption:</label>
                <input
                  type="text"
                  id="caption"
                  value={caption}
                  onChange={handleCaptionChange}
                />
                <label htmlFor="album">Album:</label>
                <select id="album" value={albumChosen} onChange={handleAlbumChange}>
                  <option value="">Select Album</option>
                  {albums.map(album => (
                    <option value={album[0]}>
                      {album[1]}
                    </option>
                  ))}
                </select>
                <label htmlFor="tags">Tags:</label>
                <input
                  type="text"
                  id="tag"
                  value={curTag}
                  onChange={handleTagChange}
                  onKeyDown={handleSpace}
                />
              </div>
              <div className="buttons">
                <button type="submit">Post</button>
                <button onClick={handleClose}>Cancel</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
