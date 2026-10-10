#!/usr/bin/env node
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

console.log('\n🚀 Initializing Firebase Admin SDK...\n');

try {
    // Load credentials
    const credPath = path.join(__dirname, 'churchapp-74dec-firebase-adminsdk-fbsvc-da4f9fa9ee.json');
    console.log('📁 Loading credentials from:', credPath);

    if (!fs.existsSync(credPath)) {
        throw new Error(`Credentials file not found: ${credPath}`);
    }

    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    console.log('✅ Credentials loaded\n');

    // Initialize Firebase
    admin.initializeApp({
        credential: admin.cert(creds)
    });

    const db = getFirestore();
    console.log('✅ Firebase initialized\n');

    async function importMembers() {
        console.log('🚀 Starting member import...\n');

        const members = [
            { name: 'Dr. Arun Noah', category: 'Full Members', phone: '9844122596', congregation: 'WMC English' },
            { name: 'Mrs. Sandhya Noah', category: 'Full Members', phone: '', congregation: 'WMC English' },
            { name: 'Mr. Atheejoe Nargunam Robert Epaphrez Samuel', category: 'Full Members', dob: '30-Nov-1981', dow: '23-Aug-2008', phone: '9731311228', email: 'atheejoe@gmail.com', congregation: 'WMC English' },
            { name: 'Mrs. Jenitta Gunasekaran', category: 'Full Members', dob: '18-Jun-1982', dow: '23-Aug-2008', phone: '9108839742', email: 'jenitta.gunasekaran@gmail.com', congregation: 'WMC English' },
            { name: 'Mr. Matthew Karthick', category: 'Full Members', dob: '01-Jan-1990', dow: '28-Dec-2019', phone: '7022842454', congregation: 'WMC Tamil' },
            { name: 'Mrs. Rachel Matthew', category: 'Full Members', dob: '20-Feb-1990', dow: '28-Dec-2019', phone: '8220315636', email: 'rachel36royal@gmail.com', congregation: 'WMC Tamil' },
        ];

        const existing = {};
        const snapshot = await db.collection('members').get();

        snapshot.forEach(doc => {
            existing[doc.data().name] = doc.id;
        });

        console.log(`📋 Found ${Object.keys(existing).length} existing members\n`);

        let updated = 0, added = 0;

        for (const m of members) {
            const data = {
                name: m.name,
                membershipStatus: m.category,
                phone: m.phone || '',
                email: m.email || '',
                dateOfBirth: m.dob || '',
                dateOfWedding: m.dow || '',
                congregation: m.congregation || ''
            };

            if (existing[m.name]) {
                const updateData = Object.fromEntries(
                    Object.entries(data).filter(([k, v]) => v && k !== 'name')
                );
                if (Object.keys(updateData).length > 0) {
                    await db.collection('members').doc(existing[m.name]).update(updateData);
                    updated++;
                    console.log(`🔄 Updated: ${m.name}`);
                }
            } else {
                await db.collection('members').add({
                    ...data,
                    createdAt: new Date()
                });
                added++;
                console.log(`✨ Added: ${m.name}`);
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`✅ Updated: ${updated} members`);
        console.log(`✨ Added: ${added} members`);
        console.log(`${'='.repeat(60)}\n`);

        process.exit(0);
    }

    importMembers().catch(error => {
        console.error('❌ Import failed:', error.message);
        process.exit(1);
    });

} catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
}
