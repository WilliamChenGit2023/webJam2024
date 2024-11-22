import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "./Web.css"; // Imported Web.css file
import config from './config';

const ImageUploadAndStatus = () => {
  const serverAddress = config.serverAddress;

  // Image Upload and Rectangle Drawing State
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [image, setImage] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Status State
  const [status, setStatus] = useState(""); // Status of selected folder
  const [error, setError] = useState(""); // Error message, if any

  // Fetch list of folders
  useEffect(() => {
    axios.get(serverAddress + '/get_folders')
      .then((response) => {
        setFolders(response.data.folders);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch folders.");
      });

    // Set up interval to refresh status and image every 2 seconds
    const intervalId = setInterval(() => {
      if (selectedFolder) {
        fetchStatus(selectedFolder);
        fetchImagesFromFolder(selectedFolder);
      }
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [selectedFolder]);

  const fetchImagesFromFolder = async (folderName) => {
    try {
      const response = await axios.post(serverAddress + '/get_images_in_folder', {
        folder_name: folderName,
      });

      if (response.data.images && response.data.images.length > 0) {
        const newImage = response.data.images[0];
        if (newImage !== image) {
          setImage(newImage);
          fetchCoordinates(folderName, newImage);
        }
      } else {
        setImage(null);
        setCoordinates(null);
        clearCanvas(); // Clear the canvas when no images are found
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchCoordinates = async (folderName, imageUrl) => {
    const imageFilename = imageUrl.split('/').pop();
    try {
      const response = await axios.post(serverAddress + '/get_coordinates', {
        folder_name: folderName,
        image_filename: imageFilename,
      });
      setCoordinates(response.data.coordinates);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setCoordinates(null);
      clearCanvas(); // Clear the canvas if coordinates fetch fails
    }
  };

  const fetchStatus = (folder) => {
    if (!folder) return;

    axios.get(serverAddress + '/get_status', {
      params: { folder_name: folder }, // Pass folder_name as query parameter
    })
      .then((response) => {
        setStatus(response.data.status);
        setError(""); // Clear any previous errors
      })
      .catch((err) => {
        console.error(err);
        setStatus("");
        setError(err.response?.data?.error || `Failed to fetch status for folder: ${folder}`);
      });
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = 640; // Ensure canvas size remains consistent
      canvas.height = 480;
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    }
  };

  const drawRectangle = () => {
    if (coordinates && coordinates.length === 2 && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas size to fixed 640x480
      canvas.width = 640;
      canvas.height = 480;

      context.clearRect(0, 0, canvas.width, canvas.height); // Clear existing drawings

      const [point1, point2] = coordinates;
      const x = Math.min(point1.x, point2.x);
      const y = Math.min(point1.y, point2.y);
      const width = Math.abs(point2.x - point1.x);
      const height = Math.abs(point2.y - point1.y);

      context.beginPath();
      context.rect(x, y, width, height);
      context.lineWidth = 2;
      context.strokeStyle = 'blue';
      context.stroke();
    } else {
      clearCanvas(); // Clear the canvas if no valid coordinates are present
    }
  };

  useEffect(() => {
    drawRectangle();
  }, [coordinates, image]);

  const handleFolderChange = (e) => {
    const folder = e.target.value;
    setSelectedFolder(folder);
    setImage(null);
    setCoordinates(null); // Reset image and coordinates when switching folders
    clearCanvas(); // Clear the canvas on folder change
    fetchStatus(folder); // Fetch status whenever folder changes
    if (folder) {
      fetchImagesFromFolder(folder);
    }
  };

  return (
    <div id="mainBody">
      <div className='main-container2'>
        <h1>Folder Status and Image Upload</h1>
      </div>
  
      <label htmlFor="folder-select" style={{ fontSize: "18px" }}>
        Select a folder:
      </label>
      <select
        id="folder-select"
        value={selectedFolder}
        onChange={handleFolderChange}
        style={{ marginLeft: "10px", fontSize: "16px", padding: "5px" }}
      >
        <option value="" disabled>
          Choose a folder
        </option>
        {folders.map((folder) => (
          <option key={folder} value={folder}>
            {folder}
          </option>
        ))}
      </select>
  
      {selectedFolder && (
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          <p><strong>Selected Folder:</strong> {selectedFolder}</p>
          {status && (
            <p><strong>Status:</strong> {status === "true" ? "✅ Washing Machine Available!" : "❌ Washing Machine Unavailable :("}</p>
          )}
          {error && <p style={{ color: "red" }}><strong>Error:</strong> {error}</p>}
        </div>
      )}
  
      {image && (
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px'
          }}
        >
          <div style={{ position: 'relative', width: '640px', height: '480px' }}>
            <img
              ref={imageRef}
              src={serverAddress + `${image}`}
              alt="Uploaded"
              style={{ width: '640px', height: '480px', display: 'block' }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '640px',
                height: '480px',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      )}
  
      {coordinates ? (
        <div style={{ marginTop: '20px' }}>
          <h3>Coordinates:</h3>
          <ul>
          {coordinates.map((coord, index) => (
            <li key={index}>
              Point {index + 1}: ({coord.x}, {coord.y})
            </li>
          ))}
        </ul>
        </div>
      ) : (
        image && <p>No coordinates found for this image.</p>
      )}
    </div>
  );
};

export default ImageUploadAndStatus;
