
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WebBottom from './WebBottom';
import WebTab from './WebTabs';
import UserWebTab from './UserWebTabs';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
    <UserWebTab />
    <WebTab />
    <WebBottom />
  </React.StrictMode>
); 
 