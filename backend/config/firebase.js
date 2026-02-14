import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Preferred: use GOOGLE_APPLICATION_CREDENTIALS pointing to a service-account JSON
const hasGoogleAppCreds = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Fallback: explicit env vars (not recommended to paste private key in .env)
const hasExplicitCreds =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PROJECT_ID !== 'your-project-id' &&
  process.env.FIREBASE_PRIVATE_KEY &&
  !process.env.FIREBASE_PRIVATE_KEY.includes('Your private key') &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_CLIENT_EMAIL !== 'firebase-adminsdk@your-project.iam.gserviceaccount.com';

const isFirebaseAdminConfigured = hasGoogleAppCreds || hasExplicitCreds;

// Initialize Firebase Admin SDK
if (!admin.apps.length && isFirebaseAdminConfigured) {
  try {
    const credential = hasGoogleAppCreds
      ? admin.credential.applicationDefault()
      : admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        });

    admin.initializeApp({ credential });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    console.warn('⚠️ Backend will use fallback authentication methods');
  }
} else if (!isFirebaseAdminConfigured) {
  console.warn('⚠️ Firebase Admin SDK not configured - using fallback authentication');
  console.warn('⚠️ To enable full functionality, configure Firebase Admin SDK in backend/.env');
}

// Export auth and db with error handling
let auth, db;

if (admin.apps.length > 0) {
  try {
    auth = admin.auth();
    db = admin.firestore();
  } catch (error) {
    console.error('Error accessing Firebase services:', error.message);
    auth = null;
    db = null;
  }
} else {
  auth = null;
  db = null;
}

export { auth, db, isFirebaseAdminConfigured };
export default admin;
