#!/usr/bin/env node
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

const credPath = path.join(__dirname, 'churchapp-74dec-firebase-adminsdk-fbsvc-da4f9fa9ee.json');
const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));

admin.initializeApp({ credential: admin.cert(creds) });
const db = getFirestore();

async function cleanup() {
    console.log('\n🧹 Finding and deleting old duplicate records...\n');

    try {
        const snapshot = await db.collection('members').get();

        // Group by name
        const byName = {};
        snapshot.forEach(doc => {
            const name = doc.data().name;
            if (!byName[name]) byName[name] = [];
            byName[name].push({ id: doc.id, data: doc.data() });
        });

        let deletedCount = 0;

        // Find duplicates
        for (const [name, docs] of Object.entries(byName)) {
            if (docs.length > 1) {
                console.log(`\n⚠️ Found ${docs.length} records for "${name}"`);

                // Keep the one with the most fields, delete others
                const sorted = docs.sort((a, b) =>
                    Object.keys(b.data).length - Object.keys(a.data).length
                );

                for (let i = 1; i < sorted.length; i++) {
                    const oldDoc = sorted[i];
                    console.log(`   🗑️ Deleting old record (${Object.keys(oldDoc.data).length} fields)`);
                    await db.collection('members').doc(oldDoc.id).delete();
                    deletedCount++;
                }

                console.log(`   ✅ Keeping new record (${Object.keys(sorted[0].data).length} fields)`);
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`✅ Cleanup complete! Deleted: ${deletedCount} duplicate records`);
        console.log(`${'='.repeat(60)}\n`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

cleanup();
