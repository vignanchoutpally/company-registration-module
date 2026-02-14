import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import toast from 'react-hot-toast';
import { FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    companyName: '',
    registrationNumber: '',
    taxId: '',
    
    // Step 2: Contact Information
    phoneNumber: '',
    email: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    
    // Step 3: Business Details
    industry: '',
    businessType: '',
    numberOfEmployees: '',
    foundedYear: '',
    
    // Step 4: Legal & Compliance
    legalStructure: '',
    registrationDate: '',
    complianceStatus: '',
    licenses: [],
    
    // Step 5: Additional Information
    description: '',
    services: [],
    certifications: [],
  });

  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      // Save current step data
      setLoading(true);
      try {
        await api.put('/company/registration-step', {
          step: currentStep,
          data: getStepData(currentStep),
        });
        setCurrentStep(currentStep + 1);
      } catch (error) {
        toast.error('Failed to save step data');
      } finally {
        setLoading(false);
      }
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put('/company/registration-step', {
        step: 5,
        data: getStepData(5),
      });
      toast.success('Registration completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const getStepData = (step) => {
    switch (step) {
      case 1:
        return {
          companyName: formData.companyName,
          registrationNumber: formData.registrationNumber,
          taxId: formData.taxId,
        };
      case 2:
        return {
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          website: formData.website,
          address: formData.address,
        };
      case 3:
        return {
          industry: formData.industry,
          businessType: formData.businessType,
          numberOfEmployees: formData.numberOfEmployees,
          foundedYear: formData.foundedYear,
        };
      case 4:
        return {
          legalStructure: formData.legalStructure,
          registrationDate: formData.registrationDate,
          complianceStatus: formData.complianceStatus,
          licenses: formData.licenses,
        };
      case 5:
        return {
          description: formData.description,
          services: formData.services,
          certifications: formData.certifications,
        };
      default:
        return {};
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Registration Number</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => updateFormData('registrationNumber', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tax ID</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => updateFormData('taxId', e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => updateFormData('address.street', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => updateFormData('address.city', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => updateFormData('address.state', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => updateFormData('address.zipCode', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => updateFormData('address.country', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2>Business Details</h2>
            <div className="form-group">
              <label>Industry *</label>
              <select
                value={formData.industry}
                onChange={(e) => updateFormData('industry', e.target.value)}
                required
              >
                <option value="">Select Industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Business Type</label>
              <select
                value={formData.businessType}
                onChange={(e) => updateFormData('businessType', e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="sole-proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Number of Employees</label>
                <input
                  type="number"
                  value={formData.numberOfEmployees}
                  onChange={(e) => updateFormData('numberOfEmployees', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Founded Year</label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => updateFormData('foundedYear', e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h2>Legal & Compliance</h2>
            <div className="form-group">
              <label>Legal Structure</label>
              <select
                value={formData.legalStructure}
                onChange={(e) => updateFormData('legalStructure', e.target.value)}
              >
                <option value="">Select Structure</option>
                <option value="private-limited">Private Limited</option>
                <option value="public-limited">Public Limited</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
              </select>
            </div>
            <div className="form-group">
              <label>Registration Date</label>
              <input
                type="date"
                value={formData.registrationDate}
                onChange={(e) => updateFormData('registrationDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Compliance Status</label>
              <select
                value={formData.complianceStatus}
                onChange={(e) => updateFormData('complianceStatus', e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="compliant">Compliant</option>
                <option value="pending">Pending</option>
                <option value="non-compliant">Non-Compliant</option>
              </select>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-content">
            <h2>Additional Information</h2>
            <div className="form-group">
              <label>Company Description</label>
              <textarea
                rows="5"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe your company..."
              />
            </div>
            <div className="form-group">
              <label>Services (comma-separated)</label>
              <input
                type="text"
                value={formData.services.join(', ')}
                onChange={(e) => updateFormData('services', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Service 1, Service 2, Service 3"
              />
            </div>
            <div className="form-group">
              <label>Certifications (comma-separated)</label>
              <input
                type="text"
                value={formData.certifications.join(', ')}
                onChange={(e) => updateFormData('certifications', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Certification 1, Certification 2"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="registration-form-container">
      <div className="registration-form">
        <div className="step-indicator">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className={`step-item ${step === currentStep ? 'active' : step < currentStep ? 'completed' : ''}`}>
              <div className="step-number">{step < currentStep ? <FiCheck /> : step}</div>
              <div className="step-label">Step {step}</div>
            </div>
          ))}
        </div>

        <div className="form-wrapper">
          {renderStepContent()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevious} className="btn btn-secondary">
                <FiArrowLeft /> Previous
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              disabled={loading}
            >
              {currentStep === 5 ? 'Complete Registration' : 'Next'} <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
