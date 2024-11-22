import React, { useEffect, useRef, useState } from 'react';
import './Web.css'
import config from './config';
import { motion, AnimatePresence } from "framer-motion";
import DeleteFolder from './DeleteFolder';

const BasicSettings = () => {
  const serverAddress = config.serverAddress;
  const [photos, setPhotos] = useState([]); // To store photos for display
  const [folders, setFolders] = useState([]); // To store available folders
  const [selectedFolder, setSelectedFolder] = useState(''); // Folder for displaying photos
  const [recordingFolder, setRecordingFolder] = useState(''); // Folder for uploading photos
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);


  // Function to fetch the list of folders
  const fetchFolders = async () => {
    try {
      const response = await fetch(serverAddress+'/get_folders');
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
      const response = await fetch(serverAddress+'/get_images_in_folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: folderName }),
      });
      const data = await response.json();
      if (data.images) {
        setPhotos(data.images.map(imageUrl => serverAddress+`${imageUrl}`));
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
    console.log(folderName);
    console.log("folder");
    console.log(selectedFolder)
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
      setIsCameraStarted(true); // Ensure video renders after this line
      // Attach stream after rendering the video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera permission denied or unavailable.");
    }
  };

  // Capture photo and upload it
  const capturePhoto = async () => {
    console.log(canvasRef.current)
    if (videoRef.current && canvasRef.current && recordingFolder) {
      console.log("hi2")
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      uploadPhoto(imageData);
    }
  };

  // Upload photo to the backend
  const uploadPhoto = async (imageData) => {
    try {
      const response = await fetch(serverAddress+'/upload', {
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
    console.log("done");
  };

  // Create a new folder
  const createFolder = async () => {
    if (!newFolderName) {
      alert('Please enter a folder name.');
      return;
    }
    try {
      const response = await fetch(serverAddress+'/create_folder', {
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
    <div id = "mainBody">
      <h1>Check or Add/Delete Laundry Machines</h1>
      <div className='main-container2'>
        {!isCameraStarted && (
          <button className='button' onClick={startCamera}>Start Camera
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z"/></svg>
          </button>
        )}
        {isCameraStarted && (<motion.div
          initial={{rotate: 180, scale:0}}
          exit={{rotate:180, scale: 0}}
          animate={{rotate: 0, scale: 1}}
          transition={{duration: 1, ease: "backInOut"}}
        >
        <video id = "videoScreen" ref={videoRef} autoPlay width="640" height="480" style={{ display: isCameraStarted ? 'block' : 'none' }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
        </motion.div>)}
      </div>
      <div className='main-container2'>
      <div>
        <h2>Select Laundry Machine to Record For: </h2>
        <select 
        onChange={(e) => setRecordingFolder(e.target.value)} value={recordingFolder}
        style={{ marginLeft: "10px", fontSize: "16px", padding: "5px" , width: "65%"}}>
          <option value="">--Select Laundry Machine--</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder}>{folder}</option>
          ))}
        </select>
      </div>

      <button onClick={toggleRecording} className={`button ${isRecording ? "recording" : "not-recording"}`}>
        {isRecording ? 'Stop Recording ' : 'Start Recording '}
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
      </button>
      </div>
      <div>
        <h2> View Stream for Laundry Machine: {selectedFolder} </h2>
        <select 
        onChange={handleDisplayFolderChange} value={selectedFolder}
        style={{ marginLeft: "10px", fontSize: "16px", padding: "5px", width: "65%" }}> 
          <option value="">--Select Laundry Machine--</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder}>{folder}</option>
          ))}
        </select>
        <div className='main-container2'>
          {photos.map((photo, index) => (
            <img id = "videoScreen" key={index} src={photo} alt={`Captured ${index}`} style={{ margin: '5px' }} />
          ))}
        </div>
      </div>

      <div className='main-container2'>
        <h2>Add New Laundry Machine: </h2>
        <input 
          type="text" 
          className='textbox'
          value={newFolderName} 
          onChange={(e) => setNewFolderName(e.target.value)} 
          placeholder="Choose Laundry Machine Name" 
        />
        <button className='button' onClick={createFolder}>Create Laundry Machine
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        </button>
      </div>
      <DeleteFolder />
    </div>
  );
};

export default BasicSettings;
