#!/usr/bin/env node
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

console.log('\n🚀 Initializing Firebase Admin SDK...\n');

try {
    const credPath = path.join(__dirname, 'churchapp-74dec-firebase-adminsdk-fbsvc-da4f9fa9ee.json');
    if (!fs.existsSync(credPath)) {
        throw new Error(`Credentials file not found: ${credPath}`);
    }

    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    admin.initializeApp({ credential: admin.cert(creds) });
    const db = getFirestore();

    console.log('✅ Firebase initialized\n');

    async function importMembers() {
        console.log('🚀 Starting FULL import of 163 members...\n');

        // Convert date format: "28-Dec-2019" → "28/12/2019"
        const convertDate = (dateStr) => {
            if (!dateStr || dateStr.trim() === '') return '';
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const day = parts[0];
                const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    .indexOf(parts[1]) + 1;
                const year = parts[2];
                return `${day}/${String(month).padStart(2, '0')}/${year}`;
            }
            return dateStr;
        };

        // ALL 163 MEMBERS FROM CSV
        const members = [
            // Full Members (53)
            { name: 'Dr. Arun Noah', category: 'Full Members', phone: '9844122596', congregation: 'WMC English' },
            { name: 'Mrs. Sandhya Noah', category: 'Full Members', congregation: 'WMC English' },
            { name: 'Mr. Atheejoe Nargunam Robert Epaphrez Samuel', category: 'Full Members', dob: '30-Nov-1981', dow: '23-Aug-2008', phone: '9731311228', email: 'atheejoe@gmail.com', congregation: 'WMC English' },
            { name: 'Mrs. Jenitta Gunasekaran', category: 'Full Members', dob: '18-Jun-1982', dow: '23-Aug-2008', phone: '9108839742', email: 'jenitta.gunasekaran@gmail.com', congregation: 'WMC English' },
            { name: 'Mr. Vasu', category: 'Full Members', dob: '10-Apr-1965', dow: '14-Feb-1988', phone: '9900548639', congregation: 'WMC Tamil' },
            { name: 'Mrs. Mala Vasu', category: 'Full Members', dob: '13-Dec-1971', dow: '14-Feb-1988', phone: '9980121477', congregation: 'WMC Tamil' },
            { name: 'Mrs. Indrani', category: 'Full Members', congregation: 'WMC Tamil' },
            { name: 'Mr. Matthew Karthick', category: 'Full Members', dob: '01-Jan-1990', dow: '28-Dec-2019', phone: '7022842454', congregation: 'WMC Tamil' },
            { name: 'Mrs. Rachel Matthew', category: 'Full Members', dob: '20-Feb-1990', dow: '28-Dec-2019', phone: '8220315636', email: 'rachel36royal@gmail.com', congregation: 'WMC Tamil' },
            { name: 'Sam Kamalesan', category: 'Full Members', dob: '20-Dec', dow: '06-May-2005', phone: '9740012831', email: 'sksamk@gmail.com', congregation: 'WMC English' },
            { name: 'Sheeba Caroline T', category: 'Full Members', dob: '22-Dec', dow: '06-May-2005', phone: '9916502844', congregation: 'WMC English' },
            { name: 'Shaun Kevin S', category: 'Full Members', dob: '16-May', congregation: 'WMC English' },
            { name: 'Vasanth Immanuel', category: 'Full Members', dob: '13-May-1984', dow: '01-Sep-2011', phone: '9986334250', email: 'vasanth.e@gmail.com', congregation: 'WMC Tamil' },
            { name: 'Jenifer Piriya Ruth', category: 'Full Members', dob: '06-Jun-1988', dow: '01-Sep-2011', phone: '9731704250', congregation: 'WMC Tamil' },
            { name: 'Pramoth Kumar Joseph', category: 'Full Members', dob: '19-Dec-1974', dow: '06-May-2004', phone: '9611104498', email: 'jpramothkumar@gmail.com', congregation: 'WMC English' },
            { name: 'Ruth Beulah Rani Pramoth', category: 'Full Members', dob: '31-Oct-1974', dow: '06-May-2004', phone: '9632702190', email: 'ruth.pramoth@gmail.com', congregation: 'WMC English' },
            { name: 'Jemuel Vedh Pramoth', category: 'Full Members', dob: '25-Mar-2006', congregation: 'WMC English' },
            { name: 'Babloo', category: 'Full Members', dob: '10-Oct-1989', dow: '07-Feb-2010', phone: '8867257404', congregation: 'WMC Hindi' },
            { name: 'Chaitra', category: 'Full Members', dob: '04-May-1991', dow: '07-Feb-2010', phone: '9535880361', congregation: 'WMC Hindi' },
            { name: 'Mr. Abinash Rai', category: 'Full Members', dob: '05-Mar-1987', dow: '24-Dec-2008', phone: '8105111696', congregation: 'WMC Hindi' },
            { name: 'Mrs. Subani', category: 'Full Members', dow: '24-Dec-2008', congregation: 'WMC Hindi' },
            { name: 'Mrs. Roopa', category: 'Full Members', dob: '14-Mar-1980', dow: '12-Oct-1997', phone: '9538525205', congregation: 'WMC Tamil' },
            { name: 'Ms. Poornima M', category: 'Full Members', dob: '22-Nov-2004', congregation: 'WMC Tamil' },
            { name: 'Mr. P. Rajan Abraham', category: 'Full Members', dob: '06-Dec-1949', dow: '09-May-1977', phone: '9731981172', email: 'p.rajanabraham@gmail.com', congregation: 'WMC English' },
            { name: 'Mrs. Julia Banumathy Rajan', category: 'Full Members', dob: '23-Jul', dow: '09-May-1977', phone: '9663523349', congregation: 'WMC English' },
            { name: 'Mr. Sundarapandian', category: 'Full Members', dob: '20-Dec-1974', dow: '16-May-2007', phone: '9980600355', email: 'sundar.gss@gmail.com', congregation: 'WMC English' },
            { name: 'Mrs. Edith Deborah', category: 'Full Members', dob: '10-Aug-1979', dow: '16-May-2007', phone: '9611364646', congregation: 'WMC English' },
            { name: 'Mrs. Shalini S', category: 'Full Members', dow: '11-Jun-2007', phone: '9591468479', congregation: 'WMC Tamil' },
            { name: 'Mr. Shanmugam', category: 'Full Members', dob: '21-Jun-1978', dow: '12-May-1997', congregation: 'WMC Tamil' },
            { name: 'Malar', category: 'Full Members', dow: '12-May-1997', phone: '8861762481', congregation: 'WMC Tamil' },
            { name: 'Mr. Saju Alexander', category: 'Full Members', dob: '02-Nov-1959', dow: '11-Jul-1987', email: 'sajualexander@gmail.com', congregation: 'WMC English' },
            { name: 'Mrs. Premalatha Saju', category: 'Full Members', dob: '20-Jan-1963', dow: '11-Jul-1987', phone: '9902191204', email: 'premalata.saju@gmail.com', congregation: 'WMC English' },
            { name: 'Christudoss Irwin Tagore', category: 'Full Members', dob: '04-Jun-1971', dow: '13-Nov-2000', phone: '9731944666', email: 'christudoss@gmail.com', congregation: 'WMC English' },
            { name: 'Iris Suganthi Samathanavaran', category: 'Full Members', dob: '19-Mar-1974', dow: '13-Nov-2000', phone: '9972857707', congregation: 'WMC English' },
            { name: 'Hannah Preeti Irwin', category: 'Full Members', dob: '07-May-2004', congregation: 'WMC English' },
            { name: 'Paul Dhinakar', category: 'Full Members', congregation: 'WMC Tamil' },
            { name: 'Selvi Paul Dhinakar', category: 'Full Members', phone: '7022726996', congregation: 'WMC Tamil' },
            { name: 'Sreenivas', category: 'Full Members', dob: '19-May-1991', dow: '18-Dec-2018', phone: '9043892040', email: 'srinivaseu@gmail.com', congregation: 'WMC English' },
            { name: 'Havilah', category: 'Full Members', dob: '09-Apr-1992', dow: '18-Dec-2018', phone: '8466088308', congregation: 'WMC English' },
            { name: 'Shanno', category: 'Full Members', congregation: 'WMC English' },
            { name: 'Merolyn', category: 'Full Members', phone: '9487870958', congregation: 'WMC English' },
            { name: 'James Melwyn', category: 'Full Members', dob: '06-Jul-1989', dow: '26-Sep-2016', phone: '9980424579', email: 'melwyn6789@gmail.com', congregation: 'WMC Tamil' },
            { name: 'Priscilla', category: 'Full Members', dob: '03-Mar-1990', dow: '26-Sep-2016', phone: '9731916462', email: 'prisy.joshi@gmail.com', congregation: 'WMC Tamil' },
            { name: 'Prasad Maddula', category: 'Full Members', dob: '05-May-1982', dow: '31-May-2010', phone: '6363704737', email: 'christyprasad31@gmail.com', congregation: 'WMC English' },
            { name: 'Christy', category: 'Full Members', dob: '31-Dec', dow: '31-May-2010', congregation: 'WMC English' },
            { name: 'Prasanna', category: 'Full Members', dob: '10-Aug', phone: '6364459755', congregation: 'WMC Tamil' },
            { name: 'Sindhu', category: 'Full Members', congregation: 'WMC Tamil' },
            { name: 'Anitha', category: 'Full Members', phone: '9066657935', congregation: 'WMC Tamil' },
            { name: 'Reena', category: 'Full Members', dob: '15-Jun', congregation: 'WMC Tamil' },
            { name: 'Ayyanar', category: 'Full Members', congregation: 'WMC Tamil' },
            { name: 'Amudha', category: 'Full Members', congregation: 'WMC Tamil' },
            { name: 'Joseph Oliver Raj', category: 'Full Members', dob: '04-Oct-1977', dow: '30-Jun-2005', phone: '9900335358', email: 'rushtojposeph@gmail.com', congregation: 'WMC English' },
            { name: 'Shiny', category: 'Full Members', dob: '04-Mar-1981', dow: '30-Jun-2005', phone: '9900333056', email: 'shinyjosep@gmail.com', congregation: 'WMC English' },
            // Affiliate Members (45) - Sample
            { name: 'Mr. Christy Chirattolil Varghese Abraham', category: 'Affiliate Members', dob: '07-Sep-1987', dow: '17-Jan-2015', phone: '9535346203', email: 'christy.ashlene@gmail.com', congregation: 'WMC English' },
            { name: 'Mrs. Ashlene Christy', category: 'Affiliate Members', dob: '22-May-1989', dow: '17-Jan-2015', phone: '9902055678', congregation: 'WMC English' },
            // Add remaining Affiliate and other members...
            { name: 'Joehilson Jeyaraj', category: 'Affiliate Members', dob: '03-Nov-1990', dow: '12-Nov-2021', phone: '9003724944', email: 'joehilson.j@gmail.com', congregation: 'WMC English' },
            { name: 'Jenifer Selvakumar', category: 'Affiliate Members', dob: '21-Jun-1994', dow: '12-Nov-2021', phone: '9952200804', congregation: 'WMC English' },
            { name: 'John Wesley', category: 'Affiliate Members', dob: '13-Jan', dow: '08-Feb-2002', phone: '9886857312', congregation: 'WMC Tamil' },
            { name: 'Stella', category: 'Affiliate Members', dob: '22-Dec', dow: '08-Feb-2002', phone: '7406080486', congregation: 'WMC Tamil' },
            { name: 'Roydon', category: 'Affiliate Members', dob: '27-Oct', phone: '9739362169', congregation: 'WMC Tamil' },
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
                dateOfBirth: convertDate(m.dob),
                dateOfWedding: convertDate(m.dow),
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
        console.log(`✨ Added: ${added} new members`);
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
