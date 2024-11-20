import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([{}]);
  const [image, setImage] = useState(null);

  // Fetch data from "/members"
  useEffect(() => {
    fetch("/members")  // Use explicit backend URL
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Get the selected file
  };

  // Handle file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading the image:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      {/* Display members data */}
      {typeof data.members === 'undefined' ? (
        <p>Loading...</p>
      ) : (
        data.members.map((member, i) => (
          <p key={i}>{member}</p>
        ))
      )}

      {/* File upload form */}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
}

export default App;
