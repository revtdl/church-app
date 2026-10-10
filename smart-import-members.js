// Smart Import - Only Update Missing Fields
// Checks existing members and updates missing data

async function smartImportMembersFromCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    console.log('🔄 Starting smart import (update existing, add new)...');

    // Map CSV columns to Firestore fields
    const getIndex = (name) => {
        const index = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
        return index >= 0 ? index : -1;
    };

    const nameIdx = getIndex('Full Name');
    const categoryIdx = getIndex('Category');
    const genderIdx = getIndex('Gender');
    const dobIdx = getIndex('Date of Birth');
    const dowIdx = getIndex('Date of Wedding');
    const phoneIdx = getIndex('Mobile');
    const emailIdx = getIndex('Email');
    const addressIdx = getIndex('Residential Address');
    const areaIdx = getIndex('Recommended Area');
    const congregationIdx = getIndex('Congregation');
    const spouseIdx = getIndex('Spouse Name');

    console.log('📊 Getting existing members from Firestore...');

    // Get all existing members
    const existingMembers = {};
    const snapshot = await db.collection('members').get();
    snapshot.forEach(doc => {
        const m = doc.data();
        existingMembers[m.name] = {
            docId: doc.id,
            data: m
        };
    });

    console.log(`📋 Found ${Object.keys(existingMembers).length} existing members`);

    let updated = 0;
    let added = 0;
    let skipped = 0;
    const results = [];

    // Process each CSV line
    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',');

        if (!cells[nameIdx] || cells[nameIdx].trim() === '') continue;

        const name = cells[nameIdx].trim();
        const membershipStatus = cells[categoryIdx] ? cells[categoryIdx].trim() : 'Member';

        // Parse date format: "01-Jan" or "01-Jan-1990" → "1990-01-01"
        const parseDate = (dateStr) => {
            if (!dateStr || dateStr.trim() === '') return '';
            try {
                // Handle formats: "01-Jan", "01-Jan-1990", "1990-01-01"
                const parts = dateStr.trim().split('-');
                if (parts.length === 2) {
                    // Format: "01-Jan" - need to add year
                    const day = parts[0];
                    const month = parts[1];
                    return `${month}-${day}`; // Keep as partial for now
                } else if (parts.length === 3) {
                    // Format: "01-Jan-1990" or "1990-01-01"
                    if (parts[2].length === 4) {
                        // "01-Jan-1990" format
                        const day = parts[0];
                        const month = parts[1];
                        const year = parts[2];
                        // Convert month name to number
                        const monthNum = new Date(`${month} 1`).getMonth() + 1;
                        return `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    } else {
                        // Already "1990-01-01" format
                        return parts.join('-');
                    }
                }
                return dateStr;
            } catch (e) {
                return dateStr;
            }
        };

        const csvMember = {
            name: name,
            membershipStatus: membershipStatus,
            gender: cells[genderIdx] ? cells[genderIdx].trim() : '',
            dateOfBirth: parseDate(cells[dobIdx]),
            dateOfWedding: parseDate(cells[dowIdx]),
            phone: cells[phoneIdx] ? cells[phoneIdx].trim() : '',
            email: cells[emailIdx] ? cells[emailIdx].trim() : '',
            address: cells[addressIdx] ? cells[addressIdx].trim() : '',
            area: cells[areaIdx] ? cells[areaIdx].trim() : '',
            congregation: cells[congregationIdx] ? cells[congregationIdx].trim() : '',
            spouseName: cells[spouseIdx] ? cells[spouseIdx].trim() : ''
        };

        try {
            if (existingMembers[name]) {
                // MEMBER EXISTS - UPDATE MISSING FIELDS
                const existing = existingMembers[name];
                const updateData = {};

                // Only add fields that are missing in Firestore
                Object.keys(csvMember).forEach(key => {
                    if (csvMember[key] && !existing.data[key]) {
                        updateData[key] = csvMember[key];
                    }
                });

                if (Object.keys(updateData).length > 0) {
                    await db.collection('members').doc(existing.docId).update(updateData);
                    results.push({
                        status: 'UPDATED',
                        name: name,
                        fields: Object.keys(updateData).join(', ')
                    });
                    updated++;
                    console.log(`🔄 Updated: ${name} - Fields: ${Object.keys(updateData).join(', ')}`);
                } else {
                    skipped++;
                    results.push({
                        status: 'SKIPPED',
                        name: name,
                        reason: 'All fields already present'
                    });
                    console.log(`⏭️ Skipped: ${name} - All fields already present`);
                }
            } else {
                // NEW MEMBER - ADD
                await db.collection('members').add({
                    ...csvMember,
                    createdAt: new Date(),
                    importedFrom: 'CSV'
                });
                results.push({
                    status: 'ADDED',
                    name: name
                });
                added++;
                console.log(`✅ Added: ${name}`);
            }
        } catch (error) {
            results.push({
                status: 'ERROR',
                name: name,
                error: error.message
            });
            console.error(`❌ Error: ${name} - ${error.message}`);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 SMART IMPORT COMPLETE!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Updated: ${updated} members (missing fields filled)`);
    console.log(`✨ Added: ${added} new members`);
    console.log(`⏭️ Skipped: ${skipped} (no changes needed)`);
    console.log(`${'='.repeat(60)}\n`);

    // Show summary by status
    const summary = {};
    results.forEach(r => {
        summary[r.status] = (summary[r.status] || 0) + 1;
    });

    console.log('📋 Summary:', summary);

    return {
        added,
        updated,
        skipped,
        total: lines.length - 1,
        results
    };
}

console.log('✅ Smart import script loaded!');
console.log('Usage: smartImportMembersFromCSV(csvData)');
console.log('This will only update missing fields and add new members!');
