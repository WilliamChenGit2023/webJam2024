import React, { useEffect, useRef, useState } from 'react';
import './Web.css'

const Webtest = () => {
  const [photos, setPhotos] = useState([]); // To store photos for display
  const [folders, setFolders] = useState([]); // To store available folders
  const [selectedFolder, setSelectedFolder] = useState(''); // Folder for displaying photos
  const [recordingFolder, setRecordingFolder] = useState(''); // Folder for uploading photos
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
      const response = await fetch('https://10.12.141.7:5000/get_folders');
      const data = await response.json();
      if (data.folders) {
        setFolders(data.folders);
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
        setPhotos(data.images.map(imageUrl => `https://10.12.141.7:5000${imageUrl}`));
      } else {
        setPhotos([]);
      }
    } catch (error) {
      console.error('Error fetching photos from folder:', error);
    }
  };

  // Handle folder change for displaying photos
  const handleDisplayFolderChange = (event) => {
    const folderName = event.target.value;
    setSelectedFolder(folderName);
    if (folderName) {
      fetchPhotosFromFolder(folderName);
    } else {
      setPhotos([]);
    }
  };

  // Start camera
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

  // Capture photo and upload it
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current && recordingFolder) {
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
        body: JSON.stringify({ image: imageData, folder_name: recordingFolder }),
      });
      const data = await response.json();
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
        fetchFolders();
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

  // Polling for recording
  useEffect(() => {
    const interval = isRecording ? setInterval(capturePhoto, 2000) : null;
    return () => clearInterval(interval);
  }, [isRecording]);

  // Polling for displayed photos
  useEffect(() => {
    const interval = selectedFolder
      ? setInterval(() => fetchPhotosFromFolder(selectedFolder), 2000)
      : null;
    return () => clearInterval(interval);
  }, [selectedFolder]);

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

      <div>
        <h2>Recording Folder</h2>
        <select onChange={(e) => setRecordingFolder(e.target.value)} value={recordingFolder}>
          <option value="">Select a folder</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder}>{folder}</option>
          ))}
        </select>
      </div>

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
        <select onChange={handleDisplayFolderChange} value={selectedFolder}>
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

export default Webtest;
