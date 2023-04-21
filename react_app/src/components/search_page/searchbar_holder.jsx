import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import "./search.css";
import logo from "../../data/logo.png";
import house from "../../data/house.png";
import heart from "../../data/heart.png";
import person from "../../data/person.png";
import plus from "../../data/plus.png";
import { Button } from "@mui/material";

export default function SearchBar({ searchTerm, setSearchTerm, setShowUserSearch, setShowPhotoSearch, setShowComSearch }) {

    const handleClearClick = () => {
        setSearchTerm('');
    }

    const handleUserSearchClick = () => {
        setShowUserSearch(true);
        setShowPhotoSearch(false);
        setShowComSearch(false);
    }
    const handlePhotoSearchClick = () => {
        console.log(searchTerm);
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
                            <div className="search show-search">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    className="search_input"
                                />
                                {searchTerm &&
                                <Button
                                    type="button"
                                    onClick={handleClearClick}
                                    className="clear-button"
                                    >
                                    <i className='ri-close-line clear-button'></i>
                                </Button>
                                }                               
                            </div>
                        </div>                        
                    </li>
                    <div>
                        <button type="button" onClick={() => handleUserSearchClick()} id="searchUserButton">Search for Users</button>
                        <button type="button" onClick={() => handlePhotoSearchClick()} id="searchPhotoButton">Search for Photos by Tags</button>
                        <button type="button" onClick={() => handleComSearchClick()} id="searchComButton">Search for Comments</button>
                    </div>
                </form>
            </div>
        </>

    );
};