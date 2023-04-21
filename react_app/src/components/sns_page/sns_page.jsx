import React, { useState } from "react";
import "./sns.css";
import Header from "../../layouts/header/header";
import Content from "../../layouts/content/content";
import Footer from "../../layouts/footer/footer";
import CreatePost from "../create_post/create_post";
import CreateAlbum from "../create_album/create_album";
import UserPage from "../../layouts/user_page/user_page";

export default function SNS() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [showUserPage, setShowUserPage] = useState(false);
  const [friendID, setFriendID] = useState(null);
  const [albumDeleted, setAlbumDeleted] = useState(false);

  const handleShowContent = () => {
    setShowUserPage(false);
  };

  const handleAlbumDeletion = (deleted) => {
    setAlbumDeleted(deleted);
  };

  return (
    <div>
      <Header 
        setShowCreatePost={setShowCreatePost} 
        setShowCreateAlbum={setShowCreateAlbum}
        setShowUserPage={setShowUserPage} 
        handleShowContent={handleShowContent}
        setFriendID={setFriendID}
      />
      {showUserPage ? <UserPage
                        friendID={friendID}
                        onAlbumDeleted={handleAlbumDeletion}
                        albumDeleted={albumDeleted}
                      /> 
                      : <Content setFriendID={setFriendID} setShowUserPage={setShowUserPage} />}
      <Footer />
      {showCreateAlbum && <CreateAlbum setShowCreateAlbum={setShowCreateAlbum} />}
      {showCreatePost && <CreatePost setShowCreatePost={setShowCreatePost} />}
    </div>
  );
}
