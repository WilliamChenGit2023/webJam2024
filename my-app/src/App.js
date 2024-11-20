import './App.css';
import { motion } from "framer-motion";

function App() {
  return (
    <div className="header">
      <motion.div 
      animate={{y: 100, scale: 1}}
      initial={{scale: 0}}
      transition={{type: "spring"}}>
        Washer Vision
      </motion.div>
      <PlaceHolder></PlaceHolder>
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

export default App;
