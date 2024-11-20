import React, { useEffect, useRef, useState } from 'react';

const App = () => {
  const [photos, setPhotos] = useState([]);  // To store photos
  const [folders, setFolders] = useState([]);  // To store folder names
  const [selectedFolder, setSelectedFolder] = useState('');  // For storing selected folder
  const [backendStatus, setBackendStatus] = useState(null); 
  const [isRecording, setIsRecording] = useState(false);  
  const [isCameraStarted, setIsCameraStarted] = useState(false); 
  const [newFolderName, setNewFolderName] = useState(''); 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Function to check backend connection
  const checkBackend = async () => {
    try {
      const response = await fetch('https://10.12.141.7:5000/ping');
      const data = await response.json();
      if (data.status === 'success') {
        setBackendStatus(`Connected: ${data.message}, Number: ${data.number}`);
      } else {
        setBackendStatus('Failed to connect to backend');
      }
    } catch (error) {
      setBackendStatus('Error connecting to backend');
      console.error('Error checking backend:', error);
    }
  };

  // Function to fetch the list of folders
  const fetchFolders = async () => {
    try {
      const response = await fetch('https://10.12.141.7:5000/get_folders');  // Adjust the backend URL accordingly
      const data = await response.json();
      if (data.folders) {
        setFolders(data.folders); // Set the folders from the backend
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  // Function to fetch photos from the selected folder
  const fetchPhotosFromFolder = async (folderName) => {
    try {
      const response = await fetch('https://10.12.141.7:5000/get_images_in_folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: folderName }),
      });
      const data = await response.json();
      if (data.images) {
        setPhotos(data.images.map(imageUrl => `https://10.12.141.7:5000${imageUrl}`)); // Construct full URLs for images
      }
    } catch (error) {
      console.error('Error fetching photos from folder:', error);
    }
  };

  // Handle folder selection change
  const handleFolderChange = (event) => {
    const folderName = event.target.value;
    setSelectedFolder(folderName);
    if (folderName) {
      fetchPhotosFromFolder(folderName);  // Fetch images for the selected folder
    } else {
      setPhotos([]);  // Clear photos if no folder is selected
    }
  };

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraStarted(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera permission denied or unavailable.');
    }
  };

  // Capture photo logic
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      uploadPhoto(imageData);
    }
  };

  // Upload photo to the backend
  const uploadPhoto = async (imageData) => {
    try {
      const response = await fetch('https://10.12.141.7:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData, folder_name: selectedFolder }),
      });
      const data = await response.json();
      if (data.success) {
        fetchPhotosFromFolder(selectedFolder); // Fetch updated photos
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    setIsRecording(prevState => !prevState);
  };

  // Create a new folder
  const createFolder = async () => {
    if (!newFolderName) {
      alert('Please enter a folder name.');
      return;
    }
    try {
      const response = await fetch('https://10.12.141.7:5000/create_folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: newFolderName }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Folder created successfully!');
        setNewFolderName('');
        fetchFolders(); // Refresh folders list
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Error creating folder.');
    }
  };

  useEffect(() => {
    checkBackend();
    fetchFolders(); // Fetch folder list on mount
  }, []);

  useEffect(() => {
    const interval = isRecording ? setInterval(capturePhoto, 2000) : null;
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div>
      <h1>Manual Photo Capture</h1>

      <div>
        <h2>Backend Status</h2>
        <p>{backendStatus ? backendStatus : 'Checking backend...'}</p>
      </div>

      {!isCameraStarted && (
        <button onClick={startCamera}>Start Camera</button>
      )}

      <video ref={videoRef} autoPlay width="320" height="240" style={{ display: isCameraStarted ? 'block' : 'none' }} />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />

      <button onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div>
        <h2>Create New Folder</h2>
        <input 
          type="text" 
          value={newFolderName} 
          onChange={(e) => setNewFolderName(e.target.value)} 
          placeholder="Folder Name" 
        />
        <button onClick={createFolder}>Create Folder</button>
      </div>

      <div>
        <h2>Captured Photos in "{selectedFolder}" Folder</h2>
        <select onChange={handleFolderChange} value={selectedFolder}>
          <option value="">Select a folder</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder}>{folder}</option>
          ))}
        </select>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Captured ${index}`} style={{ width: '100px', height: 'auto', margin: '5px' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

