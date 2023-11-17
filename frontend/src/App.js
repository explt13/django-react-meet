import React, { useContext, useEffect, useState } from 'react';
import './styles/App.css';
import AppRouter from './components/AppRouter';
import { AuthProvider } from './context/AuthContext';
import UserContext, { UserProvider } from './context/UserContext';

function App(){

  return (
    <UserProvider>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;
