
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Webtest from './Webtest';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Webtest />
  </React.StrictMode>
);
