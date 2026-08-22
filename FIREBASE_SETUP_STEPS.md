# Firebase Setup Guide - Complete Steps

**⏱️ Total time: 10-15 minutes**

---

## **STEP 1: Create Firebase Project**

1. Open browser and go to: **https://console.firebase.google.com/**
2. Click **"Create a project"** button
3. Enter project name: **`ChurchApp`**
4. Click **"Continue"**
5. **Uncheck** "Enable Google Analytics" (optional)
6. Click **"Create project"**
7. **Wait 1-2 minutes** for project to be created ⏳

✅ **Result**: Firebase project created

---

## **STEP 2: Add Android App**

1. In Firebase Console, click **"Add app"** button
2. Select **Android** icon
3. Fill in the form:
   - **Package name**: `com.church.app`
   - **App nickname**: `Church App` (optional)
   - **Debug SHA-1**: (leave empty, optional)
4. Click **"Register app"**
5. **Download `google-services.json`** file (click "Download")
6. Click **"Next"** through remaining steps (you can skip)

✅ **Result**: Android app registered, JSON file downloaded

---

## **STEP 3: Place google-services.json File**

1. Find downloaded `google-services.json` file (usually in Downloads folder)
2. Move it to this location:
   ```
   C:\Users\amaze\projects\church_app\android\app\google-services.json
   ```
3. **Verify**: Check the file exists at that path

✅ **Result**: Configuration file in place

---

## **STEP 4: Enable Email/Password Authentication**

1. In Firebase Console, left menu click **"Authentication"**
2. Click **"Get Started"** button
3. Under **"Sign-in method"**, click **"Email/Password"**
4. Toggle the switch to **"Enable"** (turn ON)
5. Click **"Save"**

✅ **Result**: Email/Password authentication enabled

---

## **STEP 5: Create Firestore Database**

1. In Firebase Console, left menu click **"Firestore Database"**
2. Click **"Create database"** button
3. Select **"Start in production mode"**
4. Choose region closest to your location:
   - US: `us-east1`
   - Europe: `europe-west1`
   - Asia: `asia-southeast1`
5. Click **"Create"**
6. **Wait 1-2 minutes** for database to be created ⏳

✅ **Result**: Firestore database created

---

## **STEP 6: Update Security Rules**

1. In Firestore Database, click **"Rules"** tab
2. **Delete** all existing text
3. **Copy and paste** this entire code:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /events/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /sermons/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /prayer_requests/{document=**} {
      allow read, create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

4. Click **"Publish"** button
5. Confirm the update

✅ **Result**: Security rules applied

---

## **STEP 7: Verify Setup**

Check all items are completed:

- [ ] Firebase project created
- [ ] Android app registered
- [ ] `google-services.json` downloaded and placed
- [ ] Email/Password authentication enabled
- [ ] Firestore database created
- [ ] Security rules published

---

## **STEP 8: Add Sample Data (Optional)**

To test the app with data, add a sample event:

1. In Firestore Database, click **"+ Add collection"**
2. Collection name: **`events`**
3. Document ID: **`event1`**
4. Add these fields:

| Field | Type | Value |
|-------|------|-------|
| `id` | String | `event1` |
| `title` | String | `Sunday Service` |
| `description` | String | `Join us for our weekly worship` |
| `location` | String | `123 Church Street` |
| `startTime` | Timestamp | Aug 24, 2026 10:00 AM |
| `endTime` | Timestamp | Aug 24, 2026 11:30 AM |
| `imageUrl` | String | (leave empty) |

5. Click **"Save"**

✅ **Result**: Sample event added (optional)

---

## **Troubleshooting**

| Problem | Solution |
|---------|----------|
| Can't download `google-services.json` | Reload page, try again |
| File not found error when running app | Check file is in `android/app/` folder |
| Authentication not working | Verify Email/Password is enabled in Firebase |
| Database errors | Check security rules are published |

---

## **Next Steps**

Once Firebase setup is complete:

1. Start Android Emulator (open Android Studio)
2. Run the app:
   ```bash
   cd C:\Users\amaze\projects\church_app
   flutter run
   ```
3. Test signing up with email
4. Explore all app features

---

## **Firebase Console Links**

- **Main Console**: https://console.firebase.google.com/
- **Authentication**: https://console.firebase.google.com/u/0/project/churchapp-{ID}/authentication
- **Firestore**: https://console.firebase.google.com/u/0/project/churchapp-{ID}/firestore

---

## **Support**

If you need help:
1. Check SETUP.md in project folder
2. Visit: https://firebase.google.com/docs
3. Check Firebase Console for error messages

---

**Happy Setting Up! 🎉**

Estimated time to complete: **10-15 minutes**
