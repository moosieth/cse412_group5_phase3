import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import logo from "../../data/logo.png";
import house from "../../data/house.png";
import heart from "../../data/heart.png";
import person from "../../data/person.png";
import plus from "../../data/plus.png";
import Avatar from "@mui/material/Avatar";
import search from "../../data/search.png";
import "./header.css";


export default function Header({ setShowCreatePost, setShowCreateAlbum, setShowUserPage, handleShowContent, setFriendID }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const navigate = useNavigate();

  const handleAddPhoto = () => {
    setShowCreate(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreatePost = () => {
    setShowDropdown(false);
    setShowCreatePost(true);
  };

  const handleCreateAlbum = () => {
    setShowDropdown(false);
    setShowCreateAlbum(true);
  };

  const handleAvatarClick = () => {
    setShowUserPage((prevState) => !prevState);
    setShowUserProfile((prevState) => !prevState);
    setFriendID(getCookie("userID"));
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
    navigate("/search");
  };

  const handleYouMayLike = (event) => {
    navigate("/youmaylike");
  };

  const handleFollowList = (event) => {
    navigate("/view-followed-friends");
  };

  const handleDropdownClick = (event) => {
    setShowDropdown((prevState) => !prevState);
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
                <a href="#" onClick={handleSearch}>
                  <img src={search} alt="search" className="header-icon" />
                </a>
              </li>
              <li>
                <a href="#" onClick={handleShowContent}>
                  <img src={house} alt="house" className="header-icon" />
                </a>
              </li>
              <li>
                <a href="#" onClick={handleYouMayLike}>
                  <img src={heart} alt="heart" className="header-icon" />
                </a>
              </li>
              <li>
                <a href="#" onClick={handleFollowList}>
                  <img src={person} alt="person" className="header-icon" />
                </a>
              </li>
              <li>
                <a href="#" onClick={handleDropdownClick}>
                  <img src={plus} alt="plus" className="header-icon" />
                </a>
                <motion.div
                  className={`dropdown-menu${showDropdown ? " show" : ""}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={showDropdown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="#" onClick={handleCreatePost}>
                    Create Post
                  </a>
                  <a href="#" onClick={handleCreateAlbum}>
                    Create Album
                  </a>  
                </motion.div>
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