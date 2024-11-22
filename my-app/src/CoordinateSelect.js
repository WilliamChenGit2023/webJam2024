import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "./Web.css";
import config from './config';

const CoordinateSelect = () => {
  const serverAddress = config.serverAddress
  const [folders, setFolders] = useState([]); 
  const [selectedFolder, setSelectedFolder] = useState('');
  const [image, setImage] = useState(null); 
  const [coordinates, setCoordinates] = useState([]);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

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
    const intervalId = setInterval(fetchFolders, 5000); 
    return () => clearInterval(intervalId);
  }, []);

  const fetchImagesFromFolder = async (folderName) => {
    try {
      const response = await axios.post(serverAddress+'/get_images_in_folder', {
        folder_name: folderName,
      });
      if (response.data.images && response.data.images.length > 0) {
        setImage(response.data.images[0]); 
      } else {
        setImage(null); 
      }
    } catch (error) {
      setImage(null);
    }
  };

  const handleFolderChange = (event) => {
    const folderName = event.target.value;
    setSelectedFolder(folderName);
    setCoordinates([]); 

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (folderName) {
      fetchImagesFromFolder(folderName);
    } else {
      setImage(null); 
    }
  };

  const handleImageClick = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    x = Math.max(0, x);
    y = Math.max(0, y);

    if (coordinates.length < 2) {
      const newCoordinates = [...coordinates, { x, y }];
      setCoordinates(newCoordinates);
      drawPoints(newCoordinates);
    }
  };

  const drawPoints = (newCoordinates) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    newCoordinates.forEach(coord => {
      context.beginPath();
      context.arc(coord.x, coord.y, 5, 0, Math.PI * 2);
      context.fillStyle = 'red';
      context.fill();
    });

    if (newCoordinates.length === 2) {
      const [point1, point2] = newCoordinates;
      const width = Math.abs(point2.x - point1.x);
      const height = Math.abs(point2.y - point1.y);
      const x = Math.min(point1.x, point2.x);
      const y = Math.min(point1.y, point2.y);

      context.beginPath();
      context.rect(x, y, width, height);
      context.lineWidth = 2;
      context.strokeStyle = 'blue';
      context.stroke();
    }
  };

  const handleSubmit = async () => {
    if (coordinates.length === 2 && selectedFolder && image) {
      try {
        const response = await axios.post(serverAddress+'/upload_coordinates', {
          folder_name: selectedFolder,
          image_filename: image.split('/').pop(),
          coordinates: coordinates,
        });
        alert('Coordinates uploaded successfully!');
        setCoordinates([]); 
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); 
      } catch (error) {
        alert('Error uploading coordinates');
      }
    } else {
      alert('Please select two points on the image and ensure the image is loaded.');
    }
  };

  return (
    <div id="mainBody" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className='main-container2'>
        <h1>Select Washing Machine to Upload Coordinates</h1>
      </div>
      <select 
        onChange={handleFolderChange} 
        value={selectedFolder}
        style={{ marginLeft: "10px", fontSize: "16px", padding: "5px" , width: "65%"}}
      >
        <option value="">--Select Laundry Machine--</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder}>{folder}</option>
        ))}
      </select>
  
      {image && (
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginTop: '20px' // Added space between elements
          }}
        >
          <div style={{ position: 'relative' }}>
            <img
              ref={imageRef}
              src={serverAddress + `${image}`}
              alt="Uploaded"
              onClick={handleImageClick}
              style={{ cursor: 'crosshair', maxWidth: '640px', maxHeight: '480px' }}
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
              }}
            />
          </div>
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
  
      <button className="button" onClick={handleSubmit}>Submit Coordinates</button>
    </div>
  );
  
  
};

export default CoordinateSelect;
