import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import "./content.css";
import xmark from "../../data/xmark.png";
import heart from "../../data/heart.png";
import heart_fill from "../../data/heart_fill.png";
import trash from "../../data/trash.png";
import { motion, AnimatePresence } from "framer-motion";
import Leaderboard from "../../components/leaderboard/leaderboard";
import Friend_rec from "../../components/friend_rec/friend_rec";
import TrendTags from "../../components/trending_tags/trending_tags";

export default function Content(props) {
  const [numLikes, setNumLikes] = useState(null);
  const [likedPhoto, setLikedPhoto] = useState(null);
  const [photoComments, setPhotoComments] = useState(null);
  const [commentors, setCommentors] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [scrollbarVisible, setScrollbarVisible] = useState(false);


  useEffect(() => {
    // Fetch commentors' email addresses when the component mounts
    const fetchCommentors = async () => {
      if (!Array.isArray(photoComments)) {
        return;
      }
      const commentorEmails = await Promise.all(photoComments.map(comment => getCommentorEmail(comment[2])));
      setCommentors(commentorEmails);
    };
    fetchCommentors();
  }, [photoComments]);

  // Trying to fetch the user if from the photo
  // and then retrieve the email by calling axios again
  const fetchPhotos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/recentphotos");
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

  async function getLikes(photoID) {
    try {
      const response = await axios.get('http://127.0.0.1:5000/numlikes', { params: { photoID } });
      setNumLikes(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function viewComments(thePhotoID) {
    await axios.get('http://127.0.0.1:5000/combyphoto', { params: { photoID: thePhotoID } })
      .then(function (response) {
        console.log(response.data);
        setPhotoComments(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getCommentorEmail(theUserID) {
    const response = await axios.get('http://127.0.0.1:5000/userbyid', { params: { userID: theUserID } })
    console.log("The commentor is " + response.data[0][6]);
    return response.data[0][6];
  }

  function handleLikeClick(thePhotoID) {
    const theUserID = getCookie("userID");
    console.log("The current User ID is " + theUserID + " the photoID is " + thePhotoID);
    axios.post('http://127.0.0.1:5000/add', { target: "likes", userID: theUserID, photoID: thePhotoID });

    // Test
    // Update the local state when the like button is clicked
    setLikedPhoto(true);
    setNumLikes(Number(numLikes) + 1);
  }

  async function didUserLike(thePhotoID) {
    try {
      const theUserID = parseInt(getCookie("userID"));
      const response = await axios.get('http://127.0.0.1:5000/wholikes', { params: { photoID: thePhotoID } });
      const users = response.data;
      console.log("The userID is " + theUserID + " iterating through photo " + thePhotoID);
      let photoLiked = false;
      if (Array.isArray(users)) {
        for (let i = 0; i < users.length; i++) {
          console.log("Photo is liked by " + users[i][0]);
          if (parseInt(users[i][0]) === theUserID) {
            photoLiked = true;
            console.log("Liked photo is " + photoLiked);
            break;
          }
        }
      } else {
        console.log("Response is not an array: ", users);
        users = []; // Set users to an empty array if it's not an array
      }
      setLikedPhoto(photoLiked);
      console.log("Liked photo is " + photoLiked);
      return photoLiked;
    } catch (error) {
      console.error("Error fetching likes: ", error);
    }
  }
   
  

  // Add a new function to handle comment submission
  async function handleCommentSubmit(e) {
    e.preventDefault();
    const theUserID = parseInt(getCookie("userID"));
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await axios.post('http://127.0.0.1:5000/add', {
      target: "comment",
      content: commentText,
      dateCreated: dateCreated,
      userID: theUserID,
      photoID: selectedId
    });

    // Update the local state with the new comment
  if (Array.isArray(photoComments)) {
    setPhotoComments([...photoComments, [null, commentText, theUserID]]);
  } else {
    setPhotoComments([[null, commentText, theUserID]]);
  }
    
    // Clear the comment input
    setCommentText('');
  }

  // For deleting a photo(post)
  async function handleDeletePost(photoID, ownerID) {
    const loggedInUserID = parseInt(getCookie("userID"));
  
    // Compare the photo owner's userID with the userID saved in the cookie
    if (loggedInUserID === ownerID) {
      // If the userIDs match, ask for confirmation before deleting the post
      if (confirm("Are you sure you want to delete this post?\nAll comments and likes regarding this post will be deleted as well.")) {
        // If the user confirms, call the API to delete the post
        await axios.post("http://127.0.0.1:5000/removebyid", { target: "photo", id: photoID });

        // Update the local state to remove the post
        setPhotos(photos.filter((photo) => photo[0] !== photoID));

        // Close the enlarged post view
        setSelectedId(null);
      }
    } else {
      // If the userIDs don't match, show an alert
      alert("You can only delete your own posts.");
    }
  }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  };

  return (
    <div className="everything_wrapper">
        <section className="leaderboard_wrapper">
          <div>
            <Leaderboard />
          </div>
        </section>
        <section className="box">
          <div className="content_wrapper" >
            <div className={`post_container ${scrollbarVisible ? "show-scrollbar" : "hide-scrollbar"}`}
              onScroll={handleScroll}>
              {photos.map((photo) => (
                <motion.div
                  className="post"
                  key={photo[0]}
                  layoutId={photo[0]}
                  onClick={() => {
                    setSelectedId(photo[0]);
                    getLikes(photo[0]);
                    didUserLike(photo[0]);
                    viewComments(photo[0]);
                  }}
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
                    src={decodeURIComponent(photo[3]).replace("https://storage.googleapis.com/group5-inql.appspot.com/", "")}
                    alt="Recent post"
                  />
                  <h4 className="post_text">
                    <strong className="user_name">{photo.userEmail}</strong>{" "}
                    <span className="caption_text">{photo[1]}</span>
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
                    <div className="detail-post">
                      <div key={photo[0]} className="enlarged_post_content">
                        <div className="detail-post_container">
                          <div className="detail-post_left">
                            <img
                              className="post_image"
                              src={decodeURIComponent(photo[3]).replace("https://storage.googleapis.com/group5-inql.appspot.com/", "")}
                              alt="Recent post"
                            />
                          </div>
                          <div className="detail-post_right">
                            <div>
                              <div className="detail-post_header">
                                <Avatar
                                  className="post_avatar"
                                  {...stringAvatar(photo.userEmail)}
                                  onClick={() => {
                                    props.setFriendID(photo[4]);
                                    props.setShowUserPage(true);
                                  }}
                                /> 
                                <h5 className="user_email">{photo.userEmail}</h5>
                              </div>
                              <div className="detail-post_caption">
                                <span className="caption_text">{photo[1]}</span>
                              </div>
                            </div>
                            <div className="detail-post_comments">
                              <motion.div className="Comment_Section">
                                <ul className="commentObj">
                                  {photoComments && Array.isArray(photoComments) && photoComments.map((comment, index) => (
                                    <li key={index}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                        {commentors[index] && (
                                          <Avatar className="post_avatar" {...stringAvatar(commentors[index])} />
                                        )}
                                        <span className="detail-comment">{comment[1]}</span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            </div>
                            <div className="detail-post_wrap">
                              <div className="detail-post_function">
                                {likedPhoto ? (
                                  <img src={heart_fill} alt="heart icon" className="heart_icon" style={{ height: 40, width: 40, marginLeft: 0 }} />
                                ) : (
                                  <img src={heart} alt="heart icon" className="heart_icon likeHeart" style={{ height: 40, width: 40, marginLeft: 0 }} onClick={() => handleLikeClick(selectedId)} />
                                )}
                                <div className="trash_wrapper">
                                  <img
                                    src={trash}
                                    alt="trash icon"
                                    className="trash_delete"
                                    onClick={() => handleDeletePost(selectedId, photo[4])}
                                  />
                                </div>
                              </div>
                              <div className="detail-post_reaction">
                                <div>
                                  <span style={{ fontWeight: 'bold', position: 'relative', top: '-7px', left: '6px' }}>{numLikes}</span>
                                  <span style={{ marginLeft: '5px', position: 'relative', top: '-7px', left: '6px' }}>likes</span>
                                </div>
                              </div>
                            </div>
                            <div className="writing-comment">
                              <form onSubmit={handleCommentSubmit} className="comment_form">
                                <div className="form-wrapper">
                                  <input
                                    type="text"
                                    className="comment_input"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                  />
                                  <button type="submit" className="comment_submit">Post</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div> 
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
        <section className="friend-rec_wrapper">
          <div>
            <Friend_rec />
          </div>
          <div>
            <TrendTags setSelectedTag={props.setSelectedTag} setShowTagPage={props.setShowTagPage}/>
          </div>
        </section>
    </div>
  );
}