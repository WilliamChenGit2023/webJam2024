
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WebBottom from './WebBottom';
import WebTab from './WebTabs';
import DeleteFolder from './test copy 2';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
    <WebTab />
    <DeleteFolder />
    <WebBottom />
  </React.StrictMode>
); 
 