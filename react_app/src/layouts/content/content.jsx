import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import "./content.css";
import xmark from "../../data/xmark.png";
import { motion, AnimatePresence } from "framer-motion";

export default function Content() {
  const [photos, setPhotos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

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
    fetchPhotos();
  }, []);

  return (
    <section className="box">
      <div>
        <div className="post_container">
          {photos.map((photo) => (
            <motion.div
              className="post"
              key={photo[0]}
              layoutId={photo[0]}
              onClick={() => setSelectedId(photo[0])}
            >
              <div className="post_header">
                <Avatar className="post_avatar">H</Avatar>
                <h3>username</h3>
              </div>
              <img
                className="post_image"
                src={decodeURIComponent(photo[3]).replace("https://storage.googleapis.com/group5-inql.appspot.com/", "")}
                alt="Recent post"
              />
              <h4 className="post_text">
                <strong className="user_name">username</strong>{" "}
                <span className="caption_text">{photo[2]}</span>
              </h4>
              {console.log(decodeURIComponent(photo[3]))}
            </motion.div>
          ))}
        </div>
        <br />
      </div>

      <AnimatePresence>
      {selectedId && (
        <>
          <motion.div
            className="blurred_background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          ></motion.div>
          <motion.div
            className="enlarged_post"
            layoutId={selectedId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {photos
              .filter((photo) => photo[0] === selectedId)
              .map((photo) => (
                <div key={photo[0]} className="enlarged_post_content">
                  <div className="post_header">
                    <Avatar className="post_avatar">H</Avatar>
                    <h3>username</h3>
                  </div>
                  <img
                    className="post_image"
                    src={decodeURIComponent(photo[3]).replace("https://storage.googleapis.com/group5-inql.appspot.com/", "")}
                    alt="Recent post"
                  />
                  <h4 className="post_text">
                    <strong className="user_name">username</strong> <span className="caption_text">{photo[2]}</span>
                  </h4>
                </div>
              ))}
            <motion.img
              src={xmark}
              alt="Close"
              className="close_button"
              onClick={() => setSelectedId(null)}
            />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
