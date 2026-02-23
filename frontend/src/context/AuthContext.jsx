import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5005/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('admin_session');
    if (session) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('admin_session', JSON.stringify({
          username: response.data.username,
          loginTime: Date.now()
        }));
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      return { success: false, error: 'Hiba történt a bejelentkezés során' };
    }
    return { success: false, error: 'Hibás felhasználónév vagy jelszó' };
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
