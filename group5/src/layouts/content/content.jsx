import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import "./content.css";

export default function Content() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/recentphotos")
      .then((response) => {
        setPhotos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className="box">
      <div>
        <label htmlFor="message">Recent Posts!</label>
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
              src={decodeURIComponent(photo[3]).replace("https://storage.googleapis.com/inql-group5.appspot.com/", "")} 
              alt="Recent post" 
            />
            {/* Post caption + user name */}
            <h4 className="post_text">
              <strong>username</strong> {photo[2]}
            </h4>
            {console.log(decodeURIComponent(photo[3]))}
          </div>
        ))}
        <br />
      </div>
    </section>
  );
}
