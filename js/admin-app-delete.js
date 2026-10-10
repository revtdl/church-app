// ===== DELETE FUNCTIONS FOR ADMIN PORTAL =====

// Delete Announcement
async function deleteAnnouncement(id) {
    if (!confirm('❌ Are you sure you want to delete this announcement?')) {
        return;
    }
    try {
        await db.collection('announcements').doc(id).delete();
        alert('✅ Announcement deleted!');
        loadAnnouncements();
    } catch (error) {
        alert('❌ Error deleting announcement: ' + error.message);
    }
}

// Delete Event
async function deleteEvent(id) {
    if (!confirm('❌ Are you sure you want to delete this event?')) {
        return;
    }
    try {
        await db.collection('events').doc(id).delete();
        alert('✅ Event deleted!');
        loadEvents();
    } catch (error) {
        alert('❌ Error deleting event: ' + error.message);
    }
}

// Delete Sermon
async function deleteSermon(id) {
    if (!confirm('❌ Are you sure you want to delete this sermon?')) {
        return;
    }
    try {
        await db.collection('sermons').doc(id).delete();
        alert('✅ Sermon deleted!');
        loadSermons();
    } catch (error) {
        alert('❌ Error deleting sermon: ' + error.message);
    }
}

// Delete Prayer
async function deletePrayer(id) {
    if (!confirm('❌ Are you sure you want to delete this prayer request?')) {
        return;
    }
    try {
        await db.collection('prayers').doc(id).delete();
        alert('✅ Prayer request deleted!');
        loadPrayers();
    } catch (error) {
        alert('❌ Error deleting prayer: ' + error.message);
    }
}

// Delete Registered Member (from registrations collection)
async function deleteRegistration(registrationId, memberName) {
    if (!confirm(`❌ Are you sure you want to delete ${memberName}'s registration? This action cannot be undone.`)) {
        return;
    }
    try {
        console.log('🗑️ Deleting registration:', registrationId);
        await db.collection('registrations').doc(registrationId).delete();
        console.log('✅ Registration deleted successfully');
        alert('✅ Registration deleted!');

        // Reload registered members list - with fallback to page reload
        setTimeout(() => {
            if (typeof loadRegisteredMembers === 'function') {
                console.log('Reloading registered members...');
                loadRegisteredMembers();
            } else {
                console.log('loadRegisteredMembers not found, reloading page');
                location.reload();
            }
        }, 500);
    } catch (error) {
        console.error('❌ Error deleting registration:', error);
        alert('❌ Error deleting registration: ' + error.message);
    }
}
