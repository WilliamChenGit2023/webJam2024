
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Webtest from './Webtest';
import App from './App';
import WebBottom from './WebBottom';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
    <Webtest />
    <WebBottom />
  </React.StrictMode>
);
