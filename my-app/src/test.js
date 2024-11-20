import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const imageRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Directly store the file instead of base64
    }
  };

  const handleImageClick = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (coordinates.length < 2) {
      setCoordinates([...coordinates, { x, y }]);
    }
  };

  // Send the image and coordinates to the backend
  const handleSubmit = async () => {
    if (coordinates.length === 2 && image) {
      try {
        const formData = new FormData();
        formData.append('image', image); // Append the file directly
        formData.append('coordinates', JSON.stringify(coordinates));

        const response = await axios.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Response from backend:', response.data);
      } catch (error) {
        console.error('Error uploading image and coordinates:', error.response || error);
      }
    } else {
      alert('Please select two points on the image.');
    }
  };

  return (
    <div>
      <h1>Upload Image and Select Points</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <div>
          <img
            ref={imageRef}
            src={URL.createObjectURL(image)} // Use object URL for displaying the image
            alt="Uploaded"
            onClick={handleImageClick}
            style={{ cursor: 'crosshair', maxWidth: '500px' }}
          />
        </div>
      )}
      <div>
        <p>Selected Coordinates:</p>
        <ul>
          {coordinates.map((coord, index) => (
            <li key={index}>
              Point {index + 1}: ({coord.x}, {coord.y})
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ImageUpload;
