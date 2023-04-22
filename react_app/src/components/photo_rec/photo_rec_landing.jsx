import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/header/header";
import PhotoRecs from "./photo_rec";
import Footer from "../../layouts/footer/footer";
import UserPage from "../../layouts/user_page/user_page";

export default function PhotoRecLanding() {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showCreateAlbum, setShowCreateAlbum] = useState(false);
    const [showUserPage, setShowUserPage] = useState(false);
    const [friendID, setFriendID] = useState(null);
    const [albumDeleted, setAlbumDeleted] = useState(false);

    const navigate = useNavigate();

    const handleShowContent = () => {
        navigate("/social-network-service");
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
                : <PhotoRecs setFriendID={setFriendID} setShowUserPage={setShowUserPage} />}
            <Footer />
        </div>
    );
}