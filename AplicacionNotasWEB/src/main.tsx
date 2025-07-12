import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './contexts/UserContext';
import { PapeleraProvider } from './contexts/PapeleraContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <PapeleraProvider>
        <App />
      </PapeleraProvider>
    </UserProvider>
  </React.StrictMode>
);
