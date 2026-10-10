// ===== CALENDAR VIEW FOR EVENTS =====

let calendarEvents = [];
let currentMonth = new Date();
const CACHE_KEY = 'churchNexusEventCache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const CACHE_VERSION = 'v2'; // Bump version to invalidate old cache

// Load from cache first
function loadCachedEvents() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp, version } = JSON.parse(cached);
            // Only use cache if version matches and not expired
            if (version === CACHE_VERSION && Date.now() - timestamp < CACHE_EXPIRY) {
                calendarEvents = data;
                console.log('✅ Loaded from cache:', calendarEvents.length, 'events');
                return true;
            } else {
                console.log('Cache expired or version mismatch - loading fresh');
                localStorage.removeItem(CACHE_KEY);
            }
        }
    } catch (e) {
        console.error('Cache error:', e);
        localStorage.removeItem(CACHE_KEY);
    }
    return false;
}

// Save to cache
function saveEventsToCache() {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: calendarEvents,
            timestamp: Date.now(),
            version: CACHE_VERSION
        }));
        console.log('📦 Saved', calendarEvents.length, 'events to cache');
    } catch (e) {
        console.error('Cache save error:', e);
    }
}

async function loadEventsForCalendar() {
    const eventsContainer = document.getElementById('eventsCalendarContainer');

    // Show loading quickly
    if (eventsContainer && calendarEvents.length === 0) {
        eventsContainer.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #999;">
                <div style="font-size: 28px; margin-bottom: 10px;">⏳</div>
                <div>Loading calendar...</div>
            </div>
        `;
    }

    // Try to load from cache first
    if (loadCachedEvents()) {
        console.log('📋 Rendering calendar from cache');
        renderCalendar();
        return;
    }

    // Load from Firebase in background
    try {
        console.log('🔄 Fetching events from Firebase...');
        const snapshot = await db.collection('events').limit(100).get();
        calendarEvents = [];

        snapshot.forEach(doc => {
            const e = doc.data();
            if (e.date) {
                calendarEvents.push({
                    date: e.date,
                    title: e.title || e.eventName || 'Event',
                    time: e.time || '',
                    location: e.location || '',
                    description: e.description || '',
                    id: doc.id
                });
            }
        });

        // Generate birthday and anniversary events from members
        console.log('📋 Loading members for birthday/anniversary events...');
        const membersSnapshot = await db.collection('members').get();
        const members = [];

        membersSnapshot.forEach(doc => {
            const m = doc.data();
            members.push({
                name: m.name || 'Member',
                dateOfBirth: m.dateOfBirth || '',
                dateOfWedding: m.dateOfWedding || ''
            });
        });

        // Generate birthday and anniversary events (with deduplication)
        const today = new Date();
        members.forEach(member => {
            // Birthday
            if (member.dateOfBirth && member.dateOfBirth.trim()) {
                try {
                    let dob;
                    const dobStr = member.dateOfBirth.trim();

                    if (dobStr.includes('/')) {
                        // DD/MM/YYYY format
                        const parts = dobStr.split('/');
                        dob = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                    } else {
                        // YYYY-MM-DD format
                        const dateStr = dobStr.split(' ')[0];
                        dob = new Date(dateStr);
                    }

                    if (!isNaN(dob.getTime())) {
                        let birthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                        // If birthday already passed this year, show next year
                        if (birthday < today) {
                            birthday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
                        }

                        // Format date without timezone conversion (YYYY-MM-DD)
                        const birthdayDate = `${birthday.getFullYear()}-${String(birthday.getMonth() + 1).padStart(2, '0')}-${String(birthday.getDate()).padStart(2, '0')}`;
                        // Check if birthday event already exists (to avoid duplicates)
                        const exists = calendarEvents.some(e =>
                            e.date === birthdayDate &&
                            (e.title.includes(member.name) || e.description.includes(member.name))
                        );

                        if (!exists) {
                            calendarEvents.push({
                                date: birthdayDate,
                                title: `🎂 ${member.name}'s Birthday`,
                                description: `Birthday of ${member.name}`,
                                id: `birthday_${member.name}`
                            });
                            console.log('🎂 Added birthday:', member.name, 'on', birthdayDate);
                        } else {
                            console.log('⏭️ Skipped duplicate birthday:', member.name);
                        }
                    }
                } catch (e) {
                    console.log('⚠️ Error parsing DOB for', member.name);
                }
            }

            // Wedding Anniversary
            if (member.dateOfWedding && member.dateOfWedding.trim()) {
                try {
                    let weddingDate;
                    const dowStr = member.dateOfWedding.trim();

                    if (dowStr.includes('/')) {
                        // DD/MM/YYYY format
                        const parts = dowStr.split('/');
                        weddingDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                    } else {
                        // YYYY-MM-DD format
                        const dateStr = dowStr.split(' ')[0];
                        weddingDate = new Date(dateStr);
                    }

                    if (!isNaN(weddingDate.getTime())) {
                        let anniversary = new Date(today.getFullYear(), weddingDate.getMonth(), weddingDate.getDate());
                        // If anniversary already passed this year, show next year
                        if (anniversary < today) {
                            anniversary = new Date(today.getFullYear() + 1, weddingDate.getMonth(), weddingDate.getDate());
                        }

                        // Format date without timezone conversion (YYYY-MM-DD)
                        const anniversaryDate = `${anniversary.getFullYear()}-${String(anniversary.getMonth() + 1).padStart(2, '0')}-${String(anniversary.getDate()).padStart(2, '0')}`;
                        // Check if anniversary event already exists (to avoid duplicates)
                        const exists = calendarEvents.some(e =>
                            e.date === anniversaryDate &&
                            (e.title.includes(member.name) || e.description.includes(member.name))
                        );

                        if (!exists) {
                            const yearsMarried = anniversary.getFullYear() - weddingDate.getFullYear();
                            calendarEvents.push({
                                date: anniversaryDate,
                                title: `💍 ${member.name}'s Anniversary`,
                                description: `${yearsMarried} years of marriage`,
                                id: `anniversary_${member.name}`
                            });
                            console.log('💍 Added anniversary:', member.name, 'on', anniversaryDate);
                        } else {
                            console.log('⏭️ Skipped duplicate anniversary:', member.name);
                        }
                    }
                } catch (e) {
                    console.log('⚠️ Error parsing wedding date for', member.name);
                }
            }
        });

        // Save to cache
        saveEventsToCache();

        console.log('✅ Loaded', calendarEvents.length, 'total events (Firebase + birthdays + anniversaries)');
        renderCalendar();
    } catch (error) {
        console.error('❌ Error loading events:', error);

        // Show error/empty state
        if (calendarEvents.length === 0) {
            if (eventsContainer) {
                eventsContainer.innerHTML = `
                    <div style="background: white; border-radius: 12px; padding: 16px; text-align: center;">
                        <div style="color: #999; padding: 20px;">
                            <div style="font-size: 48px; margin-bottom: 12px;">📅</div>
                            <div>No events available</div>
                            <div style="font-size: 12px; margin-top: 8px; color: #bbb;">Tap refresh to reload</div>
                            <div style="font-size: 11px; margin-top: 12px; color: #d32f2f;">Error: ${error.message}</div>
                        </div>
                    </div>
                `;
            }
        } else {
            // Show cached data if available
            renderCalendar();
        }
    }
}

