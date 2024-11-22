import "./WebTabs.css"
import React, { useState } from "react";
import FolderStatusTable from "./StatusTable";


function UserWebTab() {
    // State to track the currently active tab
    const [activeTab, setActiveTab] = useState("Content1");
  
    // Function to handle tab switching
    const handleTabClick = (tabName) => {
      setActiveTab(tabName);
    };
  
    return (
      <div>
        <div className="tab">
          <button
            className={`links ${activeTab === "Content1" ? "active" : ""}`}
            onClick={() => handleTabClick("Content1")}>
            Washing Machine Status
          </button>
        </div>
        <div
          id="Content1"
          className={`tabContent ${activeTab === "Content1" ? "active" : ""}`}>
          <FolderStatusTable />
        </div>
      </div>
    );
  }

export default UserWebTab