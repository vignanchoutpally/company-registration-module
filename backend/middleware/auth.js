import jwt from 'jsonwebtoken';
import { auth } from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify Firebase user still exists
    const userRecord = await auth.getUser(decoded.uid);
    
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      companyId: decoded.companyId,
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      companyId: user.companyId,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
