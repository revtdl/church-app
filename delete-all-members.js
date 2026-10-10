#!/usr/bin/env node
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

const credPath = path.join(__dirname, 'churchapp-74dec-firebase-adminsdk-fbsvc-da4f9fa9ee.json');
const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));

admin.initializeApp({ credential: admin.cert(creds) });
const db = getFirestore();

async function deleteAll() {
    console.log('\n⚠️  DELETING ALL MEMBERS...\n');

    try {
        const snapshot = await db.collection('members').get();
        const count = snapshot.size;

        console.log(`📊 Found ${count} members to delete...\n`);

        let deleted = 0;
        for (const doc of snapshot.docs) {
            await db.collection('members').doc(doc.id).delete();
            deleted++;
            if (deleted % 20 === 0) {
                console.log(`🗑️ Deleted ${deleted}/${count}...`);
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`✅ ALL MEMBERS DELETED: ${deleted} records removed`);
        console.log(`${'='.repeat(60)}\n`);
        console.log('Ready for fresh import! 🚀\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

deleteAll();
