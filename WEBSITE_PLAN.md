# Church App - Website Admin Panel Plan

## **Project Overview**

**Full Church Management System:**
- ✅ **Mobile App** (Flutter) - Members view content
- 🔨 **Website Admin Panel** (React) - Admins manage content
- 📊 **Firebase Backend** - Real-time database
- 🔗 **Connected** - App & Website sync seamlessly

---

## **Phase 1: Website Setup** (This Week)

### **Technology Stack**
- **Frontend**: React.js with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Hosting**: Vercel or Firebase Hosting
- **Package Manager**: npm

### **Project Structure**
```
church_website/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Events.tsx
│   │   ├── Sermons.tsx
│   │   ├── Prayers.tsx
│   │   ├── Users.tsx
│   │   └── Login.tsx
│   ├── services/           # Firebase services
│   │   └── firebase.ts
│   ├── styles/             # CSS/Styling
│   └── App.tsx
├── public/
├── package.json
└── .env                    # Firebase config
```

---

## **Phase 2: Admin Dashboard Features**

### **1. Authentication**
- ✅ Admin login (email/password)
- ✅ Role-based access control
- ✅ Session management
- ✅ Logout

### **2. Events Management**
- ✅ Create new events
- ✅ Edit events
- ✅ Delete events
- ✅ Upload event images
- ✅ View attendees
- ✅ Calendar view

### **3. Sermons Management**
- ✅ Upload sermons
- ✅ Add sermon details
- ✅ Upload video/audio
- ✅ Edit sermon info
- ✅ Delete sermons
- ✅ View analytics

### **4. Prayer Requests**
- ✅ View all prayers
- ✅ Mark as answered
- ✅ Delete prayers
- ✅ Prayer analytics
- ✅ Export prayers

### **5. User Management**
- ✅ View all users
- ✅ Add admin users
- ✅ Remove users
- ✅ View user activity
- ✅ Send notifications

### **6. Dashboard**
- ✅ Statistics (users, events, prayers)
- ✅ Recent activities
- ✅ Quick actions
- ✅ Analytics charts

---

## **Phase 3: Integration**

### **Connect App to Website**
- ✅ App reads from Firestore
- ✅ Website writes to Firestore
- ✅ Real-time sync
- ✅ Push notifications

---

## **Timeline**

| Phase | Task | Timeline |
|-------|------|----------|
| 1 | Website setup & authentication | 2 days |
| 2 | Admin dashboard UI | 2 days |
| 3 | Events management | 1 day |
| 4 | Sermons management | 1 day |
| 5 | Prayers management | 1 day |
| 6 | Users management | 1 day |
| 7 | Firebase integration | 2 days |
| 8 | Testing & deployment | 2 days |
| **Total** | | **~2 weeks** |

---

## **Database Schema**

### **Firestore Collections**

```javascript
// users/
{
  id: string
  name: string
  email: string
  photoUrl: string
  joinedDate: timestamp
  role: "admin" | "member"
  status: "active" | "inactive"
}

// events/
{
  id: string
  title: string
  description: string
  startTime: timestamp
  endTime: timestamp
  location: string
  imageUrl: string
  attendees: number
  createdBy: string (userId)
  createdAt: timestamp
}

// sermons/
{
  id: string
  title: string
  speaker: string
  description: string
  date: timestamp
  videoUrl: string
  audioUrl: string
  imageUrl: string
  views: number
  uploadedBy: string (userId)
  createdAt: timestamp
}

// prayer_requests/
{
  id: string
  userId: string
  title: string
  description: string
  createdAt: timestamp
  prayerCount: number
  answered: boolean
  answeredDate: timestamp
  status: "open" | "answered"
}
```

---

## **Next Steps**

1. ✅ Create React project
2. ✅ Setup Firebase integration
3. ✅ Build authentication
4. ✅ Create admin dashboard
5. ✅ Build CRUD operations for each module
6. ✅ Connect to app via Firebase
7. ✅ Test end-to-end
8. ✅ Deploy

---

## **Cost**

- **Firebase**: FREE (covered by existing setup)
- **Hosting**: FREE (Vercel or Firebase Hosting)
- **Domain**: $10-15/year
- **Total**: **~$10-15/year** 🎉

---

## **Success Criteria**

✅ Admin can login securely
✅ Admin can manage all content
✅ App syncs data in real-time
✅ Beautiful admin dashboard
✅ Mobile responsive
✅ Fast performance
✅ Easy to use

---

**Let's build it!** 🚀
