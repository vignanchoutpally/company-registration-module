# Firebase Setup Guide

## Quick Setup Steps

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard:
   - Enter project name
   - Enable/disable Google Analytics (optional)
   - Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase Console, click **"Authentication"** in the left menu
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on Email/Password
   - Toggle **"Enable"**
   - Click **"Save"**
5. Enable **"Phone"** provider (for SMS OTP):
   - Click on Phone
   - Toggle **"Enable"**
   - Click **"Save"**

### Step 3: Create Firestore Database

1. Click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to your users)
5. Click **"Enable"**

### Step 4: Get Web App Configuration (Frontend)

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Scroll down to **"Your apps"** section
3. Click the **web icon** `</>` (or "Add app" > Web)
4. Register your app:
   - Enter app nickname (e.g., "Company Registration")
   - Check "Also set up Firebase Hosting" (optional)
   - Click **"Register app"**
5. Copy the Firebase configuration object that appears
6. It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

7. Update your `frontend/.env` file with these values:
```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Step 5: Get Service Account Key (Backend)

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the confirmation dialog
5. A JSON file will download (keep this secure!)
6. Open the JSON file and extract these values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and `\n`)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

7. Update your `backend/.env` file:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
JWT_SECRET=your-secure-random-string-min-32-characters-long
```

**Important Notes:**
- Keep the quotes around `FIREBASE_PRIVATE_KEY`
- Keep the `\n` characters in the private key
- Generate a secure `JWT_SECRET` (use a random string generator)

### Step 6: Restart Servers

After updating `.env` files:

1. Stop both servers (Ctrl+C)
2. Restart backend:
   ```bash
   cd backend
   npm start
   ```
3. Restart frontend:
   ```bash
   cd frontend
   npm start
   ```

## Verifying Setup

### Test Backend Connection

```bash
curl http://localhost:5000/health
```

Should return: `{"status":"OK","message":"Company Registration API is running"}`

### Test Frontend

1. Open http://localhost:3000
2. You should see the login page without Firebase errors
3. Try registering a new company account

## Troubleshooting

### Error: "api-key-not-valid"

**Solution:** Make sure you copied the correct API key from Firebase Console. It should start with "AIzaSy..."

### Error: "Firebase Admin initialization error"

**Solution:** 
- Check that `FIREBASE_PRIVATE_KEY` has quotes and `\n` characters
- Verify `FIREBASE_CLIENT_EMAIL` is correct
- Ensure `FIREBASE_PROJECT_ID` matches your project

### Error: "Permission denied" in Firestore

**Solution:** 
- Make sure Firestore is created
- For development, use "test mode" rules
- For production, set up proper security rules

### SMS OTP Not Working

**Note:** SMS OTP requires additional setup:
- Firebase Phone Authentication needs to be verified
- For production, you may need to integrate Twilio or AWS SNS
- In development, OTPs are logged to console

## Security Rules (Firestore)

For development, you can use test mode. For production, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /companies/{companyId} {
      allow read, write: if request.auth != null && 
        request.auth.token.companyId == companyId;
    }
    match /otps/{otpId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Need Help?

- Check the main [README.md](./README.md) for more details
- Review [SETUP.md](./SETUP.md) for general setup
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture
