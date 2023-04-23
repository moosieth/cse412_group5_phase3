import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/header/header";
import Footer from "../../layouts/footer/footer";
import axios from "axios";

export default function FollowList({ userId }) {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showCreateAlbum, setShowCreateAlbum] = useState(false);
    const [showUserPage, setShowUserPage] = useState(false);
    const [friendID, setFriendID] = useState(null);
    const [numbers, setNumbers] = useState([]);

    const navigate = useNavigate();

    const handleShowContent = () => {
        navigate("/social-network-service");
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/getfollowing', {
            params: { userId: 100001 }
        })
        .then(response => {
            setNumbers(response.data);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
    }, [userId]);

    return (
        <div>
            <Header 
                setShowCreatePost={setShowCreatePost}
                setShowCreateAlbum={setShowCreateAlbum}
                setShowUserPage={setShowUserPage}
                handleShowContent={handleShowContent}
                setFriendID={setFriendID}
            />
            {numbers.map((numberArray, index) => (
                <li key={index}>{numberArray[0]}</li>
            ))}
            <Footer />
        </div>
    );
}