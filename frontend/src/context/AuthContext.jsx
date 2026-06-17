import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axiosClient.get('/auth/me');
        setTeacher(data.data);
      } catch (error) {
        console.error('Failed to fetch teacher profile', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axiosClient.post('/auth/login', { email, password });
      localStorage.setItem('token', data.data.token);
      setTeacher(data.data);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, subject) => {
    try {
      const { data } = await axiosClient.post('/auth/register', { name, email, password, subject });
      localStorage.setItem('token', data.data.token);
      setTeacher(data.data);
      toast.success('Registered successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setTeacher(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ teacher, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
