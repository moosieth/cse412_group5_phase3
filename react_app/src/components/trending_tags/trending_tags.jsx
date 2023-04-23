import React, { useState, useEffect } from "react";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import "./trending_tags.css";

export default function TrendTags(props) {
  const [tags, setTags] = useState([]);


  useEffect(() => {
    const fetchTags = async () => {
        const userID = getCookie("userID");
        console.log("Cookie is " + userID);
        if (userID) {
          try {
            const response = await axios.get("http://127.0.0.1:5000/trendingtags");
            setTags(response.data);
            console.log(response.data);
          } catch (error) {
            console.log(error);
          }
        }
    };
    fetchTags();
  }, []);


  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  };

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

  return (
    <section className={`trending-tags-box ${props.className}`}>
      <div>
        <div className="post_container">
            <ListItemText
                sx={{ my: 0 }}
                primary="Popular Tags"
                primaryTypographyProps={{
                  fontSize: 17,
                  fontWeight: 'medium',
                  letterSpacing: 0,
                  paddingLeft: 1
                }}
            />
            {tags.map((tag) => (
                <List sx={{ width: "100%", maxWidth: 270, height: 54 , bgcolor: "background.paper" }} key={tag[0]} onClick={() => {
                    props.setSelectedTag(tag[0]);
                    props.setShowTagPage(true);
                }}>
                    <ListItem alignItems="flex-start" sx={{ py: 0.1 }}>
                    <ListItemText
                        primary={`${tag[0]}`}
                        primaryTypographyProps={{
                            fontSize: 13
                        }}
                    />
                    <h3>{tag[1]}</h3>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </List>
            ))}
        </div>
        <br />
      </div>
    </section>
  );
}
