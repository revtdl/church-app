#!/usr/bin/env node

/**
 * Direct Member Import Script
 * Reads Excel file and imports members to Firebase
 */

const XLSX = require('xlsx');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g",
    authDomain: "churchapp-74dec.firebaseapp.com",
    projectId: "churchapp-74dec",
    storageBucket: "churchapp-74dec.firebasestorage.app",
    messagingSenderId: "684996448330",
    appId: "1:684996448330:web:4531fce57b5af27c4c16b3"
};

// Initialize Firebase Admin
admin.initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
});

const db = admin.firestore();

async function importMembers() {
    try {
        console.log('📊 Starting Member Import...\n');

        const excelPath = 'C:\\Users\\amaze\\Downloads\\WMC_Membership_List_Final_2026.xlsx';

        if (!fs.existsSync(excelPath)) {
            throw new Error(`Excel file not found: ${excelPath}`);
        }

        console.log('📖 Reading Excel file...');
        const workbook = XLSX.readFile(excelPath);
        const sheetName = workbook.SheetNames.find(name => name.includes('All Members'));

        if (!sheetName) {
            throw new Error('Sheet "All Members" not found');
        }

        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log(`✅ Found ${rows.length} rows in Excel\n`);

        // Get existing members
        const existingSnapshot = await db.collection('members').get();
        const existingNames = new Set();
        existingSnapshot.forEach(doc => {
            existingNames.add(doc.data().name?.toLowerCase());
        });

        console.log(`🔍 Found ${existingNames.size} existing members\n`);

        // Find header row
        let headerRow = null;
        for (let i = 0; i < Math.min(10, rows.length); i++) {
            if (rows[i][0] === 'Category') {
                headerRow = i;
                break;
            }
        }

        if (headerRow === null) {
            throw new Error('Could not find member data headers');
        }

        console.log(`📋 Header row found at index ${headerRow}\n`);

        // Parse members
        const members = [];
        const duplicates = [];

        for (let i = headerRow + 1; i < rows.length; i++) {
            const row = rows[i];
            const name = row[3]?.toString().trim();

            if (!name || name.length < 2) continue;

            // Check for duplicates
            if (existingNames.has(name.toLowerCase())) {
                duplicates.push(name);
                continue;
            }

            const member = {
                name: name,
                email: row[47]?.toString().trim() || '',
                phone: row[46]?.toString().trim() || '',
                phone2: '',
                familyHead: row[5] ? 'Head' : 'Dependent',
                familyNumber: row[2]?.toString() || '',
                area: row[44]?.toString().trim() || '',
                address: row[45]?.toString().trim() || '',
                dateOfBirth: row[8]?.toString() || '',
                maritalStatus: row[50]?.toString() || '',
                spouseName: row[7]?.toString().trim() || '',
                child1: '',
                child2: '',
                child3: '',
                child4: '',
                dateOfBaptism: '',
                dateOfConfirmation: '',
                dateOfJoining: '',
                dateOfLeaving: '',
                membershipStatus: row[0]?.toString() || 'Member',
                monthlyContribution: '',
                remarks: '',
                profileImage: null,
                createdAt: new Date()
            };

            members.push(member);
        }

        console.log(`✅ Parsed ${members.length} new members`);
        if (duplicates.length > 0) {
            console.log(`⏭️  Skipped ${duplicates.length} duplicates\n`);
        }

        // Import to Firebase
        console.log('🚀 Importing to Firebase...\n');

        let imported = 0;
        const batchSize = 500;

        for (let i = 0; i < members.length; i += batchSize) {
            const batch = db.batch();
            const batchMembers = members.slice(i, i + batchSize);

            for (const member of batchMembers) {
                const ref = db.collection('members').doc();
                batch.set(ref, member);
            }

            await batch.commit();
            imported += batchMembers.length;

            const percent = Math.round((imported / members.length) * 100);
            console.log(`  [${percent}%] Imported ${imported}/${members.length} members`);
        }

        console.log('\n✅ SUCCESS! Import complete!\n');
        console.log(`📊 Summary:`);
        console.log(`   • Imported: ${imported} members`);
        console.log(`   • Skipped: ${duplicates.length} duplicates`);
        console.log(`   • Total now: ${existingNames.size + imported} members\n`);
        console.log(`🌐 View at: http://localhost:8000/admin-portal.html\n`);

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Run import
importMembers();