function renderCalendar() {
    const startTime = performance.now();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

    let html = `
        <div style="background: white; border-radius: 12px; padding: 12px; box-shadow: 0 2px 8px rgba(102,126,234,0.08);">
            <!-- Calendar Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px;">
                <button onclick="previousMonth()" style="background: #667eea; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; flex: 1;">← Prev</button>
                <div style="font-size: 16px; font-weight: 700; color: #333; text-align: center; flex: 1.5;">
                    ${monthNames[month]} ${year}
                </div>
                <button onclick="nextMonth()" style="background: #667eea; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; flex: 1;">Next →</button>
            </div>

            <!-- Day Headers -->
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 6px;">
                <div style="text-align: center; font-weight: 600; color: #667eea; padding: 4px; font-size: 11px;">Sun</div>
                <div style="text-align: center; font-weight: 600; color: #667eea; padding: 4px; font-size: 11px;">Mon</div>
                <div style="text-align: center; font-weight: 600; color: #667eea; padding: 4px; font-size: 11px;">Tue</div>
                <div style="text-align: center; font-weight: 600; color: #667eea; padding: 4px; font-size: 11px;">Wed</div>
                <div style="text-align: center; font-weight: 600; color: #667eea; padding: 4px; font-size: 11px;">Thu</div>
                <div style="text-align: center; font-weight: 600; color: #667eea; padding: 4px; font-size: 11px;">Fri</div>
                <div style="text-align: center; font-weight: 600; color: #667eea; padding: 4px; font-size: 11px;">Sat</div>
            </div>

            <!-- Calendar Days -->
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;">
    `;

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div style="aspect-ratio: 1; background: #f5f5f5; border-radius: 4px;"></div>';
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const eventsOnDay = calendarEvents.filter(e => e.date === dateStr);
        const hasEvents = eventsOnDay.length > 0;
        const isToday = new Date().toISOString().split('T')[0] === dateStr;

        const bgColor = isToday ? '#667eea' : hasEvents ? '#e8eaf6' : '#f9f9f9';
        const textColor = isToday ? 'white' : '#333';
        const borderColor = hasEvents ? '#667eea' : '#ddd';

        html += `
            <div onclick="showEventsForDate('${dateStr}')" style="
                aspect-ratio: 1;
                background: ${bgColor};
                border: 1.5px solid ${borderColor};
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: ${hasEvents ? 'pointer' : 'default'};
                padding: 2px;
                transition: all 0.2s;
                font-size: 12px;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <div style="font-weight: 600; color: ${textColor};">${day}</div>
                ${hasEvents ? `<div style="font-size: 10px; color: ${textColor}; margin-top: 1px;">●</div>` : ''}
            </div>
        `;
    }

    html += `
            </div>
        </div>
        <div id="calendarEventsList" style="margin-top: 16px;"></div>
    `;

    const eventsContainer = document.getElementById('eventsCalendarContainer');
    if (eventsContainer) {
        eventsContainer.innerHTML = html;
        const renderTime = performance.now() - startTime;
        console.log('Calendar rendered in', Math.round(renderTime), 'ms');
    }
}

