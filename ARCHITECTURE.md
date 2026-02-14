# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  Pages:                                                      │
│  • Login (Email/Password + SMS OTP)                         │
│  • Register                                                  │
│  • Dashboard (Post-registration)                            │
│  • Registration Form (5-step multi-step form)                │
│  • Settings (Profile editing)                                │
│                                                              │
│  Components:                                                 │
│  • ProtectedRoute (Route guard)                              │
│  • RegistrationForm (Multi-step form)                         │
│                                                              │
│  Context:                                                    │
│  • AuthContext (Authentication state management)             │
│                                                              │
│  Config:                                                     │
│  • Firebase Client SDK                                       │
│  • API Client (Axios with interceptors)                      │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS/REST API
                   │ JWT Bearer Token
┌──────────────────▼──────────────────────────────────────────┐
│                   Backend (Express.js)                       │
├─────────────────────────────────────────────────────────────┤
│  Routes:                                                     │
│  • /api/auth                                                 │
│    - POST /register                                          │
│    - POST /login                                             │
│    - POST /request-otp                                       │
│    - POST /verify-otp                                        │
│                                                              │
│  • /api/company                                              │
│    - GET /profile                                            │
│    - PUT /profile                                            │
│    - PUT /registration-step                                   │
│    - GET /registration-status                                 │
│                                                              │
│  Middleware:                                                 │
│  • verifyToken (JWT authentication)                          │
│  • generateToken (JWT generation)                             │
│                                                              │
│  Config:                                                     │
│  • Firebase Admin SDK                                        │
│  • Express Validator                                         │
│  • CORS                                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │ Admin SDK
┌──────────────────▼──────────────────────────────────────────┐
│                    Firebase Services                         │
├─────────────────────────────────────────────────────────────┤
│  • Authentication (Email/Password, Phone)                    │
│  • Firestore Database                                        │
│    - companies collection                                    │
│    - otps collection                                         │
│  • Custom Claims (companyId mapping)                         │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Registration Flow

```
User → Register Form → Firebase Auth (Create User)
                    ↓
              Backend API (/auth/register)
                    ↓
         Create Firestore Company Document
                    ↓
         Set Custom Claims (companyId)
                    ↓
         Generate JWT Token
                    ↓
         Return Token + CompanyId
                    ↓
         Store Token in LocalStorage
                    ↓
         Redirect to Registration Form
```

### Authentication Flow

```
User → Login Form → Firebase Auth (Sign In)
                ↓
          Backend API (/auth/login)
                ↓
     Verify User + Get Company Data
                ↓
     Generate JWT Token
                ↓
     Return Token + CompanyId
                ↓
     Store Token in LocalStorage
                ↓
     Redirect to Dashboard
```

### Protected Route Flow

```
User → Protected Route → Check LocalStorage Token
                      ↓
                 API Request with Token
                      ↓
            Backend verifyToken Middleware
                      ↓
         Verify JWT + Firebase User
                      ↓
         Attach User Info to Request
                      ↓
         Execute Route Handler
```

## Database Schema

### Firestore Collections

#### `companies`
```javascript
{
  companyId: string (document ID),
  companyName: string,
  email: string,
  phoneNumber: string,
  website: string,
  industry: string,
  description: string,
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  registrationStatus: 'pending' | 'in_progress' | 'completed',
  registrationStep: number (1-5),
  step1Data: object, // Basic Information
  step2Data: object, // Contact Information
  step3Data: object, // Business Details
  step4Data: object, // Legal & Compliance
  step5Data: object, // Additional Information
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `otps`
```javascript
{
  phoneNumber: string,
  otp: string,
  expiresAt: timestamp,
  verified: boolean,
  createdAt: timestamp
}
```

## Security Features

1. **JWT Authentication**
   - Token-based session management
   - Token expiration (7 days default)
   - Secure token storage in localStorage

2. **Firebase Authentication**
   - Email/Password authentication
   - SMS OTP verification
   - Secure password handling

3. **Input Validation**
   - Express Validator on backend
   - Form validation on frontend
   - Email format validation
   - Phone number validation

4. **Route Protection**
   - Protected routes require authentication
   - Token verification middleware
   - Automatic redirect on token expiration

5. **CORS Configuration**
   - Configured for cross-origin requests
   - Secure API access

## Multi-Step Registration Process

### Step 1: Basic Information
- Company Name
- Registration Number
- Tax ID

### Step 2: Contact Information
- Phone Number
- Email
- Website
- Address (Street, City, State, Zip, Country)

### Step 3: Business Details
- Industry
- Business Type
- Number of Employees
- Founded Year

### Step 4: Legal & Compliance
- Legal Structure
- Registration Date
- Compliance Status
- Licenses

### Step 5: Additional Information
- Description
- Services
- Certifications

Each step saves data to Firestore and updates the registration step counter.

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Firebase Admin SDK private key
- `FIREBASE_CLIENT_EMAIL`: Firebase Admin SDK client email
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_FIREBASE_API_KEY`: Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID`: Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: Firebase app ID

## Deployment Considerations

1. **Backend**
   - Use environment variables for all secrets
   - Enable HTTPS in production
   - Configure CORS for production domain
   - Set up proper logging and monitoring
   - Use process manager (PM2, Forever)

2. **Frontend**
   - Build production bundle (`npm run build`)
   - Configure production API URL
   - Enable Firebase production rules
   - Set up CDN for static assets
   - Configure caching strategies

3. **Firebase**
   - Set up Firestore security rules
   - Configure authentication providers
   - Set up production Firebase project
   - Configure SMS provider for OTP

4. **Security**
   - Use strong JWT secrets
   - Implement rate limiting
   - Add request validation
   - Set up monitoring and alerts
   - Regular security audits
