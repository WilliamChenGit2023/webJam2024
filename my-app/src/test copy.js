import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const I2 = () => {
  const [folders, setFolders] = useState([]); // To store available folders
  const [selectedFolder, setSelectedFolder] = useState(''); // Folder for displaying photos
  const [image, setImage] = useState(null); // To store the fetched image
  const [coordinates, setCoordinates] = useState([]);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch the list of folders from the backend periodically
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('https://10.12.141.7:5000/get_folders');
        setFolders(response.data.folders);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    // Initial folder fetch
    fetchFolders();

    // Set up a periodic update every 5 seconds
    const intervalId = setInterval(fetchFolders, 5000); // Update every 5 seconds

    // Clear the interval on component unmount to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []);

  // Function to fetch images from the selected folder
  const fetchImagesFromFolder = async (folderName) => {
    console.log(`Fetching images from folder: ${folderName}`); // Debugging
    try {
      const response = await axios.post('https://10.12.141.7:5000/get_images_in_folder', {
        folder_name: folderName,
      });
      if (response.data.images && response.data.images.length > 0) {
        setImage(response.data.images[0]); // Set the first image from the folder
      } else {
        console.error('No images found in the folder');
        setImage(null); // Clear image if no images found
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setImage(null);
    }
  };

  // Fetch coordinates JSON based on the selected folder and image
  const fetchCoordinates = async (folderName, imageFilename) => {
    try {
      const response = await axios.get(`https://10.12.141.7:5000/get_coordinates`, {
        params: { folder_name: folderName, image_filename: imageFilename },
      });
      if (response.data.coordinates) {
        setCoordinates(response.data.coordinates);
      } else {
        console.error('No coordinates found for this image');
        setCoordinates([]); // Clear coordinates if none found
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  // Handle folder change and fetch images
  const handleFolderChange = (event) => {
    const folderName = event.target.value;
    setSelectedFolder(folderName);
    setCoordinates([]); // Reset coordinates when a new folder is selected
    console.log(`Selected folder: ${folderName}`); // Debugging
    if (folderName) {
      fetchImagesFromFolder(folderName); // Fetch images from the selected folder
    } else {
      setImage(null); // Clear image if no folder selected
    }
  };

  // Handle image click to capture coordinates
  const handleImageClick = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Ensure coordinates are not negative
    x = Math.max(0, x);
    y = Math.max(0, y);

    if (coordinates.length < 2) {
      const newCoordinates = [...coordinates, { x, y }];
      setCoordinates(newCoordinates);
      drawPoints(newCoordinates);
    }
  };

  // Draw points and rectangle on the canvas
  const drawPoints = (newCoordinates) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = imageRef.current;

    // Clear previous points and rectangle
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the points
    newCoordinates.forEach(coord => {
      context.beginPath();
      context.arc(coord.x, coord.y, 5, 0, Math.PI * 2); // Draw circle at the point
      context.fillStyle = 'red'; // Set color for the point
      context.fill();
    });

    // Draw the rectangle if there are two points
    if (newCoordinates.length === 2) {
      const [point1, point2] = newCoordinates;

      // Calculate width and height of the rectangle
      const width = Math.abs(point2.x - point1.x);
      const height = Math.abs(point2.y - point1.y);

      // Determine the top-left corner position
      const x = Math.min(point1.x, point2.x);
      const y = Math.min(point1.y, point2.y);

      // Draw the rectangle
      context.beginPath();
      context.rect(x, y, width, height);
      context.lineWidth = 2;
      context.strokeStyle = 'blue'; // Rectangle color
      context.stroke();
    }
  };

  // Submit coordinates to the backend
  const handleSubmit = async () => {
    if (coordinates.length === 2 && selectedFolder && image) {
      try {
        const response = await axios.post('https://10.12.141.7:5000/upload_coordinates', {
          folder_name: selectedFolder,
          image_filename: image.split('/').pop(), // Extract the image filename from the URL
          coordinates: coordinates,
        });
        console.log('Response from backend:', response.data);
        alert('Coordinates uploaded successfully!');
      } catch (error) {
        console.error('Error uploading coordinates:', error.response || error);
        alert('Error uploading coordinates');
      }
    } else {
      alert('Please select two points on the image and ensure the image is loaded.');
    }
  };

  useEffect(() => {
    // Fetch coordinates when image is selected
    if (image) {
      fetchCoordinates(selectedFolder, image.split('/').pop());
    }
  }, [image, selectedFolder]);

  return (
    <div>
      <h1>Select Folder and Image, then Click Two Points</h1>
      <select onChange={handleFolderChange} value={selectedFolder}>
        <option value="">Select Folder</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder}>{folder}</option>
        ))}
      </select>

      {image && (
        <div style={{ position: 'relative' }}>
          <img
            ref={imageRef}
            src={`https://10.12.141.7:5000${image}`} // Fix image URL
            alt="Uploaded"
            onClick={handleImageClick}
            style={{ cursor: 'crosshair', maxWidth: '500px' }}
          />
          <canvas
            ref={canvasRef}
            width="500" // Set canvas size to match image size
            height="500"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none', // Disable canvas interaction
            }}
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

      <button onClick={handleSubmit}>Submit Coordinates</button>
    </div>
  );
};

export default I2;
