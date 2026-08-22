// Initialize - hide all screens except home
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing screens...');
    const screens = document.querySelectorAll('.screen');
    console.log('Found screens:', screens.length);
    screens.forEach(s => {
        if (!s.classList.contains('active')) {
            s.style.display = 'none';
        }
    });
    updateDailyVerse();
});

// Navigation Functions
function showScreen(id) {
    console.log('Showing screen:', id);
    const screens = document.querySelectorAll('.screen');
    console.log('Total screens found:', screens.length);
    screens.forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) {
        screen.classList.add('active');
        console.log('Screen displayed:', id);
        if (id === 'announcements') {
            loadAnnouncementsRealtime();
        }
    } else {
        console.error('Screen not found:', id);
    }
}

function switchTab(index, element) {
    console.log('Tab clicked:', index);
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    const screens = ['home', 'featured', 'sermons', 'events', 'members', 'offering'];
    console.log('Switching to screen:', screens[index]);
    showScreen(screens[index]);
    if (index === 2) loadSermonsRealtime();
    if (index === 4) {
        console.log('Members tab clicked, loading members...');
        loadMembersRealtime();
    }
}

function goBack() {
    showScreen('featured');
    document.querySelectorAll('.nav-item')[1].click();
}

// Member Details Modal
function showMemberDetails(name, email, phone, type, baptism) {
    document.getElementById('modalMemberName').textContent = name;
    document.getElementById('modalMemberType').textContent = type;
    document.getElementById('modalMemberEmail').textContent = email;
    document.getElementById('modalMemberPhone').textContent = phone;
    document.getElementById('modalMemberBaptism').textContent = baptism;
    document.getElementById('memberModal').classList.add('active');
}

function closeMemberModal() {
    document.getElementById('memberModal').classList.remove('active');
}

// Load Members
async function loadMembersRealtime() {
    const membersList = document.getElementById('membersList');
    if (!membersList) return;

    let html = '';
    let hasData = false;

    try {
        const snapshot = await db.collection('members').limit(10).get();
        if (snapshot.size > 0) {
            hasData = true;
            snapshot.forEach(doc => {
                const m = doc.data();
                const name = m.name || 'Member';
                const type = m.membershipType || 'Member';
                const email = m.email || 'N/A';
                const phone = m.phone || 'N/A';
                const baptism = m.baptismStatus || 'N/A';
                const initial = name.charAt(0).toUpperCase();

                html += '<div class="member-item" onclick="showMemberDetails(\'' + name + '\', \'' + email + '\', \'' + phone + '\', \'' + type + '\', \'' + baptism + '\')">';
                html += '<div class="member-avatar">' + initial + '</div>';
                html += '<div class="member-info">';
                html += '<div class="member-name">' + name + '</div>';
                html += '<div class="member-type">' + type + '</div>';
                html += '</div></div>';
            });
        }
    } catch (error) {
        console.log('Error:', error.message);
    }

    // Demo members if no data
    if (!hasData) {
        const demo = [
            { name: 'Samuel Daniel', membershipType: 'Member', email: 'samuel@church.com', phone: '555-0001', baptismStatus: 'Baptized' },
            { name: 'Sarah Johnson', membershipType: 'Member', email: 'sarah@church.com', phone: '555-0002', baptismStatus: 'Baptized' },
            { name: 'John Davis', membershipType: 'Member', email: 'john@church.com', phone: '555-0003', baptismStatus: 'Baptized' },
            { name: 'Maria Garcia', membershipType: 'Fellowship', email: 'maria@church.com', phone: '555-0004', baptismStatus: 'Non-baptized' },
            { name: 'Emily Chen', membershipType: 'Associate', email: 'emily@church.com', phone: '555-0005', baptismStatus: 'Non-baptized' }
        ];

        html = demo.map(m => {
            const initial = m.name.charAt(0).toUpperCase();
            return '<div class="member-item" onclick="showMemberDetails(\'' + m.name + '\', \'' + m.email + '\', \'' + m.phone + '\', \'' + m.membershipType + '\', \'' + m.baptismStatus + '\')">' +
                '<div class="member-avatar">' + initial + '</div>' +
                '<div class="member-info">' +
                '<div class="member-name">' + m.name + '</div>' +
                '<div class="member-type">' + m.membershipType + '</div>' +
                '</div></div>';
        }).join('');
    }

    membersList.innerHTML = html;
}

