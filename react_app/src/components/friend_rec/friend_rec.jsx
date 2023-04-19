import React, { useState, useEffect } from "react";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import "./friend_rec.css";

export default function friend_rec(props) {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
        const userID = getCookie("userID");
        console.log("Cookie is " + userID);
        if (userID) {
          try {
            const response = await axios.get("http://127.0.0.1:5000/friendrec", {
              params: { userID: userID },
            });
    
            setUsers(response.data);
            console.log(response.data);
          } catch (error) {
            console.log(error);
          }
        }
    };
    fetchUsers();
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

function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <section className={`friend_rec-box ${props.className}`}>
      <div>
        <div className="post_container">
            <ListItemText
                sx={{ my: 0 }}
                primary="Friend Reccomendations"
                primaryTypographyProps={{
                  fontSize: 17,
                  fontWeight: 'medium',
                  letterSpacing: 0,
                  paddingLeft: 1
                }}
            />
            {users.map((user) => (
                <List sx={{ width: "100%", maxWidth: 270, height: 54 , bgcolor: "background.paper" }} key={user[0]}>
                    <ListItem alignItems="flex-start" sx={{ py: 0.1 }}>
                    <ListItemAvatar>
                        <Avatar {...stringAvatar(`${user[1]} ${user[2]}`)} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${user[1]} ${user[2]}`}
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
    </section>
  );
}
