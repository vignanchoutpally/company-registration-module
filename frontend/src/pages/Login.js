import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiPhone } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, requestOTP, verifyOTP } = useAuth();
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Email/Password form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // SMS OTP form
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestOTP(phoneNumber);
      setOtpSent(true);
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(phoneNumber, otp);
      // After OTP verification, you might want to create/login user
      // For now, navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Company Login</h1>
        <p>Welcome back! Please login to your account.</p>

        <div className="auth-tabs">
          <button
            className={isEmailLogin ? 'active' : ''}
            onClick={() => {
              setIsEmailLogin(true);
              setOtpSent(false);
            }}
          >
            <FiMail /> Email Login
          </button>
          <button
            className={!isEmailLogin ? 'active' : ''}
            onClick={() => {
              setIsEmailLogin(false);
              setOtpSent(false);
            }}
          >
            <FiPhone /> SMS OTP
          </button>
        </div>

        {isEmailLogin ? (
          <form onSubmit={handleEmailLogin} className="auth-form">
            <div className="form-group">
              <label>
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="company@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <FiLock /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP} className="auth-form">
            {!otpSent ? (
              <>
                <div className="form-group">
                  <label>
                    <FiPhone /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                  <small>OTP sent to {phoneNumber}</small>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOtpSent(false)}
                >
                  Change Number
                </button>
              </>
            )}
          </form>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
