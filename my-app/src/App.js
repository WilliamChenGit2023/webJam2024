import './App.css';
import { motion } from "framer-motion";

function App() {
  return (
    <div className="header">
      <motion.div 
      animate={{y: -100, scale: 1}}
      initial={{scale: 0}}
      transition={{type: "spring"}}>
        Washer Vision
      </motion.div>
    </div>
  );
}

export default App;
