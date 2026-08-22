# Church App - Mobile + Admin Portal

Professional church management system with mobile app and admin dashboard.

## Project Structure

```
church_app/
├── index.html              # Mobile app main page
├── admin-portal.html       # Admin dashboard
├── css/
│   ├── mobile.css         # Mobile app styles
│   └── admin.css          # Admin portal styles
├── js/
│   ├── firebase-config.js # Firebase configuration (shared)
│   ├── mobile-app.js      # Mobile app logic
│   └── admin-app.js       # Admin dashboard logic
├── README.md
└── .gitignore
```

## Features

### Mobile App (localhost:8000/index.html)
- Home screen with daily Bible verse
- Menu with feature cards (Announcements, Events, Sermons, Bible Study, Prayers, Offering)
- Members directory with details modal
- Real-time sync with Firebase

### Admin Portal (localhost:8000/admin-portal.html)
- Demo login (click "Demo Access")
- Manage Announcements
- Manage Events
- Manage Sermons
- Manage Prayer Requests
- Manage Members
- Real-time Firestore sync

## Setup

### 1. Clone & Start
```bash
cd C:\Users\amaze\projects\church_app
git init
git add .
git commit -m "Initial commit"
```

### 2. Deploy to Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. Or Deploy to Netlify (Free)
- Connect your GitHub repo to Netlify
- Auto-deploys on push

## Database (Firebase)
- Project: churchapp-74dec
- Collections: events, announcements, sermons, prayers, members
- Firestore Rules: Public read/write

## Local Development
```bash
# Serve locally (Python)
python -m http.server 8000

# Then open:
# Mobile: http://localhost:8000/index.html
# Admin: http://localhost:8000/admin-portal.html
```

## Architecture Benefits
✅ **Separation of Concerns** - CSS, JS, HTML are separate  
✅ **Git Version Control** - Track all changes  
✅ **No Corruption** - Can't break multiple files with single edit  
✅ **Scalable** - Easy to add new features  
✅ **Free Hosting** - Vercel/Netlify + Firebase  

## Next Steps
1. Push to GitHub
2. Connect to Vercel/Netlify for auto-deployment
3. Share public link with your team
