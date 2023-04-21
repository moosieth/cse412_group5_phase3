import React, { useState, useEffect } from "react";
import UserProfile from "../user_profile/user_profile";
import UserType from "../user_type/user_type";
import UserPosts from "../user_posts/user_posts";

export default function UserPage({ friendID }) {
    const [selectedAction, setSelectedAction] = useState(1);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [albumDeleted, setAlbumDeleted] = useState(false);

    const onItemClicked = (selectedAction) => {
        setSelectedAction(selectedAction);
    };
    const onAlbumSelected = (albumId) => {
        setSelectedAlbum(albumId);
    };

    const handleAlbumDeleted = (newSelectedAlbum) => {
      setSelectedAlbum(newSelectedAlbum);
      setAlbumDeleted(true);
    };

    const resetAlbumDeleted = () => {
      setAlbumDeleted(false);
    };

    return (
        <div className="profile">
          <div>
            <UserProfile friendID={friendID} />
          </div>
          <div>
            <UserType friendID={friendID} onItemClicked={onItemClicked} onAlbumSelected={onAlbumSelected} onAlbumDeleted={handleAlbumDeleted} />
          </div>
          <div>
            <UserPosts friendID={friendID} customStyle={{ paddingTop: 0 }} selectedAlbum={selectedAlbum} albumDeleted={albumDeleted} resetAlbumDeleted={resetAlbumDeleted} />
          </div>
        </div>
      );
}