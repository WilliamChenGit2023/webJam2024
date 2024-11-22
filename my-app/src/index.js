
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WebBottom from './WebBottom';
import WebTab from './WebTabs';
import ImageUpload from './test';
import I2 from './test copy';
import Status from './Webtest copy';


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
    <WebTab />
    <Status />
    <WebBottom />
  </React.StrictMode>
); 
 