import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import "./tag_page.css";
import house from "../../data/house.png";
import { motion, AnimatePresence } from "framer-motion";
import PhotoSearch from "../search_page/photo_search";

export default function TagPage(props) {
    return (
        <div>
            <img src={house} onClick={() => {
                props.setShowTagPage(false);
                props.setSelectedTag("")
            }} className="close_button"></img>
            <PhotoSearch searchTerm={props.selectedTag} setShowUserPage={props.setShowUserPage} setFriendID={props.setFriendID} />
        </div>
    )
}