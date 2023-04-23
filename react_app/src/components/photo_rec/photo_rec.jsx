import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import "./photo_rec.css";
import xmark from "../../data/xmark.png";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoRecs(props) {
    const [photos, setPhotos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [scrollbarVisible, setScrollbarVisible] = useState(false);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    };

    // Trying to fetch the user if from the photo
    // and then retrieve the email by calling axios again
    const fetchPhotos = async () => {
        try {
            const userID = getCookie("userID");
            const response = await axios.get("http://127.0.0.1:5000/photorec", { params: { userID: userID } });
            // wait to fetch the email of each photos
            const photosWithUserEmails = await Promise.all(
                response.data.map(async (photo) => {
                    const userResponse = await axios.get("http://127.0.0.1:5000/userbyid", {
                        params: { userID: photo[4] },
                    });

                    console.log(photo);
                    const userEmail = userResponse.data[0][6];
                    // return a new object with the email
                    return { ...photo, userEmail };
                })
            );
            setPhotos(photosWithUserEmails);
        } catch (error) {
            console.log(error);
        }
    };
    const handleScroll = () => {
        setScrollbarVisible(true);
        clearTimeout(window.scrollTimer);
        window.scrollTimer = setTimeout(() => {
            setScrollbarVisible(false);
        }, 500);
    };

    useEffect(() => {
        fetchPhotos();
    }, []);


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

    if (photos.length === 0) {
        return (
            <div className="everything_wrapper">
                <section className="box">
                    <div className="content_wrapper">
                        <div className={`post_container ${scrollbarVisible ? "show-scrollbar" : "hide-scrollbar"}`}
                            onScroll={handleScroll}>
                                <h4>Something went wrong. Please try again later...</h4>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
    else {
        return (
            <div className="everything_wrapper">
                <section className="box">
                    <div className="content_wrapper" >
                        <div className={`post_container ${scrollbarVisible ? "show-scrollbar" : "hide-scrollbar"}`}
                            onScroll={handleScroll}>
                            {photos.map((photo) => (
                                <motion.div
                                    className="post"
                                    key={photo[0]}
                                    layoutId={photo[0]}
                                    onClick={() => setSelectedId(photo[0])}
                                >
                                    <div className="post_header">
                                        <Avatar
                                            className="post_avatar"
                                            {...stringAvatar(photo.userEmail)}
                                            onClick={() => {
                                                props.setFriendID(photo[4]);
                                                props.setShowUserPage(true);
                                            }}
                                        />
                                        <h4>{photo.userEmail}</h4>
                                    </div>
                                    <img
                                        className="post_image"
                                        src={photo[3]}
                                        alt="Recent post"
                                    />
                                    <h4 className="post_text">
                                        <strong className="user_name">{photo.userEmail}</strong>{" "}
                                        <span className="caption_text">{photo[2]}</span>
                                    </h4>
                                </motion.div>
                            ))}
                        </div>
                        <br />
                    </div>


                    <AnimatePresence>
                        {selectedId && (
                            <>
                                <motion.div
                                    className="blurred_background"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedId(null)}
                                ></motion.div>
                                <motion.div
                                    className="enlarged_post"
                                    layoutId={selectedId}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    {photos
                                        .filter((photo) => photo[0] === selectedId)
                                        .map((photo) => (
                                            <div key={photo[0]} className="enlarged_post_content">
                                                <div className="post_header">
                                                    <Avatar className="post_avatar" {...stringAvatar(photo.userEmail)} />
                                                    <h5 className="user_email">{photo.userEmail}</h5>
                                                </div>
                                                <img
                                                    className="post_image"
                                                    src={photo[3]}
                                                    alt="Recent post"
                                                />
                                                <h4 className="post_text">
                                                    <strong className="user_name">{photo.userEmail}</strong> <span className="caption_text">{photo[2]}</span>
                                                </h4>
                                            </div>
                                        ))}
                                    <motion.img
                                        src={xmark}
                                        alt="Close"
                                        className="close_button"
                                        onClick={() => setSelectedId(null)}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </section>
            </div>
        );
    }
}