// Bible Verse Rotation
const bibleVerses = [
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", ref: "John 3:16" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", ref: "Proverbs 3:5-6" },
    { text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?", ref: "Psalm 27:1" },
    { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" },
    { text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", ref: "Jeremiah 29:11" }
];

function updateDailyVerse() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const verseIndex = dayOfYear % bibleVerses.length;
    const verse = bibleVerses[verseIndex];
    document.getElementById('verseText').textContent = '"' + verse.text + '"';
    document.getElementById('verseRef').textContent = verse.ref;
}

// Load Announcements
async function loadAnnouncementsRealtime() {
    const announcementsList = document.getElementById('announcementsList');
    if (!announcementsList) return;

    try {
        console.log('Loading announcements from Firebase...');
        const snapshot = await db.collection('announcements').get();
        console.log('Announcements found:', snapshot.size);

        if (snapshot.size > 0) {
            let html = '';
            snapshot.forEach(doc => {
                const a = doc.data();
                const title = a.title || a.announcementTitle || 'Announcement';
                const content = a.content || a.announcementContent || '';
                let date = 'Today';
                if (a.createdAt) date = new Date(a.createdAt.seconds * 1000).toLocaleDateString();
                else if (a.date) date = a.date;

                html += '<div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 12px;">';
                html += '<div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 4px;">' + title + '</div>';
                html += '<div style="font-size: 12px; color: #999; margin-bottom: 8px;">' + date + '</div>';
                html += '<div style="font-size: 14px; color: #666; line-height: 1.5;">' + content + '</div>';
                html += '</div>';
            });
            announcementsList.innerHTML = html;
        } else {
            announcementsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No announcements yet</div>';
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
        announcementsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error: ' + error.message + '</div>';
    }
}

// Load Events
async function loadEventsRealtime() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;
    try {
        console.log('Loading events from Firebase...');
        const snapshot = await db.collection('events').get();
        console.log('Events found:', snapshot.size);
        if (snapshot.size > 0) {
            let html = '';
            snapshot.forEach(doc => {
                const e = doc.data();
                const title = e.eventName || e.title || 'Event';
                const date = e.date || e.eventDate || e.Date || 'TBD';
                const location = e.location || e.Location || '';
                const description = e.description || e.Description || '';
                html += '<div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 12px;">';
                html += '<div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 4px;">' + title + '</div>';
                html += '<div style="font-size: 12px; color: #999; margin-bottom: 4px;">📅 ' + date + '</div>';
                if (location) html += '<div style="font-size: 12px; color: #999; margin-bottom: 8px;">📍 ' + location + '</div>';
                if (description) html += '<div style="font-size: 14px; color: #666;">' + description + '</div>';
                html += '</div>';
            });
            eventsList.innerHTML = html;
        } else {
            eventsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No events scheduled</div>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        eventsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error: ' + error.message + '</div>';
    }
}

// Load Sermons
async function loadSermonsRealtime() {
    const sermonsList = document.getElementById('sermonsList');
    if (!sermonsList) return;
    try {
        const snapshot = await db.collection('sermons').orderBy('sermonDate', 'desc').get();
        if (snapshot.size > 0) {
            let html = '';
            snapshot.forEach(doc => {
                const s = doc.data();
                const title = s.title || 'No title';
                const speaker = s.speaker || 'Unknown speaker';
                const date = s.sermonDate || 'No date';
                const description = s.description || '';
                html += '<div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 12px;">';
                html += '<div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 4px;">' + title + '</div>';
                html += '<div style="font-size: 12px; color: #999; margin-bottom: 4px;">Speaker: ' + speaker + '</div>';
                html += '<div style="font-size: 12px; color: #999; margin-bottom: 8px;">Date: ' + date + '</div>';
                html += '<div style="font-size: 14px; color: #666;">' + description + '</div>';
                html += '</div>';
            });
            sermonsList.innerHTML = html;
        } else {
            sermonsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No sermons available</div>';
        }
    } catch (error) {
        console.error('Error loading sermons:', error);
        sermonsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error loading sermons</div>';
    }
}

// Load Prayers
async function loadPrayerRealtime() {
    const prayerList = document.getElementById('prayerList');
    if (!prayerList) return;
    try {
        const snapshot = await db.collection('prayers').orderBy('createdAt', 'desc').limit(20).get();
        if (snapshot.size > 0) {
            let html = '';
            snapshot.forEach(doc => {
                const p = doc.data();
                const title = p.title || 'Prayer Request';
                const content = p.content || '';
                const date = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : 'No date';
                html += '<div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 12px;">';
                html += '<div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 4px;">' + title + '</div>';
                html += '<div style="font-size: 12px; color: #999; margin-bottom: 8px;">' + date + '</div>';
                html += '<div style="font-size: 14px; color: #666;">' + content + '</div>';
                html += '</div>';
            });
            prayerList.innerHTML = html;
        } else {
            prayerList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No prayer requests</div>';
        }
    } catch (error) {
        console.error('Error loading prayers:', error);
        prayerList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error loading prayers</div>';
    }
}

// Load Offering
async function loadOfferingRealtime() {
    const offeringContent = document.getElementById('offeringContent');
    if (!offeringContent) return;
    try {
        const snapshot = await db.collection('offerings').doc('info').get();
        if (snapshot.exists) {
            const data = snapshot.data();
            let html = '<div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px;">';
            html += '<div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 12px;">Giving Information</div>';
            html += '<div style="font-size: 14px; color: #666; line-height: 1.6;">' + (data.description || 'Information coming soon...') + '</div>';
            html += '</div>';
            offeringContent.innerHTML = html;
        } else {
            offeringContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Giving information coming soon</div>';
        }
    } catch (error) {
        console.error('Error loading offering info:', error);
        offeringContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error loading information</div>';
    }
}
