import React, { useState, useEffect } from "react";
import UserProfile from "../user_profile/user_profile";
import UserType from "../user_type/user_type";
import UserPosts from "../user_posts/user_posts"
import axios from "axios";

export default function UserPage({ friendID }) {
    const [selectedAction, setSelectedAction] = useState(1);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const onItemClicked = (selectedAction) => {
        setSelectedAction(selectedAction);
    };
    const onAlbumSelected = (albumId) => {
        setSelectedAlbum(albumId);
    };

    return (
        <div className="profile">
          <div>
            <UserProfile friendID={friendID} />
          </div>
          <div>
            <UserType friendID={friendID} onItemClicked={onItemClicked} onAlbumSelected={onAlbumSelected} />
          </div>
          <div>
            <UserPosts friendID={friendID} customStyle={{ paddingTop: 0 }} selectedAlbum={selectedAlbum} />
          </div>
        </div>
      );
}