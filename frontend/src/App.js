import React, { useContext, useEffect, useState } from 'react';
import './styles/App.css';
import AppRouter from './components/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';


function App(){

  return (
    <AuthProvider>
      <UserProvider>
        <AppRouter/>
      </UserProvider>
    </AuthProvider>
    
  );
}

export default App;
