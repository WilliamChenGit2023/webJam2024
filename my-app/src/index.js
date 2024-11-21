
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Webtest from './Webtest';
import App from './App';
import WebBottom from './WebBottom';
import ImageUpload from './test';


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
    <Webtest />
    <WebBottom />
    <ImageUpload />
  </React.StrictMode>
);
