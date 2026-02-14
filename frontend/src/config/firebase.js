import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase config is properly set
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
];

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName] || process.env[varName].includes('your-')
);

const isFirebaseConfigured = missingVars.length === 0;

// Initialize Firebase app (only if not already initialized)
let app;
if (isFirebaseConfigured) {
  try {
    // Check if Firebase app is already initialized
    const existingApps = getApps();
    if (existingApps.length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized successfully');
    } else {
      app = existingApps[0];
      console.log('✅ Using existing Firebase app');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.error('Firebase config:', {
      apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
    });
    app = null;
  }
} else {
  console.error('⚠️ Firebase configuration is missing or incomplete!');
  console.error('Missing or placeholder variables:', missingVars);
  app = null;
}

// Initialize Auth (only if app is initialized)
let auth;
if (app) {
  try {
    auth = getAuth(app);
  } catch (error) {
    console.error('❌ Firebase Auth initialization error:', error.message);
    auth = null;
  }
} else {
  auth = null;
}

export { auth, isFirebaseConfigured };
export default app;
