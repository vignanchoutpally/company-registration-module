# ⚡ Quick Firebase Setup (5 Minutes)

## Step-by-Step Instructions

### 1. Go to Firebase Console
👉 **https://console.firebase.google.com/**

### 2. Create/Select Project
- Click **"Add project"** (or select existing)
- Enter project name (e.g., "company-registration")
- Click **"Continue"** → **"Create project"**

### 3. Enable Authentication
1. Click **"Authentication"** in left menu
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
   - Toggle **"Enable"**
   - Click **"Save"**
5. Click **"Phone"** (optional for SMS OTP)
   - Toggle **"Enable"**
   - Click **"Save"**

### 4. Create Firestore Database
1. Click **"Firestore Database"** in left menu
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose location (closest to you)
5. Click **"Enable"**

### 5. Get Web App Configuration
1. Click **⚙️ Settings** (gear icon) → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click **web icon** `</>` (or "Add app" → Web)
4. Register app:
   - App nickname: "Company Registration"
   - Click **"Register app"**
5. **Copy the config values** that appear

### 6. Update frontend/.env File

Open `frontend/.env` and replace with your actual values:

```env
REACT_APP_API_URL=http://localhost:5000/api

REACT_APP_FIREBASE_API_KEY=AIzaSy...your-actual-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-name.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-name
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-name.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Important:** Replace ALL placeholder values with your actual Firebase config!

### 7. Restart Frontend Server

```bash
# Stop the current server (Ctrl+C in terminal)
cd frontend
npm start
```

### 8. Test Registration

1. Go to http://localhost:3000
2. Click **"Register"**
3. Fill in the form
4. Click **"Register"**

✅ **You should now be able to register without errors!**

---

## Need Backend Firebase Config Too?

If backend also needs Firebase (for admin operations):

1. In Firebase Console → ⚙️ Settings → **"Service accounts"**
2. Click **"Generate new private key"**
3. Download JSON file
4. Open JSON and copy values to `backend/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep quotes!)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

---

## Troubleshooting

**Still seeing "api-key-not-valid"?**
- Make sure you copied the ENTIRE API key (starts with "AIzaSy...")
- Check for extra spaces in `.env` file
- Restart the frontend server after updating `.env`

**Firebase initialization error?**
- Verify all 6 Firebase config values are set
- Check that values don't contain "your-" or "123456789"
- Make sure `.env` file is in `frontend/` directory

**Registration still not working?**
- Check browser console for errors
- Verify Authentication is enabled in Firebase Console
- Make sure Firestore Database is created

---

## Done! 🎉

Once configured, the warning overlay will disappear and you can use the app normally.
