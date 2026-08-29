import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify & refresh user details from backend
          const { data } = await api.get('/auth/me');
          if (data) {
            const updatedUser = { ...data, token };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          }
        } catch (err) {
          console.warn('Session verification failed:', err?.response?.data?.message || err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, isAdmin, isStudent }}
    >
      {children}
    </AuthContext.Provider>
  );
};
