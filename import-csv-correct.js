#!/usr/bin/env node
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

const credPath = path.join(__dirname, 'churchapp-74dec-firebase-adminsdk-fbsvc-da4f9fa9ee.json');
const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));

admin.initializeApp({ credential: admin.cert(creds) });
const db = getFirestore();

// Convert date: YYYY-MM-DD, YYYY-MM-DD HH:MM:SS, or DD-Mon-YYYY to DD/MM/YYYY
const convertDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return '';

    dateStr = dateStr.trim();

    // Handle YYYY-MM-DD HH:MM:SS format (remove time part first)
    if (dateStr.includes(' ')) {
        dateStr = dateStr.split(' ')[0];
    }

    // Handle YYYY-MM-DD format
    if (dateStr.includes('-') && dateStr.length === 10) {
        const parts = dateStr.split('-');
        if (parts[0].length === 4) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }

    // Handle DD-Mon-YYYY or DD-MM-YYYY format
    if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            if (parts[2].length === 4) {
                const day = parts[0];
                const month = parts[1];
                const year = parts[2];

                // Check if month is numeric (DD-MM-YYYY)
                if (!isNaN(month)) {
                    return `${day}/${month}/${year}`;
                }

                // Otherwise it's DD-Mon-YYYY
                const monthNum = new Date(`${month} 1`).getMonth() + 1;
                if (!isNaN(monthNum)) {
                    return `${day}/${String(monthNum).padStart(2, '0')}/${year}`;
                }
            }
        }
    }

    return dateStr;
};

async function importCSV() {
    console.log('\n🚀 Starting CSV import with proper parsing...\n');

    try {
        const csvPath = 'C:\\Users\\amaze\\Downloads\\WMC_Members_Import_Format.csv';
        const csvData = fs.readFileSync(csvPath, 'utf8');

        // Parse CSV properly with quote handling
        const records = parse(csvData, {
            columns: true,
            skip_empty_lines: true,
            relax_quotes: true,
            trim: true
        });

        console.log(`📊 CSV loaded: ${records.length} records\n`);

        let added = 0;
        const errors = [];

        for (const record of records) {
            try {
                const name = record['Full Name'] || '';
                if (!name) continue;

                const member = {
                    name: name,
                    familyHead: record['Family Head'] || '',
                    familyNumber: record['Family Number'] || '',
                    phone: record['Phone 1 (Primary)'] || '',
                    phone2: record['Phone 2 (Optional)'] || '',
                    email: record['Email'] || '',
                    area: record['Area'] || '',
                    address: record['Address'] || '',
                    dateOfBirth: convertDate(record['Date of Birth']),
                    gender: record['Gender'] || '',
                    maritalStatus: record['Marital Status'] || '',
                    spouseName: record['Spouse Name'] || '',
                    dateOfWedding: convertDate(record['Date of Wedding']),
                    child1: record['Child 1'] || '',
                    child2: record['Child 2'] || '',
                    child3: record['Child 3'] || '',
                    child4: record['Child 4'] || '',
                    dateOfBaptism: convertDate(record['Date of Baptism']),
                    dateOfConfirmation: convertDate(record['Date of Confirmation']),
                    dateOfJoining: convertDate(record['Date of Joining Church']),
                    dateOfLeaving: convertDate(record['Date of Leaving Church']),
                    membershipStatus: record['Membership Status'] || 'Member',
                    monthlyContribution: record['Monthly Contribution'] || '',
                    remarks: record['Remarks'] || '',
                    createdAt: new Date(),
                    importedFrom: 'CSV'
                };

                await db.collection('members').add(member);
                added++;

                if (added % 30 === 0) {
                    console.log(`✅ Added: ${added} members...`);
                }
            } catch (err) {
                errors.push(`${record['Full Name'] || 'Unknown'}: ${err.message}`);
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`✅ IMPORT COMPLETE!`);
        console.log(`✨ Added: ${added} members`);
        if (errors.length > 0) {
            console.log(`⚠️  Errors: ${errors.length}`);
            errors.slice(0, 5).forEach(e => console.log(`   ${e}`));
        }
        console.log(`${'='.repeat(60)}\n`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

importCSV();
