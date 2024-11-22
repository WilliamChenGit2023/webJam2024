import './App.css';
import { useState } from 'react';
import { motion, AnimatePresence, spring } from "framer-motion";

function App() {
  return (
    <div className='main-container'>
    <div className="header" /*onLoad = {MyVideoProgram()}*/>
      <motion.div 
      animate={{y: 100, scale: 1}}
      initial={{y: '-10vw', scale: 0}}
      transition={{type: "spring"}}>
        Washer Vision
      </motion.div>
    </div>
    </div>
  );
}
/*
function Record(){
  const [isRecording, setIsRecording] = useState(false);

  return(
  <div className='main-container'>
    <motion.button
      onClick={() => setIsRecording(!isRecording)}
      className={`button ${isRecording ? "recording" : "not-recording"}`}
      layout
      transition={{type: spring}}
    >
      {isRecording ? "Stop" : "Record"}
    </motion.button>
    <AnimatePresence mode="wait">
      {isRecording && (<motion.div id = "video-container"
        initial={{rotate: 180, scale:0}}
        exit={{rotate:180, scale: 0}}
        animate={{rotate: 0, scale: 1}}
        transition={{duration: 1, ease: "backInOut"}}
      >
        <h1>This is a Webcam thing</h1>
        <video autoplay = "true" id ="videoElement"></video>
      </motion.div>)}
    </AnimatePresence>
  </div>
  )
}
function MyVideoProgram(){
  let video = document.getElementById("videoElement");
  
  if (navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then( function (stream){
      video.srcObject = stream;
    })
    .catch (function(error){
      // :) error good try again buddy
      MyVideoProgram();
    })
  }
  else{
    console.log("The media is not supported")
  }
} */
export default App;
