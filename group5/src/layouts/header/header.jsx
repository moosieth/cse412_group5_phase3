import React from "react";
import axios from "axios";
import logo from "../../data/logo.png";
import house from "../../data/house.png";
import heart from "../../data/heart.png";
import person from "../../data/person.png";
import plus from "../../data/plus.png";
import "./header.css";

export default function Header() {
  const handleAddPhoto = () => {
    //TODO: Need to change what we are targeting to add here.
    axios
      .post("http://127.0.0.1:5000/add", {
        target: "photo",
        albumID: 200054,
        caption: "A caption that got inserted with /add",
        data: "/path/to/this/photo.jpg",
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <header>
      <img src={logo} alt="INGL logo" className="header-logo" />
      <nav>
        <ul>
          <li>
            <a href="#">
              <img src={house} alt="house" className="header-icon" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={heart} alt="heart" className="header-icon" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={person} alt="person" className="header-icon" />
            </a>
          </li>
          <li>
            <a href="#" onClick={handleAddPhoto}>
              <img src={plus} alt="plus" className="header-icon" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}