#!/usr/bin/env node
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

const credPath = path.join(__dirname, 'churchapp-74dec-firebase-adminsdk-fbsvc-da4f9fa9ee.json');
const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));

admin.initializeApp({ credential: admin.cert(creds) });
const db = getFirestore();

// Convert YYYY-MM-DD to DD/MM/YYYY
const convertDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return '';
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            // YYYY-MM-DD format
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    } catch (e) {
        return dateStr;
    }
};

// Proper CSV parser that handles quoted fields
function parseCSV(text) {
    const rows = [];
    let row = [];
    let insideQuotes = false;
    let cell = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                cell += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            row.push(cell.trim());
            cell = '';
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (cell || row.length > 0) {
                row.push(cell.trim());
                if (row.some(c => c)) rows.push(row);
                row = [];
                cell = '';
            }
        } else {
            cell += char;
        }
    }

    if (cell || row.length > 0) {
        row.push(cell.trim());
        if (row.some(c => c)) rows.push(row);
    }

    return rows;
}

async function importFromCSV() {
    console.log('\n🚀 Starting FRESH import from CSV...\n');

    try {
        const csvPath = 'C:\\Users\\amaze\\Downloads\\WMC_Members_Import_Format.csv';
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const rows = parseCSV(csvData);
        const headers = rows[0];

        console.log(`📊 CSV loaded: ${rows.length - 1} records\n`);

        // Map CSV columns
        const getIndex = (name) => {
            const idx = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
            return idx >= 0 ? idx : -1;
        };

        const colMap = {
            name: getIndex('Full Name'),
            familyHead: getIndex('Family Head'),
            familyNumber: getIndex('Family Number'),
            phone: getIndex('Phone 1'),
            phone2: getIndex('Phone 2'),
            email: getIndex('Email'),
            area: getIndex('Area'),
            address: getIndex('Address'),
            dateOfBirth: getIndex('Date of Birth'),
            gender: getIndex('Gender'),
            maritalStatus: getIndex('Marital Status'),
            spouseName: getIndex('Spouse Name'),
            dateOfWedding: getIndex('Date of Wedding'),
            child1: getIndex('Child 1'),
            child2: getIndex('Child 2'),
            child3: getIndex('Child 3'),
            child4: getIndex('Child 4'),
            dateOfBaptism: getIndex('Date of Baptism'),
            dateOfConfirmation: getIndex('Date of Confirmation'),
            dateOfJoining: getIndex('Date of Joining'),
            dateOfLeaving: getIndex('Date of Leaving'),
            membershipStatus: getIndex('Membership Status'),
            monthlyContribution: getIndex('Monthly Contribution'),
            remarks: getIndex('Remarks')
        };

        let added = 0;
        const errors = [];

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i];
            if (!cells || cells.length === 0) continue;
            const name = cells[colMap.name] || '';

            if (!name) continue;

            try {
                const member = {
                    name: name,
                    familyHead: cells[colMap.familyHead] || '',
                    familyNumber: cells[colMap.familyNumber] || '',
                    phone: cells[colMap.phone] || '',
                    phone2: cells[colMap.phone2] || '',
                    email: cells[colMap.email] || '',
                    area: cells[colMap.area] || '',
                    address: cells[colMap.address] || '',
                    dateOfBirth: convertDate(cells[colMap.dateOfBirth] || ''),
                    gender: cells[colMap.gender] || '',
                    maritalStatus: cells[colMap.maritalStatus] || '',
                    spouseName: cells[colMap.spouseName] || '',
                    dateOfWedding: convertDate(cells[colMap.dateOfWedding] || ''),
                    child1: cells[colMap.child1] || '',
                    child2: cells[colMap.child2] || '',
                    child3: cells[colMap.child3] || '',
                    child4: cells[colMap.child4] || '',
                    dateOfBaptism: convertDate(cells[colMap.dateOfBaptism] || ''),
                    dateOfConfirmation: convertDate(cells[colMap.dateOfConfirmation] || ''),
                    dateOfJoining: convertDate(cells[colMap.dateOfJoining] || ''),
                    dateOfLeaving: convertDate(cells[colMap.dateOfLeaving] || ''),
                    membershipStatus: cells[colMap.membershipStatus] || 'Member',
                    monthlyContribution: cells[colMap.monthlyContribution] || '',
                    remarks: cells[colMap.remarks] || '',
                    createdAt: new Date(),
                    importedFrom: 'CSV'
                };

                await db.collection('members').add(member);
                added++;
                if (added % 20 === 0) {
                    console.log(`✅ Added: ${added} members...`);
                }
            } catch (err) {
                errors.push(`Row ${i}: ${name} - ${err.message}`);
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

importFromCSV();
