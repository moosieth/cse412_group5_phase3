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
        // wait to fetch the email of each photos
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
        <span> This will be a query run on users</span>
    );
}