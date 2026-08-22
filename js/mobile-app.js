// Member Authentication
let currentMember = null;

// Member Database (In production, use Firebase)
const MEMBER_DATABASE = {
    '9999999999': { password: 'member123', name: 'John Doe' },
    '8888888888': { password: 'member123', name: 'Jane Smith' },
    '7777777777': { password: 'member123', name: 'David Johnson' }
};

function handleMobileLogin() {
    const phone = document.getElementById('memberPhone').value;
    const password = document.getElementById('memberPassword').value;
    const errorDiv = document.getElementById('mobileLoginError');

    if (!phone || !password) {
        errorDiv.textContent = '❌ Please enter phone and password';
        errorDiv.style.display = 'block';
        return;
    }

    // Check credentials
    if (MEMBER_DATABASE[phone] && MEMBER_DATABASE[phone].password === password) {
        // Login successful
        currentMember = {
            phone: phone,
            name: MEMBER_DATABASE[phone].name,
            loginTime: new Date()
        };

        localStorage.setItem('memberUser', JSON.stringify(currentMember));
        showApp();
        errorDiv.style.display = 'none';
    } else {
        errorDiv.textContent = '❌ Invalid phone or password';
        errorDiv.style.display = 'block';
    }
}

function guestLogin() {
    currentMember = {
        phone: 'guest',
        name: 'Guest User',
        loginTime: new Date()
    };

    localStorage.setItem('memberUser', JSON.stringify(currentMember));
    showApp();
}

function logoutMember() {
    if (confirm('Are you sure you want to logout?')) {
        currentMember = null;
        localStorage.removeItem('memberUser');
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('memberPhone').value = '';
        document.getElementById('memberPassword').value = '';
    }
}

function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    initializeApp();
}

function checkMemberLogin() {
    const savedMember = localStorage.getItem('memberUser');
    if (savedMember) {
        currentMember = JSON.parse(savedMember);
        showApp();
    }
}

function showMemberMenu() {
    alert('Welcome, ' + (currentMember?.name || 'Guest') + '!');
}

function initializeApp() {
    console.log('App initialized for:', currentMember?.name);

    // Sign in anonymously to enable Firebase access
    firebase.auth().signInAnonymously().then(() => {
        console.log('Auth success - user logged in');
        setTimeout(() => {
            loadEventsRealtime();
            loadSermonsRealtime();
        }, 1000);
    }).catch(error => {
        console.error('Auth error:', error);
    });

    const screens = document.querySelectorAll('.screen');
    console.log('Found screens:', screens.length);
    screens.forEach(s => {
        if (!s.classList.contains('active')) {
            s.style.display = 'none';
        }
    });
    updateDailyVerse();
}

// Check login on page load
document.addEventListener('DOMContentLoaded', function() {
    checkMemberLogin();
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
        } else if (id === 'prayers') {
            loadPrayerRealtime();
        }
    } else {
        console.error('Screen not found:', id);
    }
}

