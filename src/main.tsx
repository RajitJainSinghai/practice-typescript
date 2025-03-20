import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { GymOwnerAuthProvider } from './contexts/GymOwnerAuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <GymOwnerAuthProvider>
        <App />
      </GymOwnerAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
