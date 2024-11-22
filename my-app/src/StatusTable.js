import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config";
import "./Webtest copy 2.css";

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
            .catch(() => ({
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
          .catch(() => {
            setError("Failed to fetch folder statuses.");
          });
      })
      .catch(() => {
        setError("Failed to fetch folders.");
      });
  };

  useEffect(() => {
    fetchFolderStatuses(); // Initial fetch
    const intervalId = setInterval(fetchFolderStatuses, 2000); // Refresh every 30 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id = "mainBody">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Laundry Machine Status Table
      </h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "0 auto",
          fontSize: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Machine Name
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {folders.map((folder, index) => (
            <tr
              key={folder.folderName}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
              }}
            >
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {folder.folderName}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  backgroundColor:
                    folder.status === "true"
                      ? "#4caf50"
                      : folder.status === "false"
                      ? "#f44336"
                      : "#9e9e9e",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {folder.status === "true"
                  ? "Laundry Machine Available"
                  : folder.status === "false"
                  ? "Laundry Machine In Use"
                  : "Error"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FolderStatusTable;
