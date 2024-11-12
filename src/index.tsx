// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure this is correct
import 'antd/dist/reset.css'; // Make sure this path is correct

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
