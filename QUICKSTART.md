# Quick Start Guide - 5 Minutes to Running App

## Step 1: Clone Repository
```bash
cd C:\Users\amaze\projects\church_app
```

## Step 2: Install Flutter (if not installed)
```bash
# Windows - download from https://flutter.dev/docs/get-started/install/windows
# Or use chocolatey:
choco install flutter

# Verify installation
flutter doctor
```

## Step 3: Setup Firebase (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Create a project"**
3. Name it: `ChurchApp`
4. Click **"Add app"** → Select **Android**
5. Package name: `com.church.app`
6. Register app, then **download** `google-services.json`
7. Place file at: `church_app/android/app/google-services.json`

That's it for Firebase setup!

## Step 4: Run the App
```bash
cd church_app
flutter pub get
flutter run
```

**If you see errors:**
```bash
flutter clean
flutter pub get
flutter run
```

## Step 5: Test the App

1. **Sign Up**: Create account with any email
2. **Explore**: Tap through the navigation tabs
3. **Add Prayer**: Click prayer tab → click + button
4. **View Events**: Events tab (empty until you add data)

## Add Test Data (Optional)

In Firebase Console → Firestore Database → **+ Add Collection**

### Add Sample Event

1. Collection: `events`
2. Document: `event1`
3. Add fields:
   ```
   id: event1
   title: Sunday Service
   description: Join us for our weekly worship
   location: 123 Main St, Church City
   startTime: 2026-08-24 10:00 AM
   endTime: 2026-08-24 11:30 AM
   imageUrl: [leave empty]
   ```

### Add Sample Sermon

1. Collection: `sermons`
2. Document: `sermon1`
3. Add fields:
   ```
   id: sermon1
   title: Love Your Neighbor
   speaker: Pastor John
   description: A powerful message about loving our neighbors
   date: 2026-08-17 10:15 AM
   videoUrl: [leave empty for now]
   audioUrl: [leave empty for now]
   ```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Google services not found" | Check `google-services.json` is in `android/app/` |
| "Build failed" | Run `flutter clean && flutter pub get` |
| "Cannot find flutter" | Add Flutter to PATH (see flutter.dev/install) |
| "No devices found" | Start Android emulator or connect phone via USB |
| "Permission denied" | Enable Developer Mode on phone & check USB debugging |

## Next: Connect to Website Backend

After getting the app running, check `../church_website/` for backend setup.

## Still Need Help?

1. See full setup: [SETUP.md](SETUP.md)
2. See project details: [README.md](README.md)
3. Flutter help: https://flutter.dev/docs/get-started

---

**You're done! The app is running.** 🎉
