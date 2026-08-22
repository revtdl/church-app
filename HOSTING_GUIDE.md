# Church Nexus - Complete Hosting & Deployment Guide

## 🚀 **What Needs to Be Hosted:**

```
┌─────────────────────────────────────────────┐
│  1. Admin Portal (React)  → http://admin... │
│  2. Member Web App (HTML) → http://app...   │
│  3. Backend API (Node.js) → http://api...   │
│  4. Mobile App (Flutter)  → Play Store      │
│  5. Database (Firebase)   → Cloud hosted    │
└─────────────────────────────────────────────┘
```

---

## 📋 **Hosting Options Summary:**

| Component | Best Option | Cost | Setup Time |
|-----------|-------------|------|-----------|
| **Admin Portal** | Vercel / Firebase Hosting | Free-$20/mo | 5 min |
| **Member Web App** | Vercel / Netlify | Free | 5 min |
| **Backend API** | Railway / Render / Heroku | Free-$7/mo | 10 min |
| **Database** | Firebase Firestore | Free-$25/mo | Already set |
| **Mobile App** | Google Play Store | $25 (one-time) | 1-2 weeks |
| **Domain** | Namecheap / GoDaddy | $10-15/year | 1 day |

---

## 🎯 **RECOMMENDED QUICK SETUP:**

### **Option A: Firebase Hosting (Easiest)**

```
✅ Admin Portal → Firebase Hosting
✅ Member Web App → Firebase Hosting
✅ Backend API → Firebase Cloud Functions
✅ Database → Firebase Firestore (ready)
✅ Domain → yourchurch.com
```

**Cost:** ~$25-30/month  
**Setup Time:** 30 minutes

---

### **Option B: Vercel + Railway (Fastest)**

```
✅ Admin Portal → Vercel
✅ Member Web App → Vercel
✅ Backend API → Railway
✅ Database → Firebase Firestore
✅ Domain → yourchurch.com
```

**Cost:** Free tier available  
**Setup Time:** 20 minutes

---

## 🔥 **OPTION A: Firebase Hosting (RECOMMENDED)**

### **Step 1: Install Firebase CLI**

```bash
npm install -g firebase-tools
firebase login
```

### **Step 2: Initialize Firebase in Projects**

```bash
# In church_website (Admin Portal)
cd C:\Users\amaze\projects\church_website
firebase init

# Select:
# - Hosting
# - Firestore
# - Functions (for backend)
```

### **Step 3: Deploy Admin Portal**

```bash
# Build React app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

**URL:** `https://yourproject.web.app/admin`

---

### **Step 4: Deploy Backend API**

Convert Express server to Firebase Functions:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Add all your API routes here
app.get('/api/events', async (req, res) => {
  // Your code
});

exports.api = functions.https.onRequest(app);
```

Deploy:
```bash
firebase deploy --only functions
```

**URL:** `https://us-central1-yourproject.cloudfunctions.net/api`

---

### **Step 5: Deploy Member Web App**

```bash
cd C:\Users\amaze\projects\church_app

# Copy HTML files to public folder
cp index-with-backend.html public/index.html

# Deploy
firebase deploy --only hosting
```

**URL:** `https://yourproject.web.app/`

---

## ⚡ **OPTION B: Vercel + Railway**

### **Deploy Admin Portal to Vercel**

```bash
cd C:\Users\amaze\projects\church_website

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Select framework: React
# Confirm deployment
```

**URL:** `https://yourchurch-admin.vercel.app`

---

### **Deploy Backend to Railway**

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your repo
5. Add environment variables
6. Deploy

**URL:** `https://yourchurch-api.up.railway.app`

---

### **Deploy Member Web App**

```bash
cd C:\Users\amaze\projects\church_app
vercel
```

**URL:** `https://yourchurch-app.vercel.app`

---

## 📱 **Deploy Mobile App to Play Store**

### **Step 1: Build Android App**

```bash
cd C:\Users\amaze\projects\church_app

# Generate signed APK
flutter build apk --release

# Output: build/app/outputs/flutter-app.apk
```

### **Step 2: Create Google Play Account**

- Go to https://play.google.com/console
- Sign up ($25 one-time fee)
- Create new app
- Fill in app details

### **Step 3: Upload to Play Store**

1. Build release APK
2. Upload to Play Store Console
3. Add screenshots, description, pricing
4. Submit for review (1-3 days)

