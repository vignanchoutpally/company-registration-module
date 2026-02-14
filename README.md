# Company Registration & Verification Module

A comprehensive web application designed to enable companies to register, log in, and manage their profiles through a secure, scalable, and responsive interface. The module includes a multi-step registration form displayed in the dashboard post-registration, with profile details editable in the settings section.

## Features

- 🔐 **Dual Authentication**: Email/Password and SMS OTP authentication via Firebase
- 📝 **Multi-Step Registration**: 5-step registration form for comprehensive company data collection
- 🎨 **Modern UI**: Responsive design with beautiful gradient themes
- 🔒 **Secure Backend**: JWT-based session management with Firebase Admin SDK
- 📊 **Dashboard**: Post-registration dashboard with company profile overview
- ⚙️ **Settings Page**: Edit and update company profile information
- 🚀 **Scalable Architecture**: RESTful API design with Express.js backend

## Tech Stack

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Firebase SDK (Authentication)
- Axios (HTTP Client)
- React Hot Toast (Notifications)
- React Icons

### Backend
- Node.js with Express.js
- Firebase Admin SDK
- JWT (JSON Web Tokens)
- Express Validator
- CORS enabled

## Project Structure

```
company-registration-module/
├── backend/
│   ├── config/
│   │   └── firebase.js          # Firebase Admin SDK configuration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── company.js           # Company profile routes
│   ├── server.js                # Express server entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.js
│   │   │   └── RegistrationForm.js
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Settings.js
│   │   ├── config/
│   │   │   ├── firebase.js      # Firebase client config
│   │   │   └── api.js           # API client configuration
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication enabled
- Firebase Admin SDK service account key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your Firebase credentials:
```env
PORT=5000
NODE_ENV=development

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend API will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your Firebase client credentials:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

5. Start the frontend development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## Firebase Configuration

### Setting up Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Enable Phone provider (for SMS OTP)

### Getting Firebase Admin SDK Credentials

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the following values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### Getting Firebase Client Credentials

1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Add a web app if you haven't already
4. Copy the Firebase configuration values to your frontend `.env` file

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register a new company
  - Body: `{ email, password, companyName }`
  - Returns: `{ token, companyId, user }`

- `POST /api/auth/login` - Login with email/password
  - Body: `{ email, password }`
  - Returns: `{ token, companyId, user }`

- `POST /api/auth/request-otp` - Request SMS OTP
  - Body: `{ phoneNumber }`
  - Returns: `{ message, otpId }`

- `POST /api/auth/verify-otp` - Verify SMS OTP
  - Body: `{ phoneNumber, otp }`
  - Returns: `{ message, verified }`

### Company Routes (`/api/company`)

All company routes require authentication (Bearer token in Authorization header)

- `GET /api/company/profile` - Get company profile
  - Returns: `{ company }`

- `PUT /api/company/profile` - Update company profile
  - Body: `{ companyName, phoneNumber, website, industry, description, address }`
  - Returns: `{ message, company }`

- `PUT /api/company/registration-step` - Update registration step
  - Body: `{ step, data }`
  - Returns: `{ message, step, registrationStatus }`

- `GET /api/company/registration-status` - Get registration status
  - Returns: `{ registrationStatus, registrationStep, completedSteps }`

## Registration Flow

1. **User Registration**: Company creates account with email/password
2. **Multi-Step Form**: After registration, user is redirected to complete 5-step registration:
   - Step 1: Basic Information (Company Name, Registration Number, Tax ID)
   - Step 2: Contact Information (Phone, Email, Website, Address)
   - Step 3: Business Details (Industry, Business Type, Employees, Founded Year)
   - Step 4: Legal & Compliance (Legal Structure, Registration Date, Compliance Status)
   - Step 5: Additional Information (Description, Services, Certifications)
3. **Dashboard**: After completion, user can view their profile and registration status
4. **Settings**: User can edit profile information anytime from settings page

## Security Features

- JWT token-based authentication
- Firebase Authentication integration
- Protected routes on frontend
- Token expiration handling
- Input validation using express-validator
- CORS configuration
- Secure password handling via Firebase

## Development Notes

### SMS OTP Implementation

The current SMS OTP implementation stores OTPs in Firestore. In production, you should integrate with:
- Twilio
- AWS SNS
- Firebase Cloud Messaging
- Or another SMS service provider

The OTP is currently logged to console in development mode for testing purposes.

### Environment Variables

Never commit `.env` files to version control. Always use `.env.example` as a template.

### Database

This application uses Firestore (Firebase) for data storage. The following collections are used:
- `companies` - Company profile data
- `otps` - Temporary OTP storage

## Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Use a secure JWT secret (at least 32 characters)
3. Ensure Firebase Admin SDK credentials are properly configured
4. Deploy to platforms like:
   - Heroku
   - AWS Elastic Beanstalk
   - Google Cloud Run
   - DigitalOcean App Platform

### Frontend Deployment

1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `build` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Firebase Hosting

3. Update `REACT_APP_API_URL` to point to your production backend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## 💬 Contact & Support

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></td>
      <td><a href="https://github.com/vignanchoutpally/company-registration-module/issues">Submit Issues & Feature Requests</a></td>
    </tr>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"></td>
      <td><a href="https://x.com/vignan7013">Follow for Updates</a></td>
    </tr>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></td>
      <td><a href="mailto:vignandon2@gmail.com">Contact Developer</a></td>
    </tr>
  </table>
</div>

<div align="center">
  <p>© 2026 | <a href="https://github.com/vignanchoutpally">Vignan Choutpally</a></p>
</div>
