#!/usr/bin/env node
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

const credPath = path.join(__dirname, 'churchapp-74dec-firebase-adminsdk-fbsvc-da4f9fa9ee.json');
const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));

admin.initializeApp({ credential: admin.cert(creds) });
const db = getFirestore();

async function debug() {
    console.log('\n🔍 Checking member data in Firebase...\n');

    try {
        const doc = await db.collection('members')
            .where('name', '==', 'Mr. Matthew Karthick')
            .get();

        if (doc.size === 0) {
            console.log('❌ Member not found!');
            process.exit(1);
        }

        doc.forEach(d => {
            const data = d.data();
            console.log('📋 Full Member Data:');
            console.log(JSON.stringify(data, null, 2));
            console.log('\n✅ dateOfWedding value:', data.dateOfWedding || 'EMPTY/MISSING');
            console.log('✅ dateOfBirth value:', data.dateOfBirth || 'EMPTY/MISSING');
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

debug();
