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
      <PlaceHolder></PlaceHolder>
      <Record></Record>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <Credits></Credits>
    </div>
  );
}
function PlaceHolder(){
  return(
  <div id = "image_placeholder">
  <form action = "/action_page.php" enctype="multipart/form-data">
    <lable for = "myfile">Please Film the Washing Machine (please do not delete)</lable>
    <input
      type = "file"
      id = "environment"
      capture="environment"
      accept="Video/*"
    />
  </form>
  <br/>
  <form action = "/action_page.php" enctype="multipart/form-data">
    <lable for = "myfile">Please Take Pictures of the Washing Machine (please do not delete for now)</lable>
    <input
      type = "file"
      id = "environment"
      capture="environment"
      accept="Picture/*"
    />
  </form>
  <br/>
  </div>
  )
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
function Credits(){
  return(
    <div id = "ourCredits">
      <br></br>
      <p>
        This Website is Created for the Purpose of Webjam 2024
        and For the Purpose of Tracking Washing Machines
      </p>
      <p>
        Created by Will Bao, Cody Chen, William Chen, Jianan Zhu
      </p>
      <p>
        Programmed in React using Javascript and Python
      </p>
      <br></br>
    </div>
  )
}
export default App;
