import React, { useState } from "react";
import "./search.css";
import Header from "../../layouts/header/header";
import Footer from "../../layouts/footer/footer";
import CreatePost from "../create_post/create_post";
import SearchBar from "./searchbar_holder";
import PhotoSearch from "./photo_search";

export default function SearchResults(props) {
  const results = props.results;
  const [searchType, setSearchType] = useState("title"); // Default search type is "title"
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showPhotoSearch, setShowPhotoSearch] = useState(false);
  const [showComSearch, setShowComSearch] = useState(false);
  const [showUserPage, setShowUserPage] = useState(false);
  const [friendID, setFriendID] = useState(null);


  return (
    <div>
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowUserSearch={setShowUserSearch}
        setShowPhotoSearch={setShowPhotoSearch}
        setShowComSearch={setShowComSearch}  
      />
      {showPhotoSearch && <PhotoSearch searchTerm={searchTerm} setShowUserPage={setShowUserPage} setFriendID={setFriendID} />}
      <Footer/>
    </div>
  );
}
