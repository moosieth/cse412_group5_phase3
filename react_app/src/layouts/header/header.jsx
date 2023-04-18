import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import axios from "axios";
import logo from "../../data/logo.png";
import house from "../../data/house.png";
import heart from "../../data/heart.png";
import person from "../../data/person.png";
import plus from "../../data/plus.png";
import Avatar from "@mui/material/Avatar";
import "./header.css";
import CreatePost from "../../components/create_post/create_post";

export default function Header() {
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("Search");
  const handleAddPhoto = () => {
    setShowCreate(true);
  };
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
        console.log('Performing search for:', searchQuery);
        event.preventDefault();
        axios
      .get('http://127.0.0.1:5000/photobytag', { params: { name: searchQuery } })
      .then((response) => {
          console.log(response);
      
      })
    }
  };

  const toggleSearch = (event) => {
    const searchBar = document.getElementById("searchBar");
    const searchContainer = searchBar.parentElement; // Get the parent element
    searchContainer.classList.toggle("show-search");
  };  

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css"
        />
      </Helmet>
      <header>
      <img src={logo} alt="INGL logo" className="header-logo" />
      <nav>
        <div className="icons">
          <ul>
          <li>
              <div className="search_containter">
                <div className="search">
                  <input
                  id="searchBar"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search"
                  className="search_input"
                  />
                  <div 
                    className="search_button"
                    onClick={toggleSearch}
                  >
                    <i className='ri-search-2-line search_icon'></i>
                    <i className='ri-close-line search_close'></i>
                  </div>
                </div>                
              </div>
            </li>
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
              <Avatar 
                className="avatar"
                sx={{ width: 45, height: 45 }}
              >H</Avatar>
            </li>
          </ul>
        </div>
      </nav>
      {showCreate && <CreatePost setShowCreate={setShowCreate} />}
    </header>
    </>
  );
}