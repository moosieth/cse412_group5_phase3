import { useState, useEffect } from 'react';
import Skeleton from "@mui/material/Skeleton"
import axios from 'axios';
import "./user_posts.css"

export default function UserPosts({ friendID, selectedAlbum, albumDeleted, resetAlbumDeleted }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log("Loading");
        if (selectedAlbum) {
          setLoading(true);
          axios
            .get('http://127.0.0.1:5000/photobyalbum', { params: { albumID: selectedAlbum } })
            .then((response) => {
                console.log("This is an image: " + response.data);
                setImages(response.data);
                setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching images:', error);
              setLoading(false);
            });
        }
    }, [selectedAlbum]);

    // Handle album deletion effect
    useEffect(() => {
        console.log("albumDeleted effect triggered");
        if (albumDeleted) {
          setImages([]);
          setLoading(true);
          // Reset the albumDeleted state
          resetAlbumDeleted();
        }
      }, [albumDeleted]);

    return (
        <div className="posts">
            {/* if no album is selected just disaply the skeletons*/}
            {selectedAlbum === null || loading ? (
                <div className="empty_posts">
                {new Array(9)
                    .fill(null)
                    .map((_, index) => (
                    <div key={index} className="empty_post">
                        <Skeleton variant="rectangular" className="skeleton" />
                    </div>
                    ))}
                </div>
            ) : (
                <div className="image_posts">
                    {images.map((image) => (
                        <div key={image[0]} className="image_post">
                            <img className='user_photos' src={image[2]} alt="Failed to load image" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}