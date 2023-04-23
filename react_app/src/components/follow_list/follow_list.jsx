import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/header/header";
import Footer from "../../layouts/footer/footer";
import axios from "axios";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";

export default function FollowList() {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showCreateAlbum, setShowCreateAlbum] = useState(false);
    const [showUserPage, setShowUserPage] = useState(false);
    const [friendID, setFriendID] = useState(null);
    const [numbers, setNumbers] = useState([]);
    const [userData, setUserData] = useState([]);
    const navigate = useNavigate();

    const handleShowContent = () => {
        navigate("/social-network-service");
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    };

    const userID = getCookie("userID");

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/getfollowing', {
            params: { userId: userID }
        })
        .then(response => {
            setNumbers(response.data);
        })
        .catch(error => {
            alert("You do not follow anyone");
        });
    }, [userID]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/userbyid', { params: { userID: 100010 } })
    })

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

    function stringAvatar(name) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
      }

    return (
        <div>
            <Header 
                setShowCreatePost={setShowCreatePost}
                setShowCreateAlbum={setShowCreateAlbum}
                setShowUserPage={setShowUserPage}
                handleShowContent={handleShowContent}
                setFriendID={setFriendID}
            />
            <div>
                <div className="post_container">
                    <ListItemText
                        sx={{ my: 0 }}
                        primary="Following"
                        primaryTypographyProps={{
                            fontSize: 17,
                            fontWeight: 'medium',
                            letterSpacing: 0,
                            paddingLeft: 1
                        }}
                    />
                    {numbers.map((user) => (
                        <List sx={{ width: "100%", maxWidth: 270, height: 54, bgcolor: "background.paper" }} key={user[0]}>
                            <ListItem alignItems="flex-start" sx={{ py: 0.1 }}>
                                <ListItemAvatar>
                                    <Avatar {...stringAvatar(`${user[0]} ${user[1]}`)} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${user[0]} ${user[1]}`}
                                    primaryTypographyProps={{
                                    fontSize: 13
                                    }}
                                />
                                <h3>{user[3]}</h3>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </List>
                    ))}
                </div>
                <br />
            </div>
            <Footer />
        </div>
    );
}