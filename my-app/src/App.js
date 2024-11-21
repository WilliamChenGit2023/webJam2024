import './App.css';
import { motion } from "framer-motion";

function App() {
  return (
    <div>
    <div className="header" onLoad = {MyVideoProgram()}>
      <motion.div 
      animate={{y: 100, scale: 1}}
      initial={{y: '-10vw', scale: 0}}
      transition={{type: "spring"}}>
        Washer Vision
      </motion.div>
    </div>
    <div>
      <Record></Record>
    </div>
    <br></br>
    </div>
  );
}

function Record(){
  return(
  <div id = "container">
    <h1>This is a Webcam thing</h1>
    <video autoplay = "true" id ="videoElement"></video>
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
}
export default App;
