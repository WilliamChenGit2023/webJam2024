import { useState, useEffect } from "react";
import config from './config';

function CheckBackendStatus(){
    const serverAddress = config.serverAddress;
    const [backendStatus, setBackendStatus] = useState(null);
    const checkBackend = async () => {
        try {
          const response = await fetch(serverAddress+'/ping');
          const data = await response.json();
          if (data.status === 'success') {
            setBackendStatus(`Connected: ${data.message}, Number: ${data.number},Server: ${serverAddress}`);
          } else {
            setBackendStatus('Failed to connect to backend,Server: '+serverAddress);
          }
        } catch (error) {
          setBackendStatus('Error connecting to backend:');
          console.error('Error checking backend:', error);
        }
      };
      useEffect(() => {
        checkBackend();
      }, []);
      return(
        <div>
        <h2>Backend Status</h2>
        <p>{backendStatus ? backendStatus : 'Checking backend...'}</p>
      </div>
      )
}

export default CheckBackendStatus