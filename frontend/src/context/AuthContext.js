import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import api from '../config/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const register = async (email, password, companyName) => {
    if (!isFirebaseConfigured || !auth) {
      toast.error('Firebase is not configured. Please set up Firebase credentials in your .env file.');
      throw new Error('Firebase not configured');
    }

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Register with backend
      const response = await api.post('/auth/register', {
        email,
        password,
        companyName,
      });

      const { token, companyId } = response.data;
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        companyId,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      toast.success('Registration successful!');
      return { success: true, companyId };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      // Check for network errors
      if (error.message === 'Network Error' || !error.response) {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';
        toast.error(`Cannot connect to server. Make sure the backend is running and reachable at ${apiUrl}.`);
      } else {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      toast.error('Firebase is not configured. Please set up Firebase credentials in your .env file.');
      throw new Error('Firebase not configured');
    }

    try {
      // Login with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Get backend token - send ID token for verification
      const response = await api.post('/auth/login', {
        email,
        idToken,
      }).catch(async (error) => {
        // If backend fails, try without ID token (fallback)
        console.warn('Login with ID token failed, trying fallback:', error.message);
        return api.post('/auth/login', {
          email,
          password, // Some backends might need this
        });
      });

      const { token, companyId } = response.data;
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        companyId,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      toast.success('Login successful!');
      return { success: true, companyId };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please register first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for network errors
      if (error.message === 'Network Error' || !error.response) {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';
        errorMessage = `Cannot connect to server. Make sure the backend is running and reachable at ${apiUrl}.`;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (auth) {
      auth.signOut();
    }
    toast.success('Logged out successfully');
  };

  const requestOTP = async (phoneNumber) => {
    try {
      const response = await api.post('/auth/request-otp', { phoneNumber });
      toast.success('OTP sent successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send OTP';
      toast.error(errorMessage);
      throw error;
    }
  };

  const verifyOTP = async (phoneNumber, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { phoneNumber, otp });
      toast.success('OTP verified successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Invalid OTP';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    requestOTP,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
