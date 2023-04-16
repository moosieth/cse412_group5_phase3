import React, { useState } from 'react';

function photo() {
  const [image, setImage] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  return (
    <div>
      <h1>My Photo</h1>
      <input type="file" onChange={handleFileUpload} />
      {image && <img src={image} alt="My Photo" />}
    </div>
  );
}

export default photo;