import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [folders, setFolders] = useState([]); // To store available folders
  const [selectedFolder, setSelectedFolder] = useState(''); // Folder for displaying photos
  const [image, setImage] = useState(null); // To store the fetched image
  const [coordinates, setCoordinates] = useState([]);
  const imageRef = useRef(null);

  // Fetch the list of folders from the backend
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('https://10.12.141.7:5000/get_folders');
        setFolders(response.data.folders);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };
    fetchFolders();
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
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (coordinates.length < 2) {
      setCoordinates([...coordinates, { x, y }]);
    }
  };

  // Submit coordinates to the backend
  const handleSubmit = async () => {
    if (coordinates.length === 2 && selectedFolder) {
      try {
        const response = await axios.post('https://10.12.141.7:5000/save_coordinates', {
          folder_name: selectedFolder,
          coordinates: coordinates,
        });
        console.log('Response from backend:', response.data);
      } catch (error) {
        console.error('Error uploading coordinates:', error.response || error);
      }
    } else {
      alert('Please select two points on the image.');
    }
  };

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
        <div>
          <img
            ref={imageRef}
            src={`https://10.12.141.7:5000/${image}`}
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

      <button onClick={handleSubmit}>Submit Coordinates</button>
    </div>
  );
};

export default ImageUpload;
