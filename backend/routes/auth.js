import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db, isFirebaseAdminConfigured } from '../config/firebase.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Register Company with Email/Password
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('companyName').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      if (!db || !auth) {
        return res.status(503).json({
          error: 'Backend Firebase Admin SDK is not configured',
          hint:
            'Download a Firebase service account JSON and set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in backend/.env, then restart the backend.',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, companyName } = req.body;

      // Check if user already exists
      try {
        await auth.getUserByEmail(email);
        return res.status(400).json({ error: 'Email already registered' });
      } catch (error) {
        // User doesn't exist, continue
      }

      // Create Firebase user
      const userRecord = await auth.createUser({
        email,
        password,
        emailVerified: false,
      });

      // Create company document
      const companyRef = db.collection('companies').doc();
      const companyData = {
        companyId: companyRef.id,
        companyName,
        email,
        registrationStatus: 'pending', // pending, in_progress, completed
        registrationStep: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await companyRef.set(companyData);

      // Link company to user
      await auth.setCustomUserClaims(userRecord.uid, {
        companyId: companyRef.id,
      });

      // Generate JWT token
      const token = generateToken({
        uid: userRecord.uid,
        email: userRecord.email,
        companyId: companyRef.id,
      });

      res.status(201).json({
        message: 'Company registered successfully',
        token,
        companyId: companyRef.id,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  }
);

// Login with Email/Password
// Note: This endpoint expects the frontend to authenticate with Firebase first
// and send the Firebase ID token. For now, we'll use email to find the user.
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').optional(),
    body('idToken').optional(), // Firebase ID token from client
  ],
  async (req, res) => {
    try {
      if (!db) {
        return res.status(503).json({
          error: 'Backend database is not available (Firebase Admin SDK not configured)',
          hint:
            'Configure Firebase Admin credentials in backend/.env so the server can access Firestore, then restart the backend.',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, idToken } = req.body;

      let userRecord;
      let uid;

      // If ID token is provided, verify it with Firebase Admin SDK
      if (idToken && auth && isFirebaseAdminConfigured) {
        try {
          const decodedToken = await auth.verifyIdToken(idToken);
          uid = decodedToken.uid;
          userRecord = await auth.getUser(uid);
        } catch (error) {
          console.error('ID token verification error:', error);
          return res.status(401).json({ error: 'Invalid or expired token' });
        }
      } else if (auth && isFirebaseAdminConfigured) {
        // Fallback: Get user by email (works if Firebase Admin SDK is configured)
        try {
          userRecord = await auth.getUserByEmail(email);
          uid = userRecord.uid;
        } catch (error) {
          console.error('Get user by email error:', error);
          // Continue to fallback method below
        }
      }
      
      // Fallback: If Firebase Admin SDK is not configured, find company directly
      // Frontend Firebase Client SDK already verified the password
      if (!uid && db) {
        const companiesSnapshot = await db
          .collection('companies')
          .where('email', '==', email)
          .limit(1)
          .get();

        if (companiesSnapshot.empty) {
          return res.status(404).json({ error: 'Company not found. Please register first.' });
        }

        const companyData = companiesSnapshot.docs[0].data();
        
        // Generate token (frontend Firebase auth already verified password)
        // Use email as UID since we don't have Firebase Admin SDK access
        uid = `firebase-${email}`;
        
        const token = generateToken({
          uid: uid,
          email: email,
          companyId: companyData.companyId,
        });

        return res.json({
          message: 'Login successful',
          token,
          companyId: companyData.companyId,
          user: {
            uid: uid,
            email: email,
          },
        });
      }
      
      // Get or create company data
      let companyData;
      const companiesSnapshot = await db
        .collection('companies')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (companiesSnapshot.empty) {
        // If the user exists in Firebase Auth but no company doc was written
        // (e.g., Firestore was disabled during initial registration),
        // create a minimal company record now so the user can proceed.
        const companyRef = db.collection('companies').doc();
        companyData = {
          companyId: companyRef.id,
          companyName: email?.split('@')[0] || 'Company',
          email,
          registrationStatus: 'pending',
          registrationStep: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await companyRef.set(companyData);
      } else {
        companyData = companiesSnapshot.docs[0].data();
      }

      // Generate JWT token
      const token = generateToken({
        uid: uid,
        email: userRecord.email,
        companyId: companyData.companyId,
      });

      res.json({
        message: 'Login successful',
        token,
        companyId: companyData.companyId,
        user: {
          uid: uid,
          email: userRecord.email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed', 
        details: error.message,
        hint: 'Make sure Firebase Admin SDK is configured in backend/.env'
      });
    }
  }
);

// Request SMS OTP
router.post(
  '/request-otp',
  [
    body('phoneNumber').isMobilePhone(),
  ],
  async (req, res) => {
    try {
      if (!db) {
        return res.status(503).json({
          error: 'Backend database is not available (Firebase Admin SDK not configured)',
          hint:
            'Configure Firebase Admin credentials in backend/.env so the server can access Firestore, then restart the backend.',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phoneNumber } = req.body;

      // Generate OTP (6 digits)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in Firestore with expiration (5 minutes)
      const otpRef = db.collection('otps').doc();
      await otpRef.set({
        phoneNumber,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        verified: false,
        createdAt: new Date(),
      });

      // In production, send SMS via Twilio, AWS SNS, or Firebase Cloud Messaging
      // For now, we'll return it (remove this in production!)
      console.log(`OTP for ${phoneNumber}: ${otp}`);

      res.json({
        message: 'OTP sent successfully',
        otpId: otpRef.id,
        // Remove otp in production
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      });
    } catch (error) {
      console.error('OTP request error:', error);
      res.status(500).json({ error: 'Failed to send OTP', details: error.message });
    }
  }
);

// Verify SMS OTP
router.post(
  '/verify-otp',
  [
    body('phoneNumber').isMobilePhone(),
    body('otp').isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    try {
      if (!db) {
        return res.status(503).json({
          error: 'Backend database is not available (Firebase Admin SDK not configured)',
          hint:
            'Configure Firebase Admin credentials in backend/.env so the server can access Firestore, then restart the backend.',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phoneNumber, otp } = req.body;

      // Find OTP record
      const otpsSnapshot = await db
        .collection('otps')
        .where('phoneNumber', '==', phoneNumber)
        .where('verified', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      if (otpsSnapshot.empty) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const otpDoc = otpsSnapshot.docs[0];
      const otpData = otpDoc.data();

      // Check expiration
      if (new Date() > otpData.expiresAt.toDate()) {
        return res.status(400).json({ error: 'OTP expired' });
      }

      // Verify OTP
      if (otpData.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      // Mark OTP as verified
      await otpDoc.ref.update({ verified: true });

      res.json({
        message: 'OTP verified successfully',
        verified: true,
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ error: 'OTP verification failed', details: error.message });
    }
  }
);

export default router;
