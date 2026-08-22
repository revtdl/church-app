# Church App - Setup Instructions

## Project Structure
```
church_app/
├── lib/
│   ├── main.dart                 # App entry point
│   ├── models/
│   │   └── models.dart          # Data models (Event, Sermon, Prayer Request, User)
│   ├── services/
│   │   └── firebase_service.dart # Firebase configuration & methods
│   └── screens/
│       ├── home_screen.dart      # Home & navigation
│       ├── events_screen.dart    # Events listing
│       ├── sermons_screen.dart   # Sermons listing
│       ├── prayer_screen.dart    # Prayer requests
│       ├── profile_screen.dart   # User profile
│       └── auth_screen.dart      # Login/Sign up
├── android/                      # Android configuration
├── pubspec.yaml                  # Dependencies
└── README.md                      # Project documentation
```

## Prerequisites
- Flutter SDK (v3.12+) - [Install Flutter](https://flutter.dev/docs/get-started/install)
- Android Studio with Android SDK
- Google Account (for Firebase)
- IDE: VS Code, Android Studio, or IntelliJ IDEA

## Step 1: Setup Flutter

```bash
# Check Flutter installation
flutter doctor

# Upgrade Flutter
flutter upgrade
```

## Step 2: Setup Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: "ChurchApp"
4. Enable Google Analytics (optional)
5. Create project

## Step 3: Add Firebase to Android

1. In Firebase Console, click **Add app** → **Android**
2. Enter package name: `com.church.app`
3. Download `google-services.json`
4. Place it in: `church_app/android/app/`

## Step 4: Setup Firebase Services

### In Firebase Console:

**Authentication:**
- Go to Authentication → Sign-in method
- Enable Email/Password

**Firestore Database:**
- Create Cloud Firestore database
- Choose production mode (we'll add security rules later)
- Select region closest to you

**Storage:**
- Create Cloud Storage bucket
- Use default bucket name

## Step 5: Clone Dependencies

```bash
cd church_app
flutter pub get
```

## Step 6: Generate Firebase Configuration (Android)

Edit `android/build.gradle` and ensure Google Services plugin is added:

```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
}
```

Edit `android/app/build.gradle` and add at the end:

```gradle
apply plugin: 'com.google.gms.google-services'
```

## Step 7: Update Firebase Security Rules

In Firebase Console → Firestore Database → Rules, paste:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /events/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /sermons/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /prayer_requests/{document=**} {
      allow read, create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 8: Run the App

```bash
# Connect Android device or start emulator
flutter emulators --launch emulator_name

# Run app
flutter run

# Or specific device
flutter run -d device_id
```

## Step 9: Test the App

1. **Sign Up**: Create account with email and password
2. **Home Screen**: View upcoming events and latest sermon
3. **Events Tab**: Browse all church events
4. **Sermons Tab**: View all sermons (with video/audio when available)
5. **Prayer Tab**: Add and view prayer requests, mark as praying
6. **Profile Tab**: View user info and sign out

## Features Included

✅ User Authentication (Email/Password)
✅ Event Management
✅ Sermon Listings
✅ Prayer Request System
✅ User Profiles
✅ Real-time Updates with Firestore
✅ Bottom Navigation
✅ Beautiful Material UI

## Building for Play Store

```bash
# Create keystore (one time)
keytool -genkey -v -keystore ~/church-app-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias church-app

# Create key.properties file
# android/key.properties:
storePassword=<your-password>
keyPassword=<your-password>
keyAlias=church-app
storeFile=<absolute-path-to-key.jks>

# Build APK
flutter build apk --release

# Build App Bundle (for Play Store)
flutter build appbundle --release

# APK location: build/app/outputs/apk/release/app-release.apk
# AAB location: build/app/outputs/bundle/release/app-release.aab
```

## Next Steps

1. **Add Admin Panel**: Create admin user to manage events/sermons
2. **Add Donations**: Integrate payment gateway (Stripe)
3. **Add Notifications**: Enable Firebase Cloud Messaging
4. **Media Upload**: Allow uploading sermon videos/audio
5. **iOS Support**: Configure for App Store
6. **Testing**: Write unit and integration tests

## Troubleshooting

**Firebase not initializing:**
- Check `google-services.json` is in correct location
- Verify Firebase project settings match package name

**Build errors:**
```bash
flutter clean
flutter pub get
flutter run
```

**Authentication issues:**
- Enable Email/Password in Firebase Console
- Check Firestore security rules

## Support
For issues, check:
- [Flutter Documentation](https://flutter.dev/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase for Flutter](https://firebase.flutter.dev/)

Happy coding! 🙏
