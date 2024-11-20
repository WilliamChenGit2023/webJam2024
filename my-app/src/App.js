import React, { useEffect, useRef, useState } from 'react';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null); // To store backend status
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
        setPhotos(data.images); // Set the photos state with the images
      }
    } catch (error) {
      console.error('Error fetching uploaded images:', error);
    }
  };

  useEffect(() => {
    checkBackend();  // Check backend when the component is mounted
    fetchUploadedImages(); // Fetch the list of uploaded images

    // Get the camera feed
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(error => console.log(error));

    // Take photo every 2 seconds
    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/jpeg');

        // Upload the photo to your server
        uploadPhoto(imageData);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const uploadPhoto = async (imageData) => {
    try {
      // Send the photo to the backend
      const response = await fetch('https://10.12.141.7:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the list of photos by fetching the uploaded images again
        fetchUploadedImages();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <div>
      <h1>Automatic Photo Capture</h1>

      {/* Display backend status */}
      <div>
        <h2>Backend Status</h2>
        <p>{backendStatus ? backendStatus : 'Checking backend...'}</p>
      </div>

      <video ref={videoRef} autoPlay width="320" height="240" />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
      
      <div>
        <h2>Captured Photos</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {photos.map((photo, index) => (
            <img key={index} src={`https://10.12.141.7:5000${photo}`} alt={`Captured ${index}`} style={{ width: '100px', height: 'auto', margin: '5px' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
