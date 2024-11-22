import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';

const DeleteFolder = () => {
  const serverAddress = config.serverAddress; // Fetch server address from config

  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Fetch folders when the component mounts
  useEffect(() => {
    axios.get(serverAddress + '/get_folders')
      .then((response) => {
        setFolders(response.data.folders);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch folders.');
      });
  }, []);

  // Handle folder selection
  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
  };

  // Handle delete folder action
  const handleDeleteFolder = async () => {
    if (!selectedFolder) {
      alert('Please select a folder to delete');
      return;
    }

    try {
      const response = await axios.post(serverAddress + '/delete_folder', {
        folder_name: selectedFolder,
      });

      setStatus(response.data.message); // Set status from server response

      // Re-fetch folders after deletion
      const updatedFolders = await axios.get(serverAddress + '/get_folders');
      setFolders(updatedFolders.data.folders);
      setSelectedFolder(''); // Reset folder selection
    } catch (err) {
      console.error('Error deleting folder:', err);
      setStatus('');
      setError('Error deleting folder');
    }
  };

  return (
    <div className='main-container2'>
      <h2>Delete A Laundry Machine: </h2>

      {/* Status message */}
      {status && <p>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      <select
        id="folder-select"
        value={selectedFolder}
        onChange={handleFolderChange}
        style={{ marginLeft: "10px", fontSize: "16px", padding: "5px" }}
      >
        <option value="">--Select Laundry Machine--</option>
        {folders.map((folder) => (
          <option key={folder} value={folder}>
            {folder}
          </option>
        ))}
      </select>

      {/* Button to delete selected folder */}
      <button
        onClick={handleDeleteFolder}
        className='button'
        style={{
          backgroundColor: '#ff6347',
        }}
      >
        Delete Laundry Machine
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </button>
    </div>
  );
};

export default DeleteFolder;
