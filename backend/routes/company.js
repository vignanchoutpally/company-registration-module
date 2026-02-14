import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get company profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const companyDoc = await db.collection('companies').doc(req.user.companyId).get();
    
    if (!companyDoc.exists) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const companyData = companyDoc.data();
    // Remove sensitive data
    delete companyData.createdAt;
    delete companyData.updatedAt;

    res.json({
      company: companyData,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

// Update registration step (multi-step form)
router.put(
  '/registration-step',
  verifyToken,
  [
    body('step').isInt({ min: 1, max: 5 }),
    body('data').isObject(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { step, data } = req.body;
      const companyRef = db.collection('companies').doc(req.user.companyId);

      // Update company data based on step
      const updateData = {
        [`step${step}Data`]: data,
        registrationStep: step,
        updatedAt: new Date(),
      };

      // Mark as completed if final step
      if (step === 5) {
        updateData.registrationStatus = 'completed';
      } else if (step > 1) {
        updateData.registrationStatus = 'in_progress';
      }

      await companyRef.update(updateData);

      res.json({
        message: 'Registration step updated successfully',
        step,
        registrationStatus: updateData.registrationStatus,
      });
    } catch (error) {
      console.error('Update step error:', error);
      res.status(500).json({ error: 'Failed to update step', details: error.message });
    }
  }
);

// Update company profile (settings)
router.put(
  '/profile',
  verifyToken,
  [
    body('companyName').optional().trim().notEmpty(),
    body('phoneNumber').optional().isMobilePhone(),
    body('address').optional().isObject(),
    body('website').optional().isURL(),
    body('industry').optional().trim().notEmpty(),
    body('description').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const companyRef = db.collection('companies').doc(req.user.companyId);
      const updateData = {
        ...req.body,
        updatedAt: new Date(),
      };

      await companyRef.update(updateData);

      const updatedDoc = await companyRef.get();
      const companyData = updatedDoc.data();

      res.json({
        message: 'Profile updated successfully',
        company: companyData,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
  }
);

// Get registration status
router.get('/registration-status', verifyToken, async (req, res) => {
  try {
    const companyDoc = await db.collection('companies').doc(req.user.companyId).get();
    
    if (!companyDoc.exists) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const companyData = companyDoc.data();

    res.json({
      registrationStatus: companyData.registrationStatus,
      registrationStep: companyData.registrationStep,
      completedSteps: Object.keys(companyData)
        .filter(key => key.startsWith('step') && key.endsWith('Data'))
        .map(key => parseInt(key.replace('step', '').replace('Data', ''))),
    });
  } catch (error) {
    console.error('Get registration status error:', error);
    res.status(500).json({ error: 'Failed to fetch status', details: error.message });
  }
});

export default router;
