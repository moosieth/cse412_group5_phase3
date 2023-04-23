import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import "./tag_page.css";
import house from "../../data/house.png";
import { motion, AnimatePresence } from "framer-motion";

export default function TagPage(props) {
    return (
        <div>
            <span>This will be a page with a bunch of photos for the given tag {props.selectedTag}</span>
            <img src={house} onClick={() => {
                props.setShowTagPage(false);
                props.setSelectedTag("")
            }} className="close_button"></img>
        </div>
    )
}