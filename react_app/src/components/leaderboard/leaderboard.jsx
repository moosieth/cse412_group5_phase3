import React, { useState, useEffect } from "react";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import "./leaderboard.css";

export default function leaderboard(props) {
  const [users, setUsers] = useState([]);
  const [userContribScore, setUserContribScore] = useState("");
  
  const fetchUsers = () => {
    axios
      .get("http://127.0.0.1:5000/topcontrib")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    
    // This will get the first letter of email and the domain as the initial
    function stringAvatar(email) {
        const [name, domain] = email.split('@');
        return {
            sx: {
                bgcolor: stringToColor(email),
                width: 32,
                height: 32
            },
            children: `${name[0]}${domain[0]}`,
        };
    }

  useEffect(() => {
    const fetchUserID = async () => {
        const userID = getCookie("userID");
        console.log("Cookie is " + userID);
        if (userID) {
          try {
            const response = await axios.get("http://127.0.0.1:5000/contrib", {
              params: { userID: userID },
            });
    
            setUserContribScore(response.data[0][1]);
            console.log(response.data);
          } catch (error) {
            console.log(error);
          }
        }
    };
    fetchUserID();
  }, []);

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  return (
    <section className={`leaderboard-box ${props.className}`}>
      <div>
        <div className="post_container">
            <ListItemText
                sx={{ my: 0 }}
                primary="Contribution Score Leaderboard"
                primaryTypographyProps={{
                  fontSize: 17,
                  fontWeight: 'medium',
                  letterSpacing: 0,
                  paddingLeft: 1
                }}
            />
            <ListItemText
                primary={`Your contribution Score: ${userContribScore}`}
                primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: 'medium',
                    letterSpacing: 0,
                    paddingLeft: 3
                  }}
            />
            {users.map((user) => (
                <List sx={{ width: "100%", maxWidth: 270, height: 54 , bgcolor: "background.paper" }} key={user[0]}>
                    <ListItem alignItems="flex-start" sx={{ py: 0.1 }}>
                    <ListItemAvatar>
                        <Avatar {...stringAvatar(user[4])} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={user[4]}
                        primaryTypographyProps={{
                            fontSize: 13
                        }}
                        secondary={
                        <React.Fragment>
                            <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                            fontSize={11}
                            >
                            {`${user[1]} ${user[2]}`}
                            </Typography>
                        </React.Fragment>
                        }
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
