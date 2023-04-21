import React, { useState } from "react";
import "./search.css";
import Header from "../../layouts/header/header";
import Footer from "../../layouts/footer/footer";
import CreatePost from "../create_post/create_post";
import SearchBar from "./searchbar_holder";
import PhotoSearch from "./photo_search";
import UserSearch from "./user_search";
import ComSearch from "./com_search";
import UserPage from "../../layouts/user_page/user_page";
import { useNavigate } from "react-router-dom";

export default function SearchResults(props) {
  const results = props.results;
  const [searchType, setSearchType] = useState("title"); // Default search type is "title"
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showPhotoSearch, setShowPhotoSearch] = useState(false);
  const [showComSearch, setShowComSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showUserPage, setShowUserPage] = useState(false);
  const [friendID, setFriendID] = useState(null);

  const navigate = useNavigate();

  const handleShowContent = () => {
    navigate("/social-network-service");
  }

  return (
    <div>
      <Header
        setShowCreate={setShowCreate}
        setShowUserPage={setShowUserPage}
        handleShowContent={handleShowContent}
        setFriendID={setFriendID}
      />
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowUserSearch={setShowUserSearch}
        setShowPhotoSearch={setShowPhotoSearch}
        setShowComSearch={setShowComSearch}
      />
      {showUserPage ? <UserPage friendID={friendID} /> :
        showPhotoSearch ? <PhotoSearch searchTerm={searchTerm} setShowUserPage={setShowUserPage} setFriendID={setFriendID} /> :
          showUserSearch ? <UserSearch searchTerm={searchTerm} setShowUserPage={setShowUserPage} setFriendID={setFriendID} /> :
            showComSearch ? <ComSearch searchTerm={searchTerm} setShowUserPage={setShowUserPage} setFriendID={setFriendID} /> :
              <div></div>
      }
      <Footer />
    </div>
  );
}