function previousMonth() {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
}

function showEventsForDate(dateStr) {
    const eventsOnDay = calendarEvents.filter(e => e.date === dateStr);

    if (eventsOnDay.length === 0) {
        return;
    }

    const listContainer = document.getElementById('calendarEventsList');

    let html = `
        <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(102,126,234,0.08);">
            <div style="font-weight: 700; color: #333; margin-bottom: 12px; font-size: 16px;">
                📅 Events on ${new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
    `;

    eventsOnDay.forEach(event => {
        html += `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${event.title}</div>
                ${event.time ? `<div style="font-size: 12px; opacity: 0.9;">⏰ ${event.time}</div>` : ''}
                ${event.location ? `<div style="font-size: 12px; opacity: 0.9;">📍 ${event.location}</div>` : ''}
                ${event.description ? `<div style="font-size: 12px; opacity: 0.85; margin-top: 6px;">${event.description}</div>` : ''}
            </div>
        `;
    });

    html += `</div>`;
    listContainer.innerHTML = html;
}

function initializeCalendar() {
    console.log('🔄 Initializing calendar...');
    const container = document.getElementById('eventsCalendarContainer');

    if (!container) {
        console.error('❌ Calendar container not found!');
        return;
    }

    // Check if Firebase is initialized
    if (!db) {
        console.error('❌ Firebase not initialized');
        container.innerHTML = '<div style="text-align: center; padding: 30px; color: #f44336;">Firebase not ready. Refresh page.</div>';
        return;
    }

    console.log('✅ Container found, loading events...');
    loadEventsForCalendar();
}
