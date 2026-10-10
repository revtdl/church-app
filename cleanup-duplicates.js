// Manual cleanup - find David Livingston duplicates in Firestore
// UIDs to DELETE (keep first one):
// Delete UIDs: find in Firestore registrations collection with name="David Livingston T" and phone="9986012001"

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanupDavid() {
  try {
    console.log('🔍 Finding David Livingston T duplicates...\n');

    // Find all with same phone
    const snapshot = await db.collection('registrations')
      .where('name', '==', 'David Livingston T')
      .where('phone', '==', '9986012001')
      .get();

    console.log(`Found ${snapshot.size} records for David Livingston T`);

    const uids = [];
    snapshot.forEach(doc => {
      console.log(`  UID: ${doc.id}, Email: ${doc.data().email}, Name: ${doc.data().name}`);
      uids.push(doc.id);
    });

    if (uids.length > 1) {
      console.log(`\n⚠️  ${uids.length - 1} duplicates found!`);
      console.log('Keeping: ' + uids[0]);
      console.log('Deleting: ' + uids.slice(1).join(', '));
      
      // Delete duplicates (keep first)
      for (let i = 1; i < uids.length; i++) {
        await db.collection('registrations').doc(uids[i]).delete();
        console.log(`✅ Deleted: ${uids[i]}`);
      }
      console.log('\n✅ Cleanup complete!');
    } else {
      console.log('✅ No duplicates found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupDavid();
