import React from 'react';
import { FiAlertCircle, FiExternalLink } from 'react-icons/fi';
import './FirebaseSetupWarning.css';

const FirebaseSetupWarning = () => {
  return (
    <div className="firebase-warning-overlay">
      <div className="firebase-warning-card">
        <FiAlertCircle className="warning-icon" />
        <h2>Firebase Configuration Required</h2>
        <p>To use this application, you need to configure Firebase credentials.</p>
        
        <div className="setup-steps">
          <h3>Quick Setup (5 minutes):</h3>
          <ol>
            <li>
              Go to{' '}
              <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                Firebase Console <FiExternalLink />
              </a>
            </li>
            <li>Create a new project or select existing one</li>
            <li>Enable Authentication → Email/Password</li>
            <li>Create Firestore Database (test mode)</li>
            <li>
              Get Web App Config:
              <ul>
                <li>Click ⚙️ Settings → Project Settings</li>
                <li>Scroll to "Your apps" → Click web icon `&lt;/&gt;`</li>
                <li>Copy the config values</li>
              </ul>
            </li>
            <li>
              Update <code>frontend/.env</code> with your Firebase config
            </li>
            <li>Restart the frontend server</li>
          </ol>
        </div>

        <div className="env-example">
          <p><strong>Example .env file:</strong></p>
          <pre>
{`REACT_APP_FIREBASE_API_KEY=AIzaSy...your-actual-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef`}
          </pre>
        </div>

        <div className="help-links">
          <p>
            📖 See <code>FIREBASE_SETUP.md</code> for detailed instructions
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupWarning;
