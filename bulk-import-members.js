// Bulk Import Members from CSV
// Copy this script to browser console and paste your CSV data

async function importMembersFromCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    console.log('🔄 Starting bulk import...');
    console.log('📊 Columns found:', headers.length);

    let added = 0;
    let skipped = 0;
    const errors = [];

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

    console.log(`📍 Indices - Name:${nameIdx}, DOB:${dobIdx}, DoW:${dowIdx}, Phone:${phoneIdx}, Email:${emailIdx}`);

    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',');

        if (!cells[nameIdx] || cells[nameIdx].trim() === '') continue;

        try {
            const memberData = {
                name: cells[nameIdx] ? cells[nameIdx].trim() : 'Member',
                membershipStatus: cells[categoryIdx] ? cells[categoryIdx].trim() : 'Member',
                gender: cells[genderIdx] ? cells[genderIdx].trim() : '',
                dateOfBirth: cells[dobIdx] ? cells[dobIdx].trim() : '',
                dateOfWedding: cells[dowIdx] ? cells[dowIdx].trim() : '',
                phone: cells[phoneIdx] ? cells[phoneIdx].trim() : '',
                email: cells[emailIdx] ? cells[emailIdx].trim() : '',
                address: cells[addressIdx] ? cells[addressIdx].trim() : '',
                area: cells[areaIdx] ? cells[areaIdx].trim() : '',
                congregation: cells[congregationIdx] ? cells[congregationIdx].trim() : '',
                createdAt: new Date(),
                importedFrom: 'CSV'
            };

            // Add to Firestore
            await db.collection('members').add(memberData);
            added++;
            console.log(`✅ Added: ${memberData.name}`);

        } catch (error) {
            skipped++;
            errors.push(`Line ${i}: ${error.message}`);
        }
    }

    console.log(`\n📊 Import Complete!`);
    console.log(`✅ Added: ${added} members`);
    console.log(`⏭️ Skipped: ${skipped}`);
    if (errors.length > 0) {
        console.log(`❌ Errors:`, errors.slice(0, 5).join('\n'));
    }
}

// Usage:
// 1. Open Admin Portal
// 2. Open browser console (F12)
// 3. Paste this entire script
// 4. Copy your CSV content (Ctrl+C from the CSV file)
// 5. Run: importMembersFromCSV(csvContent)

console.log('✅ Bulk import script loaded!');
console.log('Usage: importMembersFromCSV(csvData)');
