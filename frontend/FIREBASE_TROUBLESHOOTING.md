# Firebase Configuration Not Found - Troubleshooting

## Error: `auth/configuration-not-found`

This error typically means Firebase Authentication is not properly configured. Follow these steps:

### Step 1: Verify Firebase Console Settings

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `company-regisration-module`
3. **Check Authentication**:
   - Click "Authentication" in left menu
   - Go to "Sign-in method" tab
   - Verify "Email/Password" is **Enabled** (should show green toggle)
   - If not enabled, click on it and toggle "Enable"

### Step 2: Verify Auth Domain

1. In Firebase Console → Authentication → Settings
2. Check "Authorized domains"
3. Make sure `localhost` is listed (it should be by default)
4. Verify your auth domain matches: `company-regisration-module.firebaseapp.com`

### Step 3: Check Browser Console

Open browser DevTools (F12) and check the Console tab for:
- ✅ "Firebase initialized successfully" - Good!
- ❌ Any Firebase errors - Check the error message

### Step 4: Verify Environment Variables

The frontend server must be restarted after changing `.env` file:

1. Stop the frontend server (Ctrl+C)
2. Start it again: `cd frontend && npm start`
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Step 5: Common Issues

**Issue: Auth Domain Typo**
- Your auth domain: `company-regisration-module.firebaseapp.com`
- Note: "regisration" instead of "registration"
- If this is a typo in Firebase project name, you may need to:
  - Create a new Firebase project with correct spelling, OR
  - Use the exact domain as shown in Firebase Console

**Issue: Authentication Not Enabled**
- Make sure Email/Password provider is enabled in Firebase Console
- Go to Authentication → Sign-in method → Email/Password → Enable

**Issue: Project ID Mismatch**
- Verify project ID in Firebase Console matches your `.env` file
- Go to Project Settings → General → Project ID

### Step 6: Test Firebase Connection

Open browser console and run:
```javascript
// Check if Firebase is initialized
console.log(window.firebase || 'Firebase not found');

// Check environment variables (in React app)
// These should be available at build time
```

### Still Not Working?

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Check Firebase Console** for any service outages
3. **Verify API key** is correct in `.env` file
4. **Restart both servers**:
   ```bash
   # Stop both
   # Then restart backend
   cd backend && npm start
   
   # Then restart frontend (in new terminal)
   cd frontend && npm start
   ```

### Quick Fix: Re-enable Authentication

If authentication was disabled:

1. Firebase Console → Authentication → Sign-in method
2. Click "Email/Password"
3. Toggle "Enable" to ON
4. Click "Save"
5. Refresh your app
