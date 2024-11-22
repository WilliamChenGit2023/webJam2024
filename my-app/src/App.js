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
    <div className='img'>
    <img src = {require('./art-assets/laundry-machine.png')} width = "500" height = "500"></img>
    </div>
    </div>
  );
}

export default App;
