import React, { useEffect, useRef, useState } from 'react';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false); // Track if the camera is started
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

  // Function to fetch the list of uploaded images
  const fetchUploadedImages = async () => {
    try {
      const response = await fetch('https://10.12.141.7:5000/uploads');
      const data = await response.json();
      if (data.images) {
        const updatedImages = data.images.map(imageUrl => `https://10.12.141.7:5000${imageUrl}`);
        setPhotos(updatedImages);
      }
    } catch (error) {
      console.error('Error fetching uploaded images:', error);
    }
  };

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraStarted(true); // Set to true once the camera starts
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
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (data.success) {
        fetchUploadedImages(); // Fetch updated photos
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    setIsRecording(prevState => !prevState); // Toggle recording state
  };

  useEffect(() => {
    checkBackend(); // Check backend on mount
    fetchUploadedImages(); // Fetch uploaded images on mount

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchUploadedImages();
    }, 5000);

    // Cleanup interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Only start capturing when recording is enabled
    const interval = isRecording ? setInterval(capturePhoto, 2000) : null;

    // Cleanup interval when recording stops
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div>
      <h1>Manual Photo Capture</h1>

      {/* Display backend status */}
      <div>
        <h2>Backend Status</h2>
        <p>{backendStatus ? backendStatus : 'Checking backend...'}</p>
      </div>

      {/* Button to start camera */}
      {!isCameraStarted && (
        <button onClick={startCamera}>Start Camera</button>
      )}

      {/* Video element for the camera feed */}
      <video ref={videoRef} autoPlay width="320" height="240" style={{ display: isCameraStarted ? 'block' : 'none' }} />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />

      {/* Start/Stop Recording Button */}
      <button onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div>
        <h2>Captured Photos</h2>
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
