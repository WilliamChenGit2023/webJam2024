---

# Washer Vision

A web-based solution for tracking washing machines and identifying the optimal time to do laundry.

---

## 📋 **Purpose**
This project was created to:
- Minimize waiting times for using washing machines in shared or public laundry facilities.
- Simplify life for users by providing real-time machine status updates.
- Potentially serve industries like laundromats to improve service efficiency and customer satisfaction.

Developed for the **2024 WebJam Event** at **UC Irvine** hosted by [ICSSC](https://studentcouncil.ics.uci.edu/).

---

## 🚀 **How to Use**
1. **Capture the Washing Machine Display:**
   - Use your device's camera (phone, tablet, or computer webcam) to record the washing machine's digital clock.
2. **Select Coordinates:**
   - Specify the coordinates of the washing machine’s digital clock display for accurate data processing.
3. **Monitor Status:**
   - Check the real-time status of the washing machines!

---

## 👨‍💻 **Credits**
Developers:
- Will Bao  
- Cody Chen  
- William Chen  
- Jianan Zhu  

Technologies:
- **Frontend:** [React](https://react.dev/)  
- **Backend:** Python (Flask)  
- **Image Processing:** OpenCV  

---

## 🖥️ **Features**

### **Frontend**
#### **1. Washing Machine Status**
- Displays real-time statuses of washing machines stored in the backend.

#### **2. Laundry Machine Management**
- Add or delete washing machine entries.
- Start recordings of washing machines using a camera.
- Select available washing machines for tracking.
- Add recordings for specific machine units.

#### **3. Coordinate Selector**
- Allows users to define the top-left and bottom-right corners of the washing machine display for detection.

#### **4. Coordinate Viewer**
- Displays the selected coordinate ranges for review.

---

### **Backend**
#### **1. Status Monitoring**
- Provides real-time updates on backend connection and machine statuses.

#### **2. Image Processing Algorithm**
- Utilizes Python’s OpenCV library to process images and detect content on the washing machine's panel.
- Determines if the washing machine is active or idle.
- Relevant files are located in:
  - `./flaskBackend/`
  - `./otherPython/` (for debugging purposes)

#### **3. Flask Server**
- The backend server (`server.py`) is located in the `./flaskBackend/` directory.
- Key functionalities:
  - Handles file uploads and downloads (folders, photos, coordinates, statuses).
  - Updates washing machine statuses every 2 seconds.

---

We hope this project makes laundry day easier for everyone! 😊
