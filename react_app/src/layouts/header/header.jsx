import React, { useState, useEffect } from "react";
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

export default function Header({ setShowCreate, setShowUserPage, handleShowContent }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const handleAddPhoto = () => {
    setShowCreate(true);
  };
  const handleAvatarClick = () => {
    setShowUserPage((prevState) => !prevState);
  };

  // useEffect hook to make a request with user ID using cookie
  useEffect(() => {
    const fetchUserEmail = async () => {
      const userID = getCookie("userID");
      console.log("Cookie is " + userID);
      if (userID) {
        try {
          const response = await axios.get("http://127.0.0.1:5000/userbyid", {
            params: { userID: userID },
          });
  
          setUserEmail(response.data[0][6]);
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    fetchUserEmail();
  }, []);

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

  // Functions for creating an avatar
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  // This will get the first letter of email and the domain as the initial
  function stringAvatar(email) {
    const [name, domain] = email.split('@');
    return {
      sx: {
        bgcolor: stringToColor(email),
      },
      children: `${name[0]}${domain[0]}`,
    };
  }

  const toggleSearch = (event) => {
    const searchBar = document.getElementById("searchBar");
    const searchContainer = searchBar.parentElement; // Get the parent element
    searchContainer.classList.toggle("show-search");
  };  

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  };

  return (
    <>
      {/*To apply the stylesheet*/}
      {/* https://www.youtube.com/watch?v=TFXfpSjgI8Y */}
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
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearch}
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
              <a href="#" onClick={handleShowContent}>
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
              {userEmail && (
                <Avatar
                  className="avatar"
                  sx={{ width: 45, height: 45 }}
                  {...stringAvatar(userEmail)}
                  onClick={handleAvatarClick}
                />
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
    </>
  );
}