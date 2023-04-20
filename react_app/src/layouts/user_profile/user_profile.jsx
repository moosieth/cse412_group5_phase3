import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from '@mui/material/Button';
import axios from "axios";


export default function UserProfile({ friendID }) {
    const [userEmail, setUserEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [homeTown, setHomeTown] = useState("");
    const [gender, setGender] = useState("");
    const [isFriend, setIsFriend] = useState(false);

    // useEffect hook to make a request with user ID using cookie
    useEffect(() => {
        const fetchUserEmail = async () => {
        console.log("current id is " + friendID);
        if (friendID) {
            try {
            const response = await axios.get("http://127.0.0.1:5000/userbyid", {
                params: { userID: friendID },
            });
    
            setFirstName(response.data[0][1]);
            setLastName(response.data[0][2]);
            setHomeTown(response.data[0][3]);
            setGender(response.data[0][4]);
            setUserEmail(response.data[0][6]);
            } catch (error) {
            console.log(error);
            }
        }
        };
    
        fetchUserEmail();
        checkIsFriend();
    }, []);

    // Function for getting the cookie
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
        return parts.pop().split(";").shift();
        }
    };

    // Function for getting the following feature
    const handleFollow = async () => {
        const userID = getCookie("userID");
        if (userID && friendID) {
          try {
            await axios.post("http://127.0.0.1:5000/add", {
              target: "friend",
              userID: parseInt(userID),
              friendID: parseInt(friendID),
              dateFormed: "2023-02-09 00:00:00",
            });
            // Handle success, e.g., show a success message or update the state
          } catch (error) {
            console.log(error);
            // Handle error, e.g., show an error message
          }
        }
    };

    // to check if the user and the check are friends
    const checkIsFriend = async () => {
        const userID = getCookie("userID");
        if (userID && friendID) {
          try {
            const response = await axios.get("http://127.0.0.1:5000/isfriend", {
              params: { userID: parseInt(userID), checkID: parseInt(friendID) },
            });
            if (response.data.success) {
              setIsFriend(true);
            } else {
              setIsFriend(false);
            }
          } catch (error) {
            console.log(error);
            setIsFriend(false);
          }
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
        },
        children: `${name[0]}${domain[0]}`,
        };
    }

    return(
        <div className="user-profile">
            <div className="user-profile_left">
                {userEmail && (
                    <Avatar
                    className="avatar"
                    sx={{ width: 45, height: 45 }}
                    {...stringAvatar(userEmail)}
                    />
                )}
            </div>
            <div className="user-profile_right">
                <div className="user-name">
                    <span>{firstName} {lastName}</span>
                    {isFriend ? (
                        <Button variant="contained">Following</Button>
                        ) : (
                        <Button variant="outlined" onClick={handleFollow}>Follow</Button>
                    )}
                </div>
            </div>
        </div>
    );
} 