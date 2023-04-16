import React, { useState } from "react";
import axios from "axios";
import logo from "../../data/logo.png";
import house from "../../data/house.png";
import heart from "../../data/heart.png";
import person from "../../data/person.png";
import plus from "../../data/plus.png";
import Avatar from "@material-ui/core/Avatar";
import "./header.css";
import CreatePost from "../../components/create_post/create_post";

export default function Header() {
  const [showCreate, setShowCreate] = useState(false);

  const handleAddPhoto = () => {
    setShowCreate(true);
  };

  return (
    <header>
      <img src={logo} alt="INGL logo" className="header-logo" />
      <nav>
        <div className="icons">
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
            <li>
              <Avatar className="avatar">H</Avatar>
            </li>
          </ul>
        </div>
      </nav>
      {showCreate && <CreatePost setShowCreate={setShowCreate} />}
    </header>
  );
}