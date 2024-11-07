// src/App.js
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminApp from './AdminApp';
import Login from './components/Login/Login';
import StaffApp from './StaffApp';
import StudentApp from './StudentApp';
import "./App.css";

const MainApp = () => {
  const { role } = useAuth();

  return (
    <div>
      {role === null ? (
        <Login />
      ) : role === 'admin' ? (
        <AdminApp />
      ) : role === 'student' ? (
        <StudentApp />
      ) : (
        <StaffApp />
      )}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;
