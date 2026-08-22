// Admin Dashboard Functions

function demoLogin() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.admin-container').style.display = 'flex';
    loadEvents();
    loadAnnouncements();
    loadSermons();
    loadPrayers();
    loadMembers();
}

function handleLogin(e) {
    e.preventDefault();
    demoLogin();
}

function logout() {
    document.querySelector('.admin-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (event.target) event.target.classList.add('active');
    if (id === 'events') loadEvents();
    else if (id === 'announcements') loadAnnouncements();
    else if (id === 'sermons') loadSermons();
    else if (id === 'prayers') loadPrayers();
    else if (id === 'members') loadMembers();
}

async function loadEvents() {
    try {
        const snapshot = await db.collection('events').get();
        const tbody = document.getElementById('eventsTable');
        if (snapshot.size === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No events yet</td></tr>';
            return;
        }
        let html = '';
        snapshot.forEach(doc => {
            const e = doc.data();
            html += '<tr><td>' + (e.eventName || '') + '</td><td>' + (e.date || '') + '</td><td>' + (e.location || '') + '</td></tr>';
        });
        tbody.innerHTML = html;
    } catch(err) {
        console.error('Error:', err);
        document.getElementById('eventsTable').innerHTML = '<tr><td colspan="3">Error loading</td></tr>';
    }
}

async function loadAnnouncements() {
    try {
        const snapshot = await db.collection('announcements').get();
        const tbody = document.getElementById('announcementsTable');
        if (snapshot.size === 0) {
            tbody.innerHTML = '<tr><td colspan="2">No announcements yet</td></tr>';
            return;
        }
        let html = '';
        snapshot.forEach(doc => {
            const a = doc.data();
            let content = (a.content || '');
            if (content.length > 50) content = content.substring(0, 50) + '...';
            html += '<tr><td>' + (a.title || '') + '</td><td>' + content + '</td></tr>';
        });
        tbody.innerHTML = html;
    } catch(err) {
        console.error('Error:', err);
        document.getElementById('announcementsTable').innerHTML = '<tr><td colspan="2">Error loading</td></tr>';
    }
}

async function loadSermons() {
    try {
        const snapshot = await db.collection('sermons').get();
        const tbody = document.getElementById('sermonsTable');
        if (snapshot.size === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No sermons yet</td></tr>';
            return;
        }
        let html = '';
        snapshot.forEach(doc => {
            const s = doc.data();
            html += '<tr><td>' + (s.title || '') + '</td><td>' + (s.speaker || '') + '</td><td>' + (s.sermonDate || '') + '</td></tr>';
        });
        tbody.innerHTML = html;
    } catch(err) {
        console.error('Error:', err);
        document.getElementById('sermonsTable').innerHTML = '<tr><td colspan="3">Error loading</td></tr>';
    }
}

async function loadPrayers() {
    try {
        const snapshot = await db.collection('prayers').get();
        const tbody = document.getElementById('prayersTable');
        if (snapshot.size === 0) {
            tbody.innerHTML = '<tr><td colspan="2">No prayers yet</td></tr>';
            return;
        }
        let html = '';
        snapshot.forEach(doc => {
            const p = doc.data();
            let content = (p.content || '');
            if (content.length > 50) content = content.substring(0, 50) + '...';
            html += '<tr><td>' + (p.title || '') + '</td><td>' + content + '</td></tr>';
        });
        tbody.innerHTML = html;
    } catch(err) {
        console.error('Error:', err);
        document.getElementById('prayersTable').innerHTML = '<tr><td colspan="2">Error loading</td></tr>';
    }
}

async function loadMembers() {
    try {
        const snapshot = await db.collection('members').get();
        const tbody = document.getElementById('membersTable');
        if (snapshot.size === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No members yet</td></tr>';
            return;
        }
        let html = '';
        snapshot.forEach(doc => {
            const m = doc.data();
            html += '<tr><td>' + (m.name || '') + '</td><td>' + (m.email || '') + '</td><td>' + (m.phone || '') + '</td><td>' + (m.membershipType || '') + '</td></tr>';
        });
        tbody.innerHTML = html;
    } catch(err) {
        console.error('Error:', err);
        document.getElementById('membersTable').innerHTML = '<tr><td colspan="4">Error loading</td></tr>';
    }
}

// Modal Functions
function openEventForm() {
    document.getElementById('eventModal').style.display = 'flex';
}

function closeEventForm() {
    document.getElementById('eventModal').style.display = 'none';
}

function openAnnouncementForm() {
    document.getElementById('announcementModal').style.display = 'flex';
}

function closeAnnouncementForm() {
    document.getElementById('announcementModal').style.display = 'none';
}

function openSermonForm() {
    document.getElementById('sermonModal').style.display = 'flex';
}

function closeSermonForm() {
    document.getElementById('sermonModal').style.display = 'none';
}

function openPrayerForm() {
    document.getElementById('prayerModal').style.display = 'flex';
}

function closePrayerForm() {
    document.getElementById('prayerModal').style.display = 'none';
}

function openMemberForm() {
    document.getElementById('memberModal').style.display = 'flex';
}

function closeMemberForm() {
    document.getElementById('memberModal').style.display = 'none';
}

// Save Functions
async function saveEvent() {
    const name = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value;
    if (!name || !date) {
        alert('Name and date required');
        return;
    }
    try {
        await db.collection('events').add({eventName: name, date: date, location: location, createdAt: new Date()});
        alert('Event saved!');
        closeEventForm();
        document.getElementById('eventName').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventLocation').value = '';
        loadEvents();
    } catch(err) {
        alert('Error: ' + err.message);
    }
}

async function saveAnnouncement() {
    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;
    if (!title || !content) {
        alert('Title and content required');
        return;
    }
    try {
        await db.collection('announcements').add({title: title, content: content, createdAt: new Date()});
        alert('Announcement saved!');
        closeAnnouncementForm();
        document.getElementById('announcementTitle').value = '';
        document.getElementById('announcementContent').value = '';
        loadAnnouncements();
    } catch(err) {
        alert('Error: ' + err.message);
    }
}

async function saveSermon() {
    const title = document.getElementById('sermonTitle').value;
    const speaker = document.getElementById('sermonSpeaker').value;
    const date = document.getElementById('sermonDate').value;
    const description = document.getElementById('sermonDescription').value;
    if (!title || !speaker || !date) {
        alert('Title, speaker, and date required');
        return;
    }
    try {
        await db.collection('sermons').add({title: title, speaker: speaker, sermonDate: date, description: description, createdAt: new Date()});
        alert('Sermon saved!');
        closeSermonForm();
        document.getElementById('sermonTitle').value = '';
        document.getElementById('sermonSpeaker').value = '';
        document.getElementById('sermonDate').value = '';
        document.getElementById('sermonDescription').value = '';
        loadSermons();
    } catch(err) {
        alert('Error: ' + err.message);
    }
}

async function savePrayer() {
    const title = document.getElementById('prayerTitle').value;
    const content = document.getElementById('prayerContent').value;
    if (!title || !content) {
        alert('Title and content required');
        return;
    }
    try {
        await db.collection('prayers').add({title: title, content: content, createdAt: new Date()});
        alert('Prayer saved!');
        closePrayerForm();
        document.getElementById('prayerTitle').value = '';
        document.getElementById('prayerContent').value = '';
        loadPrayers();
    } catch(err) {
        alert('Error: ' + err.message);
    }
}

async function saveMember() {
    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;
    const phone = document.getElementById('memberPhone').value;
    const type = document.getElementById('memberType').value;
    const dob = document.getElementById('memberDOB').value;
    const baptism = document.getElementById('memberBaptism').value;
    const address = document.getElementById('memberAddress').value;
    if (!name) {
        alert('Member name required');
        return;
    }
    try {
        await db.collection('members').add({name: name, email: email, phone: phone, membershipType: type, dateOfBirth: dob, baptismStatus: baptism, address: address, createdAt: new Date()});
        alert('Member saved!');
        closeMemberForm();
        document.getElementById('memberName').value = '';
        document.getElementById('memberEmail').value = '';
        document.getElementById('memberPhone').value = '';
        document.getElementById('memberType').value = '';
        document.getElementById('memberDOB').value = '';
        document.getElementById('memberBaptism').value = '';
        document.getElementById('memberAddress').value = '';
        loadMembers();
    } catch(err) {
        alert('Error: ' + err.message);
    }
}
