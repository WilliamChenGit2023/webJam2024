import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "./Web.css"; //Imported Web.css file
import config from './config';

const ImageUpload = () => {
  const serverAddress = config.serverAddress;
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [image, setImage] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(serverAddress+'/get_folders');
        setFolders(response.data.folders);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, []);

  const fetchImagesFromFolder = async (folderName) => {
    try {
      const response = await axios.post(serverAddress+'/get_images_in_folder', {
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
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchCoordinates = async (folderName, imageUrl) => {
    const imageFilename = imageUrl.split('/').pop();
    try {
      const response = await axios.post(serverAddress+'/get_coordinates', {
        folder_name: folderName,
        image_filename: imageFilename,
      });
      setCoordinates(response.data.coordinates);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setCoordinates(null);
    }
  };

  const drawRectangle = () => {
    if (coordinates && coordinates.length === 2 && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const img = imageRef.current;

      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;

      context.clearRect(0, 0, canvas.width, canvas.height);

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
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedFolder) {
        fetchImagesFromFolder(selectedFolder);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [selectedFolder]);

  useEffect(() => {
    drawRectangle();
  }, [coordinates, image]);

  const handleFolderChange = (event) => {
    const folderName = event.target.value;
    setSelectedFolder(folderName);
    if (folderName) {
      fetchImagesFromFolder(folderName);
    } else {
      setImage(null);
      setCoordinates(null);
    }
  };

  return (
    <div>
      <h1>Select Folder and View Image with Rectangle</h1>
      <select onChange={handleFolderChange} value={selectedFolder}>
        <option value="">Select Folder</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder}>
            {folder}
          </option>
        ))}
      </select>

      {image && (
        <div style={{ position: 'relative' }}>
          <img
            ref={imageRef}
            src={serverAddress+`${image}`}
            alt="Uploaded"
            style={{ maxWidth: '500px', display: 'block' }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {coordinates ? (
        <div>
          <h3>Coordinates:</h3>
          <ul>
            {coordinates.map((coord, index) => (
              <li key={index}>
                Point {index + 1}: (X: {coord.x}, Y: {coord.y})
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

export default ImageUpload;
