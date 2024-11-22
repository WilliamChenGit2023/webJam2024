import React, { useState, useEffect } from "react";
import axios from "axios";
import config from './config';
import './Webtest copy 2.css'

const FolderStatusTable = () => {
  const serverAddress = config.serverAddress;
  const [folders, setFolders] = useState([]); // List of folders and their statuses
  const [error, setError] = useState(""); // Error message if any

  // Function to fetch folder statuses
  const fetchFolderStatuses = () => {
    axios
      .get(serverAddress + "/get_folders")
      .then((response) => {
        const folderNames = response.data.folders;
        // Fetch the status for each folder
        const statusPromises = folderNames.map((folderName) =>
          axios
            .get(serverAddress + "/get_status", {
              params: { folder_name: folderName },
            })
            .then((statusResponse) => ({
              folderName,
              status: statusResponse.data.status === "true" ? "true" : "false",
            }))
            .catch((err) => ({
              folderName,
              status: "error",
            }))
        );

        // Wait for all status fetches to complete
        Promise.all(statusPromises)
          .then((folderStatusData) => {
            setFolders(folderStatusData);
            setError(""); // Clear any previous errors
          })
          .catch((err) => {
            console.error(err);
            setError("Failed to fetch folder statuses.");
          });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch folders.");
      });
  };

  useEffect(() => {
    fetchFolderStatuses(); // Initial fetch
    const intervalId = setInterval(fetchFolderStatuses, 30000); // Refresh every 30 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Georgia (serif)" }}>
      <h1>Folder Status Table</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Folder Name</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {folders.map((folder) => (
            <tr key={folder.folderName}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {folder.folderName}
              </td>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  backgroundColor: folder.status === "true" ? "green" : folder.status === "false" ? "red" : "gray",
                  color: "white",
                }}
              >
                {folder.status === "true" ? "✅ True" : folder.status === "false" ? "❌ False" : "Error"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FolderStatusTable;
