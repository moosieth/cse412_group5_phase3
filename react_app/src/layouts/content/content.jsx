import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import "./content.css";

export default function Content() {
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = () => {
    axios
      .get("http://127.0.0.1:5000/recentphotos")
      .then((response) => {
        setPhotos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPhotos(); // Fetch photos when the component mounts
  }, []);

  return (
    <section className="box">
      <div>
        <div className="post_container">
          {photos.map((photo) => (
            <div className="post" key={photo[0]}>
              <div className="post_header">
                {/* Trying to use Avatar */}
                <Avatar className="post_avatar">H</Avatar>
                <h3>username</h3>
              </div>
              {/* Post image */}
              <img
                className="post_image"
                src={decodeURIComponent(photo[3]).replace("https://storage.googleapis.com/group5-inql.appspot.com/", "")}
                alt="Recent post"
              />
              {/* Post caption + user name */}
              <h4 className="post_text">
                <strong className="user_name">username</strong> <span className="caption_text">{photo[2]}</span>
              </h4>
              {console.log(decodeURIComponent(photo[3]))}
            </div>
          ))}
        </div>
        <br />
      </div>
    </section>
  );
}
