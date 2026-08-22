# Firebase Configuration - Whitefield Methodist Church

## ✅ Project Details

**Firebase Project:** churchapp-74dec
**Database:** Firestore (Cloud Firestore)
**Region:** us-central1

---

## 🔑 Firebase Credentials

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g",
  authDomain: "churchapp-74dec.firebaseapp.com",
  projectId: "churchapp-74dec",
  storageBucket: "churchapp-74dec.firebasestorage.app",
  messagingSenderId: "684996448330",
  appId: "1:684996448330:web:4531fce57b5af27c4c16b3"
};
```

---

## 📊 Firestore Collections

### announcements
**Purpose:** Store church announcements

**Document Structure:**
```json
{
  "title": "string",
  "content": "string",
  "date": "YYYY-MM-DD",
  "priority": "string (high/normal/low)",
  "createdAt": "timestamp"
}
```

**Example Document:**
```json
{
  "title": "Sunday Service Starting Time Changed",
  "content": "Please note that starting from next Sunday, the English service will begin at 10:00 AM instead of 9:30 AM.",
  "date": "2026-08-17",
  "priority": "high",
  "createdAt": "2026-08-17T12:00:00Z"
}
```

---

## 🔐 Firestore Security Rules

**Current Rules (Test Mode - Allow All):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING:** These rules allow anyone to read and write! 
For production, use more restrictive rules.

**Production Rules (Recommended):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /announcements/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
  }
}
```

---

## 📱 Implementation Details

### Admin Portal
**URL:** `http://localhost:8000/admin-portal.html`
**Function:** Add, view, and delete announcements
**SDK:** Firebase Firestore (compatibility)

### Member App
**URL:** `http://localhost:8000/index.html`
**Function:** View announcements in real-time
**SDK:** Firebase Firestore (compatibility)

### Real-time Sync
- Announcements are synced instantly
- No manual refresh needed
- Member app listens to Firestore changes

---

## 🚀 How to Use

### Add Announcement (Admin)
1. Go to: http://localhost:8000/admin-portal.html
2. Click "Demo Access"
3. Click "📢 Announcements"
4. Fill in: Title, Content, Date
5. Click "Add Announcement"
6. Announcement appears instantly in member app

### View Announcements (Member)
1. Go to: http://localhost:8000/index.html
2. Click "Announcements" tab
3. See all announcements in real-time

### Delete Announcement (Admin)
1. Go to Announcements section in admin portal
2. Click "Delete" button next to announcement
3. Confirm deletion

---

## ✅ Verification Checklist

- [x] Firebase project created
- [x] Firestore database created
- [x] Announcements collection created
- [x] Security rules updated
- [x] Admin portal connected
- [x] Member app connected
- [x] Real-time sync working
- [x] Firebase SDK installed (compatibility version)

---

## 🔧 Troubleshooting

### Error: "firebase is not defined"
**Solution:** Make sure Firebase SDK scripts are loaded:
```html
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
```

### Announcements not appearing
**Solution:** Check:
1. Firestore security rules allow reads
2. Firestore collection exists
3. Browser console for errors (F12)
4. Firebase initialization completed

### Data not saving to Firebase
**Solution:** Check:
1. API key is correct
2. Project ID is correct
3. Firestore security rules allow writes
4. Internet connection is working

---

## 📝 Files Modified

- `C:\Users\amaze\projects\church_app\index.html` - Member app with Firebase
- `C:\Users\amaze\projects\church_app\admin-portal.html` - Admin portal with Firebase
- `C:\Users\amaze\projects\church_app\FIREBASE_CONFIG.md` - This file

---

## 🎯 Next Steps

1. ✅ Firebase real-time sync is LIVE
2. Move to production rules (restrict writes)
3. Add user authentication
4. Deploy to production
5. Add more collections (sermons, events, etc.)

---

## 📞 Support

For issues:
1. Check browser console (F12)
2. Verify Firebase project settings
3. Confirm security rules
4. Check internet connection

---

**Configuration Last Updated:** 2026-08-17
**Status:** ✅ LIVE AND WORKING
