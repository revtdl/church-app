# Church App - Production Deployment Plan (POA)

**Project:** Whitefield Methodist Church App
**Goal:** Deploy to Google Play Store & iOS App Store
**Status:** Ready for Production Phase

---

## 📋 Phase 1: Firebase Production Setup (Days 1-2)

### 1.1 Security Rules & Database
- [ ] Review and validate Firestore security rules (`firestore.rules`)
- [ ] Deploy rules to Firebase: `firebase deploy --only firestore:rules`
- [ ] Test read/write permissions for authenticated users
- [ ] Verify members collection is read-only for all users
- [ ] Enable Firestore backups in Firebase Console

### 1.2 API Keys & Credentials Security
- [ ] Remove hardcoded API keys from HTML files
- [ ] Create restricted API key in Google Cloud Console
- [ ] Restrict key to:
  - [ ] Cloud Firestore API
  - [ ] Cloud Storage API
  - [ ] Firebase Hosting
- [ ] Set HTTP referrer restrictions (your domain only)
- [ ] Update app to use Firebase SDK config instead of exposed keys

### 1.3 Authentication Setup
- [ ] Disable "Local Login" for production
- [ ] Keep only: Email Login, Google Login
- [ ] Set up email verification
- [ ] Configure password reset flow
- [ ] Test authentication flow end-to-end

### 1.4 Cloud Storage (For Images)
- [ ] Create Firebase Cloud Storage bucket
- [ ] Upload existing gallery images to Cloud Storage
- [ ] Update gallery upload function to use Cloud Storage instead of base64
- [ ] Create and deploy Cloud Storage security rules
- [ ] Test image upload/download

### 1.5 Firebase Project Configuration
- [ ] Upgrade to Blaze pay-as-you-go plan (required for Cloud Storage)
- [ ] Set budget alerts in Firebase Console ($50/month cap)
- [ ] Enable Firebase Analytics
- [ ] Enable Crash Reporting
- [ ] Configure performance monitoring

**Estimated Time:** 2-3 hours
**Owner:** You + Claude

---

## 📦 Phase 2: Android Build & Play Store (Days 2-3)

### 2.1 Build Setup
- [ ] Verify Capacitor is properly configured
- [ ] Run: `ionic capacitor build android --release`
- [ ] Resolve any build errors

### 2.2 Signing Certificate (Keystore)
- [ ] Generate keystore file:
  ```bash
  keytool -genkey -v -keystore church-app.keystore \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -alias church-app
  ```
- [ ] Save keystore in secure location (backup!)
- [ ] Note down password securely

### 2.3 Sign APK/AAB
- [ ] Sign release build with keystore
- [ ] Test signed APK on device
- [ ] Verify all features work (gallery, announcements, events, etc.)

### 2.4 Google Play Console Setup
- [ ] Create Google Play Developer Account ($25)
- [ ] Create new app: "Whitefield Methodist Church"
- [ ] Fill in basic app info
- [ ] Add app icon (512x512 PNG)
- [ ] Add screenshots (5+ for each device type)
- [ ] Write app description (compelling & accurate)
- [ ] Add privacy policy URL
- [ ] Set content rating
- [ ] Select category: "Lifestyle"
- [ ] Add contact email

### 2.5 Upload & Submit
- [ ] Upload signed AAB to Play Store Console
- [ ] Review store listing
- [ ] Set release date
- [ ] Submit for review ✅
- [ ] **Expected approval:** 24-48 hours

**Estimated Time:** 3-4 hours (build + console setup)
**Owner:** You

---

## 🍎 Phase 3: iOS Build & App Store (Days 3-5)

### 3.1 Prerequisites
- [ ] Have access to Mac computer
- [ ] Install Xcode latest version
- [ ] Enroll in Apple Developer Program ($99/year)

### 3.2 Build Setup
- [ ] Run: `ionic capacitor build ios`
- [ ] Open Xcode project: `open ios/App/App.xcworkspace`
- [ ] Resolve build errors

### 3.3 Certificates & Provisioning
- [ ] Create iOS App ID in Apple Developer Console
- [ ] Create Development Certificate
- [ ] Create Production Certificate
- [ ] Create Provisioning Profiles (development & distribution)
- [ ] Download and install all certificates

### 3.4 App Store Connect Setup
- [ ] Create new app in App Store Connect
- [ ] Fill in app info (same as Play Store)
- [ ] Add app icon, screenshots, description
- [ ] Set up in-app purchases (if needed)
- [ ] Configure app privacy details

### 3.5 Build & Submit
- [ ] Build release archive in Xcode
- [ ] Upload to TestFlight for testing
- [ ] Test with testers (24-48 hours)
- [ ] Submit for App Store review ✅
- [ ] **Expected approval:** 24-72 hours

**Estimated Time:** 4-5 hours
**Owner:** You (needs Mac)

---

## ✅ Phase 4: Testing Checklist (Before Submission)

### Functionality Testing
- [ ] Login works (email, Google)
- [ ] Gallery: View, like, comment photos
- [ ] Events: View all events, anniversaries show male first
- [ ] Announcements: View and receive notifications
- [ ] Sermons: View list and details
- [ ] Prayers: View and add prayer requests
- [ ] Members: Search and filter members
- [ ] Admin portal: Upload photos, manage content

### Performance Testing
- [ ] App loads in < 3 seconds
- [ ] Gallery images load quickly
- [ ] No crashes on navigation
- [ ] Memory usage is reasonable
- [ ] Battery drain is acceptable

### Firebase Testing
- [ ] Read/write operations work
- [ ] Firestore security rules enforced
- [ ] Authentication required for writes
- [ ] Likes and comments persist
- [ ] Images upload/download correctly

### Network Testing
- [ ] Works on 4G/5G
- [ ] Works on WiFi
- [ ] Handles connection loss gracefully
- [ ] Offline mode works (if implemented)

---

## 📊 Timeline & Dependencies

```
Day 1:   Firebase Security Setup
         ├─ Security rules
         ├─ API keys
         └─ Authentication

Day 2:   Android Build
         ├─ Generate keystore
         ├─ Build APK/AAB
         ├─ Testing
         └─ Play Store submission ✅

Day 3:   iOS Setup (if doing)
         ├─ Xcode build
         ├─ Certificates
         └─ App Store submission ✅

Day 4-5: Review & Approval
         ├─ Play Store review (24-48h)
         └─ App Store review (24-72h)

Day 5+:  LIVE on both stores! 🎉
```

---

## 📝 Important Notes

1. **Credentials:**
   - Store keystore file safely (backup!)
   - Keep Apple Developer credentials secure
   - Never commit sensitive files to GitHub

2. **Versioning:**
   - First release: v1.0.0
   - Increment version for each update
   - Keep changelog updated

3. **Support:**
   - Set up support email in both stores
   - Monitor user reviews & ratings
   - Plan for bug fixes & updates

4. **Analytics:**
   - Monitor Firebase Analytics after launch
   - Track user retention
   - Monitor crash reports

5. **Scaling:**
   - With 100+ users, monitor Firebase costs
   - Consider Cloud Storage for images
   - Set up usage alerts

---

## 🚀 Success Criteria

✅ App is live on Google Play Store
✅ App is live on iOS App Store (optional for Phase 1)
✅ Users can login and use all features
✅ No critical bugs reported
✅ Firebase monitoring shows healthy metrics
✅ Church members are happy! 🎉

---

## 📞 Questions?

Ask Claude before proceeding with each phase!

**Start Date:** Today
**Target Launch:** Within 5 days
