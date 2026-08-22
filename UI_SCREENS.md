# Church Nexus - Mobile App UI Screens

## Overview
This document describes the UI screens built for the Church Nexus mobile app based on the design specifications.

---

## Screens Implemented

### 1. **Dashboard Home** (Main Menu)
- **File**: `lib/screens/home_screen.dart` - `DashboardTab`
- **Description**: Grid-based menu showing all main app features
- **Features**:
  - 8 menu items in 2x4 grid layout
  - Color-coded cards with icons
  - Navigation to each section

**Menu Items**:
- 🤝 Connect
- 📅 Events
- 🎤 Sermons
- ❤️ Prayers
- 💬 Testimonials
- 📢 Announcements
- 🎁 Giving
- 🌐 Website

---

### 2. **Featured Screen**
- **File**: `lib/screens/featured_screen.dart`
- **Description**: Showcase screen with church imagery and Word of the Day
- **Features**:
  - Church building image banner
  - Daily scripture display
  - About Us section
  - Learn More button

---

### 3. **Sermons Screen**
- **File**: `lib/screens/sermons_screen.dart`
- **Description**: Display list of sermons with detailed view
- **Features**:
  - Sermon cards with images
  - Speaker name and date
  - Description preview
  - Tap to view details

**Sermon Details Screen**:
- Full sermon information
- Image gallery
- Watch button
- Share button

---

### 4. **Events Screen**
- **File**: `lib/screens/events_screen.dart`
- **Description**: Calendar view with upcoming events
- **Features**:
  - Interactive calendar
  - Date selection
  - Event list with times
  - Location information

---

### 5. **Testimonials Screen**
- **File**: `lib/screens/testimonials_screen.dart`
- **Description**: Member testimonies and stories
- **Features**:
  - Testimonial cards with images
  - Author name and title
  - Full testimonial text
  - Card-based layout

---

### 6. **Prayer Screen** (Existing)
- **File**: `lib/screens/prayer_screen.dart`
- **Description**: Prayer request submission and viewing

---

## Color Scheme

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary | Dark Purple | #3D3B6C |
| Card Colors | Gradient Colors | Varies |
| Text | Dark Gray | #333333 |
| Accent | Varies by Section | - |

---

## Navigation Structure

```
HomeScreen (Tab Navigation)
├── DashboardTab (Home)
├── FeaturedScreen
├── SermonsScreen
│   └── SermonDetailsScreen
├── EventsScreen
└── PrayerScreen
```

---

## Running the App

### Prerequisites
```bash
cd C:\Users\amaze\projects\church_app
flutter pub get
```

### Update API Configuration
Edit `lib/config/api_config.dart`:
```dart
static const String apiBaseUrl = 'http://YOUR_IP:5678/api';
```

### Run the App
```bash
# Android Emulator
flutter run

# Physical Device
flutter run -d <device_id>
```

---

## Asset Files Required

Create placeholder assets in `assets/` folder:
- `church_building.jpg`
- `sermon1.jpg`
- `sermon2.jpg`
- `testimonial1.jpg`
- `testimonial2.jpg`
- `testimonial3.jpg`

Add to `pubspec.yaml`:
```yaml
flutter:
  assets:
    - assets/
```

---

## Features to Implement

- [ ] Firebase Integration for real data
- [ ] Image uploads for sermons and testimonials
- [ ] Real-time data sync with backend API
- [ ] User authentication
- [ ] Prayer submission form
- [ ] Event RSVP functionality
- [ ] Sermon playback (video/audio)
- [ ] Push notifications
- [ ] Offline mode

---

## Widget Dependencies

- `intl`: Date formatting
- `http`: API calls
- `flutter`: Core widgets

---

## Screen Flow

1. **App Launch** → Dashboard with menu
2. **Select Menu Item** → Navigate to respective screen
3. **Browse Content** → Tap card for details
4. **Details View** → Full information + actions
5. **Back** → Return to previous screen

---

## Customization

### To change colors:
Edit `Color(0xFF3D3B6C)` throughout files to your brand color

### To add new sections:
1. Create new screen file in `lib/screens/`
2. Add to bottom navigation in `home_screen.dart`
3. Import and reference

### To modify layouts:
All screens use standard Flutter widgets:
- `Scaffold`, `AppBar`, `Card`
- `GridView`, `ListView`
- `SingleChildScrollView` for scrolling

---

**UI Design by**: ChurchNexus  
**Implementation Date**: August 2026
