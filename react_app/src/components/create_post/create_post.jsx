import React, { useState } from "react";
import "./create_post.css";
import axios from "axios";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import photo from "../../data/photo.png";
import xmark from "../../data/xmark.png";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function CreatePost(props) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [album, setAlbum] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [crop, setCrop] = useState({ aspect: 1, unit: "%" });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [imageRef, setImageRef] = useState(null);

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

  // For croping images

  const handleImageLoaded = (image) => {
    setImageRef(image);
  };

  const handleCropComplete = async (crop, percentCrop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageBlob = await getCroppedImage(
        imageRef,
        crop,
        "newFile.jpeg"
      );
      setCroppedImageUrl(URL.createObjectURL(croppedImageBlob));
    }
  };

  const getCroppedImage = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const uploadImageAndGetUrl = async (file) => {
    const storageRef = ref(storage, `upload_images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !croppedImageUrl) {
      alert("Please select and crop a file to upload");
      return;
    }
  
    try {
      const firebaseStorageUrl = await uploadImageAndGetUrl(
        new File([await (await fetch(croppedImageUrl)).blob()], "cropped_image.jpeg")
      );
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
    setCroppedImageUrl(null);
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
              <ReactCrop
                src={URL.createObjectURL(file)}
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onImageLoaded={handleImageLoaded}
                onComplete={handleCropComplete}
              />
  
              {/* Preview cropped image */}
              {croppedImageUrl && (
                <img
                  src={croppedImageUrl}
                  alt="Cropped preview"
                  className="preview"
                />
              )}
  
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