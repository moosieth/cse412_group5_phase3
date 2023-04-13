import React, { useState, useEffect } from "react";
import axios from "axios";
import "./content.css"

export default function Content() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/recentphotos")
      .then(response => {
        setPhotos(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <section>
      <form>
        <br />
        <label htmlFor="message">Recent Posts!</label>
        <ul>
          {photos.map(photo => (
            <li key={photo[0]}>
              <p>Image:</p>
              <img src={photo[3]} alt="Recent post" />
              <p>Caption: {photo[2]}</p>
              {console.log(photo[3])}
            </li>
          ))}
        </ul>
        <br />
        <button type="submit">Share</button>
      </form>
    </section>
  );
}
