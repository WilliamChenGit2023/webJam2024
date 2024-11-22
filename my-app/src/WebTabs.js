import "./WebTabs.css"
import React, { useState } from "react";
import CoordinateSelect from './CoordinateSelect';
import I2 from './StatusCheck';
import BasicSettings from './BasicSettings';
import CheckBackendStatus from "./BackendStatus";


function WebTab() {
    // State to track the currently active tab
    const [activeTab, setActiveTab] = useState("Content1");
  
    // Function to handle tab switching
    const handleTabClick = (tabName) => {
      setActiveTab(tabName);
    };
  
    return (
      <div>
        <br></br>
        <div className="tab">
          <button
            className={`links ${activeTab === "Content1" ? "active" : ""}`}
            onClick={() => handleTabClick("Content1")}>
            Laundry Machines
          </button>
          <button
            className={`links ${activeTab === "Content2" ? "active" : ""}`}
            onClick={() => handleTabClick("Content2")}>
            Coordinates Selector
          </button>
          <button
            className={`links ${activeTab === "Content3" ? "active" : ""}`}
            onClick={() => handleTabClick("Content3")}>
            Coordinates Viewer
          </button>
          <button
            className={`links ${activeTab === "Content4" ? "active" : ""}`}
            onClick={() => handleTabClick("Content4")}>
            Backend Status
          </button>
        </div>
        <div
          id="Content1"
          className={`tabContent ${activeTab === "Content1" ? "active" : ""}`}>
          <BasicSettings />
        </div>
        <div
          id="Content2"
          className={`tabContent ${activeTab === "Content2" ? "active" : ""}`}>
          <CoordinateSelect />
        </div>
        <div
          id="Content3"
          className={`tabContent ${activeTab === "Content3" ? "active" : ""}`}>
          <I2 />
        </div>
        <div
          id="Content4"
          className={`tabContent ${activeTab === "Content4" ? "active" : ""}`}>
          <CheckBackendStatus />
        </div>
      </div>
    );
  }

export default WebTab