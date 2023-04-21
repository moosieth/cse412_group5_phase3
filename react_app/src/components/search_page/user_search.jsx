import React, { useState, useEffect } from "react";
import axios from "axios";
import "./search.css";
import Avatar from "@mui/material/Avatar";
import xmark from "../../data/xmark.png";
import { motion, AnimatePresence } from "framer-motion";
export default function UserSearch(props) {
    const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [scrollbarVisible, setScrollbarVisible] = useState(false);

    const fetchUsers = async () => {
        const splitTerm = props.searchTerm.split(" ");
        console.log(splitTerm[0]);
        console.log(splitTerm[1]);
        const response = await axios.get("http://127.0.0.1:5000/searchuser", { params: { fName: splitTerm[0], lName: splitTerm[1] } });
        // wait to fetch the email of each user
        const usersWithUserEmails = await Promise.all(
            response.data.map(async (user) => {
                const userResponse = await axios.get("http://127.0.0.1:5000/userbyid", {
                    params: { userID: user[0] },
                });
                console.log(user);
                const userEmail = userResponse.data[0][6];
                // return a new object with the email
                return { ...user, userEmail };
            })
        );
        setUsers(usersWithUserEmails);
    };
    const handleScroll = () => {
        setScrollbarVisible(true);
        clearTimeout(window.scrollTimer);
        window.scrollTimer = setTimeout(() => {
            setScrollbarVisible(false);
        }, 500);
    };

    useEffect(() => {
        fetchUsers();
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
    return (
        <div className="everything_wrapper">
            <section className="box">
                <div className="content_wrapper" >
                    <div className={`post_container ${scrollbarVisible ? "show-scrollbar" : "hide-scrollbar"}`}
                        onScroll={handleScroll}>
                        {users.map((user) => (
                            <motion.div
                                className="post"
                                key={user[0]}
                                layoutId={user[0]}
                                onClick={() => setSelectedId(user[0])}
                            >
                                <div className="post_header">
                                    <Avatar
                                        className="post_avatar"
                                        {...stringAvatar(user.userEmail)}
                                        onClick={() => {
                                            props.setFriendID(user[0]);
                                            props.setShowUserPage(true);
                                        }}
                                    />
                                    <h4>{user.userEmail}</h4>
                                </div>
                                <h4 className="post_text">
                                    <strong className="user_name">{user.userEmail}</strong>{" "}
                                    <span className="caption_text">{user[1]} {user[2]}</span>
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
                                {users
                                    .filter((user) => user[0] === selectedId)
                                    .map((user) => (
                                        <div key={user[0]} className="enlarged_post_content">
                                            <div className="post_header">
                                                <Avatar className="post_avatar" {...stringAvatar(user.userEmail)} />
                                                <h5 className="user_email">{user.userEmail}</h5>
                                            </div>
                                            <h4 className="post_text">
                                                <strong className="user_name">{user.userEmail}</strong> <span className="caption_text">{user[1]} {user[2]}</span>
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