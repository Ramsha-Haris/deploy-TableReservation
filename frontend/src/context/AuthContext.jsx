import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    sessionStorage.setItem('user', JSON.stringify(userData)); // <- switched from localStorage
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', null, {
        withCredentials: true,
      });

      setUser(null);
      setIsLoggedIn(false);
      sessionStorage.removeItem('user'); // <- switched from localStorage
    } catch (err) {
      console.error('Logout failed', err);
    }
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
