import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import "./search.css";
import logo from "../../data/logo.png";
import house from "../../data/house.png";
import heart from "../../data/heart.png";
import person from "../../data/person.png";
import plus from "../../data/plus.png";

export default function SearchBar({ searchTerm, setSearchTerm, setShowUserSearch, setShowPhotoSearch, setShowComSearch }) {

    const toggleSearch = (event) => {
        const searchBar = document.getElementById("searchBar");
        const searchContainer = searchBar.parentElement; // Get the parent element
        searchContainer.classList.toggle("show-search");
    };

    const handleUserSearchClick = () => {
        setShowUserSearch(true);
        setShowPhotoSearch(false);
        setShowComSearch(false);
    }
    const handlePhotoSearchClick = () => {
        setShowUserSearch(false);
        setShowPhotoSearch(true);
        setShowComSearch(false);
    }
    const handleComSearchClick = () => {
        setShowUserSearch(false);
        setShowPhotoSearch(false);
        setShowComSearch(true);
    }

    return (
        <>
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css"
                />
            </Helmet>
            <div className="form-container">
                <form>
                    <li>
                        <div className="search_containter">
                            <div className="search">
                                <input
                                    id="searchBar"
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
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
                    <div>
                        <button type="button" onClick={() => handleUserSearchClick} id="searchTitleButton">Search for Users</button>
                        <button type="button" onClick={() => handlePhotoSearchClick} id="searchAuthorButton">Search for Photos by Tags</button>
                        <button type="button" onClick={() => handleComSearchClick} id="searchAuthorButton">Search for Comments</button>
                    </div>
                </form>
            </div>
        </>

    );
};