function switchTab(index, element) {
    console.log('Tab clicked:', index);
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    const screens = ['home', 'featured', 'members', 'offering'];
    console.log('Switching to screen:', screens[index]);
    showScreen(screens[index]);
    if (index === 2) {
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

// Load Announcements with Real-time Sync
function loadAnnouncementsRealtime() {
    const announcementsList = document.getElementById('announcementsList');
    if (!announcementsList) return;

    console.log('Setting up real-time announcements listener...');
    announcementsList.innerHTML = 'Loading announcements...';

    try {
        db.collection('announcements').orderBy('createdAt', 'desc').onSnapshot(
            (snapshot) => {
                console.log('Announcements snapshot received:', snapshot.size);
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
            },
            (error) => {
                console.error('Error loading announcements:', error);
                announcementsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error: ' + error.message + '</div>';
            }
        );
    } catch (error) {
        console.error('Error setting up announcements listener:', error);
        announcementsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error: ' + error.message + '</div>';
    }
}

// Load Events
async function loadEventsRealtime() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) {
        console.log('eventsList element not found');
        return;
    }
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
                console.log('Event:', title, date);
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

// Load Prayers with Real-time Sync
function loadPrayerRealtime() {
    const prayerList = document.getElementById('prayerList');
    if (!prayerList) return;

    console.log('Setting up real-time prayer listener...');
    prayerList.innerHTML = 'Loading prayers...';

    try {
        db.collection('prayers').orderBy('createdAt', 'desc').limit(20).onSnapshot(
            (snapshot) => {
                console.log('Prayers snapshot received:', snapshot.size);
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
            },
            (error) => {
                console.error('Error loading prayers:', error);
                prayerList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error loading prayers</div>';
            }
        );
    } catch (error) {
        console.error('Error setting up prayer listener:', error);
        prayerList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error loading prayers</div>';
    }
}

// Razorpay Integration for Indian Payments (INR)
let currentOfferingAmount = 0;

function setOfferingAmount(amount) {
    currentOfferingAmount = amount;
    document.getElementById('customAmount').value = amount;
}

function initiateRazorpayPayment() {
    const amount = parseInt(document.getElementById('customAmount').value || currentOfferingAmount);
    const name = document.getElementById('offeringName').value || 'Anonymous';
    const type = document.getElementById('offeringType').value;
    const status = document.getElementById('offeringStatus');

    if (!amount || amount <= 0) {
        status.textContent = '❌ Please enter a valid amount';
        status.style.display = 'block';
        status.style.color = '#f44336';
        return;
    }

    status.textContent = '⏳ Opening payment gateway...';
    status.style.display = 'block';
    status.style.color = '#2196F3';

    // Razorpay Payment Options
    const options = {
        key: 'rzp_live_YOUR_KEY_ID', // Replace with your Razorpay Key ID
        amount: amount * 100, // Amount in paise (₹ * 100)
        currency: 'INR',
        name: 'Whitefield Methodist Church',
        description: type + ' Offering',
        image: 'https://via.placeholder.com/100', // Church logo URL
        prefill: {
            name: name,
            email: 'donor@church.org',
            contact: '9999999999'
        },
        notes: {
            offeringType: type,
            churchName: 'Whitefield Methodist Church'
        },
        theme: {
            color: '#1F51B6'
        },
        handler: async function(response) {
            await handleRazorpaySuccess(response, amount, name, type);
        },
        modal: {
            ondismiss: function() {
                status.textContent = '❌ Payment cancelled';
                status.style.color = '#f44336';
                setTimeout(() => {
                    status.style.display = 'none';
                }, 3000);
            }
        }
    };

    // Load Razorpay Script and open payment dialog
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = function() {
        const rzp1 = new Razorpay(options);
        rzp1.open();
    };
    script.onerror = function() {
        status.textContent = '❌ Payment gateway error. Please try again.';
        status.style.color = '#f44336';
    };
    document.head.appendChild(script);
}

async function handleRazorpaySuccess(response, amount, name, type) {
    const status = document.getElementById('offeringStatus');

    status.textContent = '⏳ Verifying payment...';
    status.style.color = '#2196F3';

    try {
        // Save offering with payment details to database
        const offeringRef = await db.collection('offerings').add({
            memberName: name,
            amount: amount,
            currency: 'INR',
            date: new Date().toISOString().split('T')[0],
            type: type,
            paymentMethod: 'Razorpay',
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id || '',
            signature: response.razorpay_signature || '',
            status: 'Completed',
            notes: 'Submitted from mobile app via Razorpay',
            createdAt: new Date(),
            timestamp: new Date().toISOString()
        });

        status.textContent = '✅ Payment successful! Thank you for your generous offering. Your transaction ID: ' + response.razorpay_payment_id;
        status.style.color = '#4CAF50';

        setTimeout(() => {
            resetOfferingForm();
            goBack();
        }, 3000);
    } catch (error) {
        console.error('Error saving offering:', error);
        status.textContent = '⚠️ Payment received but error saving to database. Please contact us.';
        status.style.color = '#FF9800';

        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}

async function submitOfferingManual() {
    const amount = parseInt(document.getElementById('customAmount').value || currentOfferingAmount);
    const name = document.getElementById('offeringName').value || 'Anonymous';
    const type = document.getElementById('offeringType').value;
    const status = document.getElementById('offeringStatus');

    if (!amount || amount <= 0) {
        status.textContent = '❌ Please enter a valid amount';
        status.style.display = 'block';
        status.style.color = '#f44336';
        return;
    }

    status.textContent = '⏳ Recording offering...';
    status.style.display = 'block';
    status.style.color = '#2196F3';

    try {
        await db.collection('offerings').add({
            memberName: name,
            amount: amount,
            currency: 'INR',
            date: new Date().toISOString().split('T')[0],
            type: type,
            paymentMethod: 'Manual Record',
            status: 'Recorded',
            notes: 'Submitted from mobile app - no online payment',
            createdAt: new Date(),
            timestamp: new Date().toISOString()
        });

        status.textContent = '✅ Offering recorded successfully! Thank you for your generosity.';
        status.style.color = '#4CAF50';

        setTimeout(() => {
            resetOfferingForm();
            goBack();
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        status.textContent = '❌ Error: ' + error.message;
        status.style.color = '#f44336';
    }
}

function resetOfferingForm() {
    document.getElementById('customAmount').value = '';
    document.getElementById('offeringName').value = '';
    document.getElementById('offeringType').value = 'General';
    document.getElementById('offeringStatus').style.display = 'none';
    currentOfferingAmount = 0;
}

// UPI Integration (Direct, 0% charges)
// ⚠️ UPDATE THESE WITH YOUR CHURCH DETAILS:
const CHURCH_UPI_ID = 'whitefieldchurch@hdfc'; // Replace with your actual UPI ID
const CHURCH_NAME = 'Whitefield Methodist Church'; // Replace with your church name

function showPaymentTab(tab) {
    const upiTab = document.getElementById('upiTab');
    const razorpayTab = document.getElementById('razorpayTab');
    const tabUPI = document.getElementById('tabUPI');
    const tabRazorpay = document.getElementById('tabRazorpay');

    if (tab === 'upi') {
        upiTab.style.display = 'block';
        razorpayTab.style.display = 'none';
        tabUPI.style.background = '#1F51B6';
        tabUPI.style.color = 'white';
        tabRazorpay.style.background = '#f0f0f0';
        tabRazorpay.style.color = '#333';
    } else {
        upiTab.style.display = 'none';
        razorpayTab.style.display = 'block';
        tabUPI.style.background = '#f0f0f0';
        tabUPI.style.color = '#333';
        tabRazorpay.style.background = '#1F51B6';
        tabRazorpay.style.color = 'white';
    }
}

function copyUPIId() {
    const upiId = CHURCH_UPI_ID;
    const el = document.createElement('textarea');
    el.value = upiId;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const upiStatus = document.getElementById('upiStatus');
    upiStatus.textContent = '✅ UPI ID copied to clipboard!';
    upiStatus.style.display = 'block';
    upiStatus.style.color = '#4CAF50';
    setTimeout(() => {
        upiStatus.style.display = 'none';
    }, 2000);
}

function initiateUPIPayment() {
    const amount = parseInt(document.getElementById('customAmount').value || currentOfferingAmount);
    const name = document.getElementById('offeringName').value || 'Donor';
    const type = document.getElementById('offeringType').value || 'Offering';
    const upiStatus = document.getElementById('upiStatus');

    if (!amount || amount <= 0) {
        upiStatus.textContent = '❌ Please enter a valid amount';
        upiStatus.style.display = 'block';
        upiStatus.style.color = '#f44336';
        return;
    }

    // Create UPI payment URL (UPI deep linking)
    // Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&tn=TRANSACTION_NOTE
    const upiUrl = `upi://pay?pa=${CHURCH_UPI_ID}&pn=${encodeURIComponent(CHURCH_NAME)}&am=${amount}&tn=${encodeURIComponent(type + ' - ' + name)}&tr=${Date.now()}`;

    upiStatus.textContent = '⏳ Opening UPI app...';
    upiStatus.style.display = 'block';
    upiStatus.style.color = '#2196F3';

    // Try to open UPI app
    window.location.href = upiUrl;

    // Fallback: Show manual instruction after 2 seconds
    setTimeout(() => {
        const confirmed = confirm(
            `UPI Payment Details:\n\n` +
            `Amount: ₹${amount}\n` +
            `To: ${CHURCH_NAME}\n` +
            `UPI ID: ${CHURCH_UPI_ID}\n\n` +
            `Click OK after payment is done.\n` +
            `(If UPI app didn't open, please open your UPI app manually and send ₹${amount} to ${CHURCH_UPI_ID})`
        );

        if (confirmed) {
            recordUPIPayment(amount, name, type);
        }
    }, 2000);
}

async function recordUPIPayment(amount, name, type) {
    const upiStatus = document.getElementById('upiStatus');

    upiStatus.textContent = '⏳ Recording UPI payment...';
    upiStatus.style.color = '#2196F3';

    try {
        await db.collection('offerings').add({
            memberName: name || 'Anonymous',
            amount: amount,
            currency: 'INR',
            date: new Date().toISOString().split('T')[0],
            type: type,
            paymentMethod: 'UPI Direct',
            upiId: CHURCH_UPI_ID,
            status: 'Pending Verification',
            notes: 'UPI payment from mobile app - manual verification pending',
            createdAt: new Date(),
            timestamp: new Date().toISOString()
        });

        upiStatus.textContent = '✅ Payment recorded! Our team will verify and confirm. Thank you!';
        upiStatus.style.color = '#4CAF50';

        setTimeout(() => {
            resetOfferingForm();
            goBack();
        }, 3000);
    } catch (error) {
        console.error('Error:', error);
        upiStatus.textContent = '❌ Error: ' + error.message;
        upiStatus.style.color = '#f44336';
    }
}