---

## 🌐 **Connect Custom Domain**

### **Step 1: Buy Domain**

```
Options:
- Namecheap: $10-15/year
- GoDaddy: $15-20/year
- Google Domains: $12/year
```

### **Step 2: Point to Hosting**

**For Firebase:**
```
Add in Firebase Console:
Settings → Domain → Add custom domain
yourchurch.com
```

**For Vercel:**
```
Add in Vercel:
Settings → Domains → Add custom domain
yourchurch.com
```

Update DNS records to point to Firebase/Vercel IPs.

---

## 📊 **Complete Deployment Checklist:**

### **Pre-Deployment:**
- [ ] Firebase project created
- [ ] Environment variables (.env) configured
- [ ] API endpoints tested locally
- [ ] Admin portal tested locally
- [ ] Web app tested locally
- [ ] Mobile app tested on emulator

### **Firebase Hosting:**
- [ ] Install Firebase CLI
- [ ] Initialize Firebase
- [ ] Build React app (`npm run build`)
- [ ] Deploy hosting (`firebase deploy --only hosting`)
- [ ] Deploy functions (`firebase deploy --only functions`)
- [ ] Test live URLs

### **Custom Domain:**
- [ ] Domain purchased
- [ ] DNS records updated
- [ ] SSL certificate enabled (auto)
- [ ] Domain verified

### **Mobile App:**
- [ ] Build release APK
- [ ] Create Play Store account ($25)
- [ ] Upload APK
- [ ] Add app screenshots & description
- [ ] Submit for review

### **Post-Deployment:**
- [ ] Test all features on live site
- [ ] Monitor logs
- [ ] Set up analytics
- [ ] Configure email alerts

---

## 🔐 **Environment Variables for Production:**

### **Firebase Project Settings:**

```bash
# .env.production

REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=yourproject
REACT_APP_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com

# Backend API
REACT_APP_API_URL=https://api.yourchurch.com/api

# Features
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_ANALYTICS=true
```

---

## 📈 **Expected Costs (Monthly):**

```
Firebase Hosting:          $0-5
Firebase Functions:        $0-10
Firebase Firestore:        $0-25
Domain:                    ~$1 (yearly)
Notifications:             $0-10
Analytics:                 $0-5
─────────────────────────────────
TOTAL:                     $0-55/month
```

**Free tier includes:**
- 10GB storage
- 100k functions calls
- 1GB Firestore reads/month
- No credit card needed

---

## 🎯 **QUICK START (15 Minutes):**

### **1. Firebase Hosting (Recommended)**

```bash
# Install Firebase
npm install -g firebase-tools
firebase login

# In church_website
cd church_website
firebase init
npm run build
firebase deploy

# In church_app
cd ../church_app
cp index-with-backend.html ../church_website/public/
firebase deploy

# Done! Your apps are live!
```

### **2. Get Custom Domain**

1. Buy at Namecheap.com ($10/year)
2. Add to Firebase Console
3. Update DNS records

### **3. Deploy Mobile App**

1. Build: `flutter build apk --release`
2. Upload to Play Store
3. Wait for approval (1-3 days)

---

## 📱 **Live URLs (After Deployment):**

```
Admin Portal:    https://yourchurch.com/admin
Member Web App:  https://yourchurch.com/
API:             https://api.yourchurch.com/api
Mobile App:      Google Play Store - "Church Nexus"
```

---

## 🚀 **Deployment Timeline:**

| Task | Time | Difficulty |
|------|------|-----------|
| Setup Firebase | 5 min | Easy |
| Deploy Admin Portal | 5 min | Easy |
| Deploy Web App | 5 min | Easy |
| Deploy Backend | 10 min | Medium |
| Get Domain | 1 day | Easy |
| Deploy Mobile App | 1-2 weeks | Medium |
| **TOTAL** | **~1-2 weeks** | - |

---

## 📞 **Support:**

- Firebase Docs: https://firebase.google.com/docs/hosting
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Play Store Guide: https://developer.android.com/distribute/console

---

## ✅ **Next Steps:**

1. Choose hosting option (Firebase recommended)
2. Create Firebase project
3. Deploy components
4. Buy custom domain
5. Deploy mobile app
6. Go live! 🎉

**Ready to deploy?** Let me know which option you choose! 🚀
