# Quick Setup Guide

## Step-by-Step Setup

### 1. Firebase Project Setup

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to Authentication
   - Click "Get started"
   - Enable "Email/Password" provider
   - Enable "Phone" provider (for SMS OTP)

3. **Create Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (for development)
   - Choose a location

4. **Get Service Account Key (Backend)**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely
   - Extract values for backend `.env`

5. **Get Web App Config (Frontend)**
   - Go to Project Settings > General
   - Scroll to "Your apps"
   - Click the web icon (`</>`)
   - Register app if needed
   - Copy config values for frontend `.env`

### 2. Backend Configuration

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your Firebase Admin SDK credentials:
- `FIREBASE_PROJECT_ID`: From service account JSON (`project_id`)
- `FIREBASE_PRIVATE_KEY`: From service account JSON (`private_key` - keep quotes and `\n`)
- `FIREBASE_CLIENT_EMAIL`: From service account JSON (`client_email`)
- `JWT_SECRET`: Generate a secure random string (32+ characters)

### 3. Frontend Configuration

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` with your Firebase Web App config:
- All `REACT_APP_FIREBASE_*` values from Firebase Console
- `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:5000/api`)

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or npm run dev for auto-reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Testing the Application

1. **Register a Company**
   - Go to http://localhost:3000/register
   - Fill in company name, email, and password
   - Click "Register"

2. **Complete Registration Form**
   - After registration, you'll be redirected to the multi-step form
   - Complete all 5 steps

3. **View Dashboard**
   - After completing registration, view your dashboard
   - See company information and registration status

4. **Edit Profile**
   - Go to Settings from the dashboard
   - Update company information
   - Save changes

5. **Login**
   - Logout and test login functionality
   - Try both email/password and SMS OTP (if configured)

## Troubleshooting

### Backend Issues

- **Firebase Admin SDK Error**: Check that your `.env` file has correct credentials
- **Port Already in Use**: Change `PORT` in `.env` or kill the process using port 5000
- **JWT Error**: Ensure `JWT_SECRET` is set in `.env`

### Frontend Issues

- **Firebase Config Error**: Verify all `REACT_APP_FIREBASE_*` values in `.env`
- **API Connection Error**: Check that backend is running and `REACT_APP_API_URL` is correct
- **CORS Error**: Ensure backend CORS is configured correctly

### SMS OTP Issues

- **OTP Not Sending**: In development, OTP is logged to console. Check backend logs.
- **OTP Verification Fails**: Ensure phone number format matches (include country code, e.g., +1234567890)

## Next Steps

1. **Configure SMS Service**: Integrate Twilio or AWS SNS for production SMS OTP
2. **Add Email Verification**: Implement email verification flow
3. **Add File Upload**: Implement document upload for company verification
4. **Add Admin Panel**: Create admin interface for managing companies
5. **Add Notifications**: Implement email/SMS notifications for status updates
