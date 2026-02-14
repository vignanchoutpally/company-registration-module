import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { FiSettings, FiLogOut, FiCheckCircle, FiClock, FiEdit } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    fetchCompanyData();
    fetchRegistrationStatus();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await api.get('/company/profile');
      setCompany(response.data.company);
    } catch (error) {
      console.error('Failed to fetch company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationStatus = async () => {
    try {
      const response = await api.get('/company/registration-status');
      setRegistrationStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch registration status:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const isRegistrationComplete = registrationStatus?.registrationStatus === 'completed';
  const currentStep = registrationStatus?.registrationStep || 1;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Company Portal</h2>
        </div>
        <div className="nav-actions">
          <button onClick={() => navigate('/settings')} className="nav-btn">
            <FiSettings /> Settings
          </button>
          <button onClick={handleLogout} className="nav-btn">
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {company?.companyName || 'Company'}!</h1>
          <p>Manage your company profile and registration details</p>
        </div>

        {!isRegistrationComplete && (
          <div className="registration-banner">
            <div className="banner-content">
              <FiClock className="banner-icon" />
              <div>
                <h3>Complete Your Registration</h3>
                <p>You're on step {currentStep} of 5. Complete your registration to access all features.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/registration-form')}
              className="btn btn-primary"
            >
              Continue Registration
            </button>
          </div>
        )}

        {isRegistrationComplete && (
          <div className="success-banner">
            <FiCheckCircle className="success-icon" />
            <div>
              <h3>Registration Complete!</h3>
              <p>Your company profile has been successfully registered and verified.</p>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Company Information</h3>
            <div className="info-item">
              <span className="info-label">Company Name:</span>
              <span className="info-value">{company?.companyName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{company?.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{company?.phoneNumber || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Industry:</span>
              <span className="info-value">{company?.industry || 'N/A'}</span>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="btn btn-secondary btn-small"
            >
              <FiEdit /> Edit Profile
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Registration Status</h3>
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className={`status-badge ${registrationStatus?.registrationStatus || 'pending'}`}>
                {registrationStatus?.registrationStatus || 'Pending'}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Current Step:</span>
              <span className="status-value">{currentStep} / 5</span>
            </div>
            {registrationStatus?.completedSteps && registrationStatus.completedSteps.length > 0 && (
              <div className="status-item">
                <span className="status-label">Completed Steps:</span>
                <div className="steps-list">
                  {registrationStatus.completedSteps.map((step) => (
                    <span key={step} className="step-badge">Step {step}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div className="actions-list">
              <button
                onClick={() => navigate('/settings')}
                className="action-btn"
              >
                <FiSettings /> Update Profile
              </button>
              {!isRegistrationComplete && (
                <button
                  onClick={() => navigate('/registration-form')}
                  className="action-btn"
                >
                  <FiEdit /> Complete Registration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
