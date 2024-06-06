import React, { useState, useEffect } from 'react';

export const UserAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userKitchen, setUserKitchen] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
      const loggedInStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedInStatus === 'true');
      const storedEmail = localStorage.getItem('email');
      setUserEmail(storedEmail || '');
      setUserKitchen(localStorage.getItem('kitchen') || '');
  }, []);

  // const handleLogin = (kitchen) => {
  //     setIsLoggedIn(true);
  //     localStorage.setItem('isLoggedIn', 'true');
  //     setUserKitchen(kitchen);
  //     localStorage.setItem('userKitchen', kitchen);
  // };

  const handleLogout = () => {
      setIsLoggedIn(false);
      localStorage.setItem('isLoggedIn', 'false');
      setUserKitchen('');
      localStorage.removeItem('kitchen');
  };

  return { isLoggedIn, userKitchen, userEmail, handleLogout };
};
