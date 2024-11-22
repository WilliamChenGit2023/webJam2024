import React, { useState, useEffect } from "react";
import axios from "axios";
import config from './config';

const Status = () => {
  const serverAddress = config.serverAddress;
  const [folders, setFolders] = useState([]); // List of folders
  const [selectedFolder, setSelectedFolder] = useState(""); // Selected folder
  const [status, setStatus] = useState(""); // Status of selected folder
  const [error, setError] = useState(""); // Error message, if any

  // Fetch list of folders on component mount
  useEffect(() => {
    axios
      .get(serverAddress + "/get_folders")
      .then((response) => {
        setFolders(response.data.folders);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch folders.");
      });
  }, []);

  // Fetch status for the selected folder
  const fetchStatus = (folder) => {
    if (!folder) return;

    axios
      .get(serverAddress + "/get_status", {
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

  // Handle folder selection
  const handleFolderChange = (e) => {
    const folder = e.target.value;
    setSelectedFolder(folder);
    fetchStatus(folder);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Folder Status Checker</h1>
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
          <p>
            <strong>Selected Folder:</strong> {selectedFolder}
          </p>
          {status && (
            <p>
              <strong>Status:</strong> {status === "true" ? "✅ True" : "❌ False"}
            </p>
          )}
          {error && (
            <p style={{ color: "red" }}>
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Status;
