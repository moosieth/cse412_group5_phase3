import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from '@mui/material/Select';
import axios from 'axios';
import "./user_type.css"


const UserType = (props) => {
    const [selectedAction, setSelectedAction] = useState(1);
    const [album, setAlbum] = React.useState('');
    const [albums, setAlbums] = React.useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const { friendID, onItemClicked } = props;

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/searchalbum', { params: { userID: friendID, name: '' } })
            .then(response => {
                setAlbums(response.data.map(item => ({ id: item[0], name: item[1] })));
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching album data:', error);
            });
    }, [friendID]);

    const selectAction = (selectedAction) => () => {
        setSelectedAction(() => selectedAction);
        onItemClicked(selectedAction);
    };
    const handleChange = (event) => {
        setAlbum(event.target.value);
        props.onAlbumSelected(event.target.value);
    };

    const handleDeleteClick = () => {
        if (album) {
          if (window.confirm("Are you sure you want to delete this album?")) {
            axios.post("http://127.0.0.1:5000/removebyid", { target: "album", id: album }).then((response) => {
              console.log(response);
              // Refresh the album list
              setAlbums(albums.filter((a) => a.id !== album));
              setAlbum('');
              props.onAlbumDeleted(null);
            }).catch((error) => {
              console.error("Error deleting the album:", error);
            });
          }
        } else {
          alert("Please select an album to delete.");
        }
    };

    return (
        <div>
            <div className='album-type'>
                <Box display="flex" alignItems="center" sx={{ minWidth: 50 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Album</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={album}
                            label="Album"
                            onChange={handleChange}
                        >
                            {albums.length > 0 ? (
                                albums.map(({ id, name }) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No album found.</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <IconButton aria-label="delete" onClick={handleDeleteClick}>
                        <DeleteIcon className='delete_btn' />
                    </IconButton>
                </Box>
            </div>
            <div className='profile-type'>
                {/* not really using this feature */}
                <div className={`profile-type_item ${selectedAction === 1 ? 'profile-type_item--active' : ''}`} onClick={selectAction(1)}>
                    <svg aria-label="" className="_8-yf5 " color="#262626" fill="#262626" height="12" role="img" viewBox="0 0 48 48" width="12"><path clipRule="evenodd" d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z" fillRule="evenodd"></path></svg>
                    <span>Posts</span>
                </div>
                <div className={`profile-type_item ${selectedAction === 2 ? 'profile-type_item--active' : ''}`} onClick={selectAction(2)}>
                    <svg aria-label="" className="_8-yf5 " color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22.5C6.2 22.5 1.5 17.8 1.5 12S6.2 1.5 12 1.5 22.5 6.2 22.5 12 17.8 22.5 12 22.5zm5-11.8l-6.8-3.9c-.5-.3-1-.3-1.5 0-.4.3-.7.7-.7 1.3v7.8c0 .5.3 1 .8 1.3.2.1.5.2.8.2s.5-.1.8-.2l6.8-3.9c.5-.3.8-.8.8-1.3s-.5-1-1-1.3zm-7.5 5.2V8.1l6.8 3.9-6.8 3.9z"></path></svg>
                    <span>Videos</span>
                </div>
            </div>
        </div>
    );
};

export default UserType;