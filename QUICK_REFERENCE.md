# 🚀 Quick Reference Guide

## 🔗 Live URLs (After Deployment)

```
Admin Portal:  https://church-nexus-admin.vercel.app
Member App:    https://church-nexus-app.vercel.app
Backend API:   https://church-nexus-api.onrender.com
Firebase:      churchapp-74dec.firebaseapp.com
```

## 🔐 Firebase Credentials

```
Project: churchapp-74dec
API Key: AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g
Collections: announcements, sermons, events, prayers, users
```

## 📱 Local URLs (Development)

```
Admin:  http://localhost:8000/admin-portal.html
App:    http://localhost:8000/index.html
```

## 🎯 Admin Tasks

| Task | Steps |
|------|-------|
| Add Announcement | Portal → From the Pastor → Fill form → Add |
| Add Sermon | Portal → Sermons → Fill form + optional voice → Add |
| Record Voice | Start Recording → Speak → Stop → Preview → Add |
| Upload Audio | Select file → Preview → Add |
| Delete Item | Portal → View item → Click Delete |

## 📲 Member Features

| Feature | Location |
|---------|----------|
| Announcements | From the Pastor button |
| Sermons | Sermons tab (+ voice notes) |
| Events | Events tab |
| Prayers | Prayer tab |
| Giving | Offering tab |

## ⏰ Voice Notes

- **Duration:** 60 days
- **Format:** Audio/wav or MP3
- **Storage:** Firebase Firestore
- **Display:** Countdown timer
- **Expires:** Auto-delete after 60 days

## 🔄 Real-time Sync

Updates appear **instantly** in:
- Member app
- Mobile app
- All devices

**No refresh needed!**

## 📊 Collections

```
announcements  → From the Pastor announcements
sermons        → Sermons with voice notes
events         → Church events
prayers        → Prayer requests
users          → Member accounts
```

## 🛠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| Sermons not showing | Ctrl+F5 (hard refresh) |
| Voice not playing | Try MP3 format |
| Not syncing | Check Firebase status |
| Admin won't load | Verify internet connection |

## 📧 Firebase Console

**Access:** https://console.firebase.google.com
**Project:** churchapp-74dec
**Collections:** Firestore → Data tab

## 🚀 Deployment Steps

```bash
# 1. Deploy Member App
cd C:\Users\amaze\projects\church_app
vercel --prod --name church-nexus-app

# 2. Deploy Admin Portal
vercel --prod --name church-nexus-admin

# 3. Deploy Backend (after GitHub push)
# Connect to Render.com and deploy
```

## 💾 Backup

**Automatic:** Firebase handles daily backups
**Manual:** Firestore → Export Collection

## 📈 Monitoring

- **Member App:** Vercel analytics
- **Admin Portal:** Vercel analytics
- **Backend:** Render dashboard
- **Database:** Firebase console

## 🔐 Security

### Current: Test Mode
- Allow all reads/writes
- Good for development

### Production Mode
```
- Enable authentication
- Restrict writes
- Enable HTTPS
- Set up backups
```

## 📞 Support

| Issue | Where |
|-------|-------|
| Firebase | https://console.firebase.google.com |
| Vercel | https://vercel.com/dashboard |
| Render | https://render.com |
| Code | Check browser console (F12) |

## ✅ Configuration Files

```
COMPLETE_SYSTEM_CONFIG.md  → Full documentation
FIREBASE_CONFIG.md         → Firebase setup
DEPLOYMENT_GUIDE.md        → Deployment steps
QUICK_REFERENCE.md         → This file
```

## 🎯 Quick Start

1. **Admin:** `http://localhost:8000/admin-portal.html`
2. **Click:** "Demo Access"
3. **Add Content:** Announcements or Sermons
4. **Check Member App:** `http://localhost:8000/index.html`
5. **See Real-time Sync:** ✅ Instant!

## 🎤 Voice Notes Quick Start

1. Go to admin portal
2. Click "Sermons"
3. Click "Start Recording"
4. Speak into microphone
5. Click "Stop Recording"
6. Preview plays
7. Fill sermon details
8. Click "Add Sermon"
9. **Member sees:** Audio player + countdown timer

---

**Everything is configured and ready to deploy!** 🚀
