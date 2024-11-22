
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Webtest from './Webtest';
import App from './App';
import WebBottom from './WebBottom';
import ImageUpload from './test';
import I2 from './test copy';
import Status from './Webtest copy';


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
    <Webtest />
    <ImageUpload />
    <I2 />
    <WebBottom />
    <Status />
  </React.StrictMode>
);
