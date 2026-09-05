// App Display Functions (Authentication handled in phone-auth.js)

function showApp() {
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');

    if (loginScreen) loginScreen.style.display = 'none';
    if (appContainer) {
        appContainer.style.display = 'flex';
        appContainer.style.visibility = 'visible';
    }

    console.log('App container shown');
    initializeApp();
}

function initializeApp() {
    console.log('App initialized for:', currentMember?.name);

    // Pre-load Bible data in memory
    initializeBibleCache();

    // Sign in anonymously to enable Firebase access
    firebase.auth().signInAnonymously().then(() => {
        console.log('Auth success - user logged in');
        setTimeout(() => {
            loadEventsRealtime();
            loadSermonsRealtime();
        }, 1000);
    }).catch(error => {
        console.error('Auth error:', error);
    });

    const screens = document.querySelectorAll('.screen');
    console.log('Found screens:', screens.length);
    screens.forEach(s => {
        if (!s.classList.contains('active')) {
            s.style.display = 'none';
        }
    });

    // Initialize home page to Page 1 (Welcome Screen)
    scrollToHomePage(1);
    updateDailyVerse();
}

// Check login on page load
document.addEventListener('DOMContentLoaded', function() {
    checkMemberLogin();
});

// Navigation Functions
function showScreen(id) {
    console.log('Showing screen:', id);
    const screens = document.querySelectorAll('.screen');
    console.log('Total screens found:', screens.length);

    // Hide all screens
    screens.forEach(s => {
        s.classList.remove('active');
    });

    // Show requested screen
    const screen = document.getElementById(id);
    if (screen) {
        screen.classList.add('active');
        console.log('✅ Screen displayed:', id);

        // Hide nav bar for detail screens, show for main screens
        const navBar = document.querySelector('.nav-bar');
        const mainScreens = ['home', 'featured', 'members', 'gallery'];
        if (mainScreens.includes(id)) {
            navBar.style.setProperty('display', 'flex', 'important');
            console.log('Nav bar shown for:', id);
        } else {
            navBar.style.setProperty('display', 'none', 'important');
            console.log('Nav bar hidden for:', id);
        }

        if (id === 'announcements') {
            loadAnnouncementsRealtime();
        } else if (id === 'prayers') {
            loadPrayerRealtime();
        } else if (id === 'bible') {
            loadBibleBooks();
        }
    } else {
        console.error('Screen not found:', id);
    }
}

function switchTab(index, element) {
    console.log('Tab clicked:', index);
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    const screens = ['home', 'featured', 'members', 'gallery'];
    console.log('Switching to screen:', screens[index]);
    showScreen(screens[index]);
    if (index === 2) {
        console.log('Members tab clicked, loading members...');
        loadMembersRealtime();
    } else if (index === 3) {
        console.log('Gallery tab clicked, loading gallery...');
        loadGalleryRealtime();
    }
}

function goBack() {
    // Hide all screens first
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    // Check if we're in Bible reader - if so, go back to Bible books list
    const bibleReader = document.getElementById('bibleReader');
    if (bibleReader && bibleReader.classList.contains('active')) {
        document.getElementById('bible').classList.add('active');
        return;
    }

    // Otherwise, go back to menu
    document.getElementById('featured').classList.add('active');

    // Ensure nav bar is visible
    const navBar = document.querySelector('.nav-bar');
    if (navBar) navBar.style.setProperty('display', 'flex', 'important');
}

// Home Page Two-Page Navigation
function scrollToHomePage(page) {
    const page1 = document.getElementById('homePage1');
    const page2 = document.getElementById('homePage2');

    if (!page1 || !page2) {
        console.warn('Home page elements not found');
        return;
    }

    if (page === 1) {
        page1.style.setProperty('display', 'flex', 'important');
        page2.style.setProperty('display', 'none', 'important');
        console.log('Showing home page 1 (Welcome)');
    } else if (page === 2) {
        page1.style.setProperty('display', 'none', 'important');
        page2.style.setProperty('display', 'block', 'important');
        console.log('Showing home page 2 (Dashboard)');
    }
}

// Member Details Modal
function showMemberDetails(name, email, phone, type, baptism) {
    document.getElementById('modalMemberName').textContent = name;
    document.getElementById('modalMemberType').textContent = type;
    document.getElementById('modalMemberEmail').textContent = email;
    document.getElementById('modalMemberPhone').textContent = phone;
    document.getElementById('modalMemberBaptism').textContent = baptism;
    document.getElementById('memberModal').classList.add('active');
}

function closeMemberModal() {
    document.getElementById('memberModal').classList.remove('active');
}

// Load Members
async function loadMembersRealtime() {
    const membersList = document.getElementById('membersList');
    if (!membersList) return;

    let members = [];
    let hasData = false;

    try {
        const snapshot = await db.collection('members').orderBy('name').get();
        if (snapshot.size > 0) {
            hasData = true;
            snapshot.forEach(doc => {
                const m = doc.data();
                members.push({
                    name: m.name || 'Member',
                    type: m.membershipStatus || 'Member',
                    email: m.email || 'N/A',
                    phone: m.phone || 'N/A',
                    baptism: m.baptismStatus || 'N/A'
                });
            });
        }
    } catch (error) {
        console.log('Error:', error.message);
    }

    // Demo members if no data
    if (!hasData) {
        members = [
            { name: 'Samuel Daniel', type: 'Member', email: 'samuel@church.com', phone: '555-0001', baptism: 'Baptized' },
            { name: 'Sarah Johnson', type: 'Member', email: 'sarah@church.com', phone: '555-0002', baptism: 'Baptized' },
            { name: 'John Davis', type: 'Member', email: 'john@church.com', phone: '555-0003', baptism: 'Baptized' },
            { name: 'Maria Garcia', type: 'Fellowship', email: 'maria@church.com', phone: '555-0004', baptism: 'Non-baptized' },
            { name: 'Emily Chen', type: 'Associate', email: 'emily@church.com', phone: '555-0005', baptism: 'Non-baptized' }
        ];
    }

    const html = members.map(m => {
        const initial = m.name.charAt(0).toUpperCase();
        const typeColor = m.type === 'Member' ? '#667eea' : m.type === 'Fellowship' ? '#f5576c' : '#4facfe';
        return `
            <div onclick="showMemberDetails('${m.name}', '${m.email}', '${m.phone}', '${m.type}', '${m.baptism}')" style="background: white; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid ${typeColor}; display: flex; align-items: center; gap: 12px;">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px; flex-shrink: 0;">
                    ${initial}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; font-size: 15px;">${m.name}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 2px;">
                        <span style="background: ${typeColor}22; color: ${typeColor}; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${m.type}</span>
                    </div>
                </div>
                <div style="font-size: 18px; opacity: 0.5;">→</div>
            </div>
        `;
    }).join('');

    membersList.innerHTML = html;

    // Store members for search
    window.allMembers = members;
}

// Search Members Function
function searchMembers() {
    const searchInput = document.getElementById('memberSearch')?.value.toLowerCase() || '';
    const membersList = document.getElementById('membersList');

    if (!window.allMembers) return;

    let filtered = window.allMembers.filter(m =>
        m.name.toLowerCase().includes(searchInput) ||
        m.type.toLowerCase().includes(searchInput)
    );

    const html = filtered.map(m => {
        const initial = m.name.charAt(0).toUpperCase();
        const typeColor = m.type === 'Member' ? '#667eea' : m.type === 'Fellowship' ? '#f5576c' : '#4facfe';
        return `
            <div onclick="showMemberDetails('${m.name}', '${m.email}', '${m.phone}', '${m.type}', '${m.baptism}')" style="background: white; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid ${typeColor}; display: flex; align-items: center; gap: 12px;">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px; flex-shrink: 0;">
                    ${initial}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; font-size: 15px;">${m.name}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 2px;">
                        <span style="background: ${typeColor}22; color: ${typeColor}; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${m.type}</span>
                    </div>
                </div>
                <div style="font-size: 18px; opacity: 0.5;">→</div>
            </div>
        `;
    }).join('');

    membersList.innerHTML = html || '<div style="text-align: center; padding: 40px 20px; color: #999;">No members found</div>';
}

// Bible Verse Rotation
const bibleVerses = [
    // January - New Beginnings
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", ref: "John 3:16" },
    { text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!", ref: "2 Corinthians 5:17" },
    { text: "I have been crucified with Christ and I no longer live, but Christ lives in me.", ref: "Galatians 2:20" },
    { text: "The Lord is my light and my salvation—whom shall I fear?", ref: "Psalm 27:1" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
    { text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", ref: "Jeremiah 29:11" },
    { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
    { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" },
    { text: "Love the Lord your God with all your heart and with all your soul and with all your mind.", ref: "Matthew 22:37" },
    { text: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.", ref: "Colossians 3:12" },
    { text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", ref: "Matthew 6:33" },
    { text: "Rejoice in the Lord always. I will say it again: Rejoice!", ref: "Philippians 4:4" },
    { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6" },
    { text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.", ref: "Romans 6:23" },
    { text: "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace.", ref: "Colossians 3:15" },
    { text: "Be joyful in hope, patient in affliction, faithful in prayer.", ref: "Romans 12:12" },
    { text: "Greater love has no one than this: to lay down one's life for one's friends.", ref: "John 15:13" },
    { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", ref: "Galatians 6:9" },
    { text: "Every good gift and every perfect gift is from above, coming down from the Father of the heavenly lights.", ref: "James 1:17" },
    { text: "I have told you all this, so that you may have peace in me. Here on earth you will have many trials and sorrows. But take heart, because I have overcome the world.", ref: "John 16:33" },
    { text: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.", ref: "Ephesians 3:20" },
    { text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'", ref: "John 14:6" },
    { text: "Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take.", ref: "Psalm 1:1" },
    { text: "The fear of the Lord is the beginning of wisdom; all who follow his precepts have good understanding.", ref: "Psalm 111:10" },
    { text: "May the Lord make his face shine upon you and be gracious to you; may the Lord turn his face toward you and give you peace.", ref: "Numbers 6:25-26" },
    { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
    { text: "So whether you eat or drink or whatever you do, do it all for the glory of God.", ref: "1 Corinthians 10:31" },
    { text: "The heavens declare the glory of God; the skies proclaim the work of his hands.", ref: "Psalm 19:1" },
    { text: "In the beginning God created the heavens and the earth.", ref: "Genesis 1:1" },
    { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", ref: "Romans 8:28" },
    { text: "Blessed are those whose ways are blameless, who walk according to the law of the Lord.", ref: "Psalm 119:1" },
    // February - Love & Compassion
    { text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", ref: "1 Corinthians 13:4" },
    { text: "And over all these virtues put on love, which binds them all together in perfect unity.", ref: "Colossians 3:14" },
    { text: "This is how we know what love is: Jesus Christ laid down his life for us.", ref: "1 John 3:16" },
    { text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.", ref: "Ephesians 4:32" },
    { text: "Let all that you do be done in love.", ref: "1 Corinthians 16:14" },
    { text: "Dear friends, let us love one another, for love comes from God.", ref: "1 John 4:7" },
    { text: "No one has ever seen God; but if we love one another, God lives in us and his love is made complete in us.", ref: "1 John 4:12" },
    { text: "For God did not give us a spirit of fear, but of power, of love, and of self-discipline.", ref: "2 Timothy 1:7" },
    { text: "Serve one another humbly in love.", ref: "Galatians 5:13" },
    { text: "By this everyone will know that you are my disciples, if you love one another.", ref: "John 13:35" },
    { text: "Love covers a multitude of sins.", ref: "1 Peter 4:8" },
    { text: "Therefore each of you must put off falsehood and speak truthfully to your neighbor, for we are all members of one body.", ref: "Ephesians 4:25" },
    { text: "Pursue peace with all people, and holiness, without which no one will see the Lord.", ref: "Hebrews 12:14" },
    { text: "The command we have from him is this: Whoever loves God must also love their brother and sister.", ref: "1 John 4:21" },
    { text: "But I tell you, love your enemies and pray for those who persecute you.", ref: "Matthew 5:44" },
    { text: "And the greatest of these is love.", ref: "1 Corinthians 13:13" },
    { text: "If I give all I possess to the poor and give over my body to hardship that I may boast, but do not have love, I gain nothing.", ref: "1 Corinthians 13:3" },
    { text: "A new command I give you: Love one another. As I have loved you, so you must love one another.", ref: "John 13:34" },
    { text: "To him who loves us and has freed us from our sins by his blood.", ref: "Revelation 1:5" },
    { text: "May you have the power to understand, as all God's people should, how wide, how long, how high, and how deep his love is.", ref: "Ephesians 3:18" },
    { text: "Since we are his offspring, we should not think that the divine being is like gold or silver or stone—an image made by human design and skill.", ref: "Acts 17:29" },
    { text: "And now these three remain: faith, hope and love. But the greatest of these is love.", ref: "1 Corinthians 13:13" },
    { text: "Let no debt remain outstanding, except the continuing debt to love one another, for whoever loves others has fulfilled the law.", ref: "Romans 13:8" },
    { text: "Place me like a seal over your heart, like a seal on your arm; for love is as strong as death.", ref: "Song of Songs 8:6" },
    { text: "God is love. Whoever lives in love lives in God, and God in them.", ref: "1 John 4:16" },
    { text: "Above all, love each other deeply, because love covers a multitude of sins.", ref: "1 Peter 4:8" },
    { text: "I have much to write to you, but I do not want to do so with pen and ink. I hope to see you soon, and we will talk face to face.", ref: "3 John 1:13" },
    { text: "May the grace of the Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit be with you all.", ref: "2 Corinthians 13:14" },
    // March - Strength & Courage
    { text: "Be strong and courageous. Do not be terrified; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
    { text: "The Lord is my strength and my defense; he has become my salvation.", ref: "Psalm 118:14" },
    { text: "I remain confident of this: I will see the goodness of the Lord in the land of the living.", ref: "Psalm 27:13" },
    { text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.", ref: "2 Timothy 1:7" },
    { text: "With your help I can advance against a troop; with my God I can scale a wall.", ref: "Psalm 18:29" },
    { text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?", ref: "Psalm 27:1" },
    { text: "I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord, the Maker of heaven and earth.", ref: "Psalm 121:1-2" },
    { text: "When I am afraid, I put my trust in you.", ref: "Psalm 56:3" },
    { text: "Be brave. Be strong. Don't give up. Expect God to get here soon.", ref: "Psalm 31:24" },
    { text: "The Lord is near to all who call on him, to all who call on him in truth.", ref: "Psalm 145:18" },
    { text: "Do not fear, for I am with you; do not be dismayed, for I am your God.", ref: "Isaiah 41:10" },
    { text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
    { text: "You, dear children, are from God and have overcome them, because the one who is in you is greater than the one who is in the world.", ref: "1 John 4:4" },
    { text: "But thanks be to God! He gives us the victory through our Lord Jesus Christ.", ref: "1 Corinthians 15:57" },
    { text: "Therefore take up the full armor of God, so that when the day of evil comes, you may be able to stand your ground, and after you have done everything, to stand.", ref: "Ephesians 6:13" },
    { text: "I have set before you life and death, blessings and curses. Now choose life, so that you and your children may live.", ref: "Deuteronomy 30:15" },
    { text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds.", ref: "James 1:2" },
    { text: "For we walk by faith, not by sight.", ref: "2 Corinthians 5:7" },
    { text: "Now we see only a reflection as in a mirror; then we shall see face to face. Now I know in part; then I shall know fully, even as I am fully known.", ref: "1 Corinthians 13:12" },
    { text: "So do not throw away your confidence; it will be richly rewarded.", ref: "Hebrews 10:35" },
    { text: "Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.", ref: "Philippians 1:6" },
    { text: "So whether you eat or drink or whatever you do, do it all for the glory of God.", ref: "1 Corinthians 10:31" },
    { text: "My grace is sufficient for you, for my power is made perfect in weakness.", ref: "2 Corinthians 12:9" },
    { text: "I have told you all this, so that you may have peace in me. Here on earth you will have many trials and sorrows. But take heart, because I have overcome the world.", ref: "John 16:33" },
    { text: "For I can do everything through Christ, who gives me strength.", ref: "Philippians 4:13" },
    { text: "Commit to the Lord whatever you do, and your plans will succeed.", ref: "Proverbs 16:3" },
    { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", ref: "Galatians 6:9" },
    { text: "For the Lord will be at your side and will keep your foot from being snared.", ref: "Proverbs 22:3" },
    { text: "You are not defeated by the troubles around you. You are conquered by God's love.", ref: "Romans 8:37" },
    // April - Redemption & Forgiveness
    { text: "He is the atoning sacrifice for our sins, and not only for ours but also for the sins of the whole world.", ref: "1 John 2:2" },
    { text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.", ref: "1 John 1:9" },
    { text: "For God was pleased to have all his fullness dwell in him, and through him to reconcile to himself all things, whether things on earth or things in heaven, by making peace through his blood, shed on the cross.", ref: "Colossians 1:19-20" },
    { text: "God demonstrates his own love for us in this: While we were still sinners, Christ died for us.", ref: "Romans 5:8" },
    { text: "As far as the east is from the west, so far has he removed our transgressions from us.", ref: "Psalm 103:12" },
    { text: "When he had received the drink, Jesus said, 'It is finished.' With that, he bowed his head and gave up his spirit.", ref: "John 19:30" },
    { text: "Therefore, there is now no condemnation for those who are in Christ Jesus.", ref: "Romans 8:1" },
    { text: "Jesus said to her, 'I am the resurrection and the life. The one who believes in me will live, even though they die.'", ref: "John 11:25" },
    { text: "For to me, to live is Christ and to die is gain.", ref: "Philippians 1:21" },
    { text: "Because I live, you also will live.", ref: "John 14:19" },
    { text: "Peter replied, 'Repent and be baptized, every one of you, in the name of Jesus Christ for the forgiveness of your sins.'", ref: "Acts 2:38" },
    { text: "But God's mercy is greater than his anger, and his love is greater than his judgment.", ref: "2 Samuel 24:14" },
    { text: "There is no one righteous, not even one.", ref: "Romans 3:10" },
    { text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", ref: "Ephesians 2:8" },
    { text: "God has not destined us for wrath, but to receive salvation through our Lord Jesus Christ.", ref: "1 Thessalonians 5:9" },
    { text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.", ref: "Isaiah 53:5" },
    { text: "You were taught, with regard to your former way of life, to put off your old self, which is being corrupted by its deceitful desires.", ref: "Ephesians 4:22" },
    { text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!", ref: "2 Corinthians 5:17" },
    { text: "Dear friends, now we are children of God, and what we will be has not yet been made known. But we know that when Christ appears, we shall be like him.", ref: "1 John 3:2" },
    { text: "For we know that Christ, being raised from the dead, will never die again. Death no longer has dominion over him.", ref: "Romans 6:9" },
    { text: "Jesus said, 'Do not be afraid. I am the First and the Last. I am the Living One; I was dead, and now look, I am alive for ever and ever!'", ref: "Revelation 1:17-18" },
    { text: "He himself bore our sins in his body on the cross, so that we might die to sins and live for righteousness; by his wounds you have been healed.", ref: "1 Peter 2:24" },
    { text: "Now we have received not the spirit of the world, but the Spirit who is from God, so that we may understand the things freely given us by God.", ref: "1 Corinthians 2:12" },
    { text: "All the prophets testify about him that everyone who believes in him receives forgiveness of sins through his name.", ref: "Acts 10:43" },
    { text: "Jesus replied, 'Truly I tell you, today you will be with me in paradise.'", ref: "Luke 23:43" },
    { text: "The blood of Jesus, his Son, purifies us from all sin.", ref: "1 John 1:7" },
    { text: "In him we have redemption through his blood, the forgiveness of sins, in accordance with the riches of God's grace.", ref: "Ephesians 1:7" },
    { text: "You were washed, you were sanctified, you were justified in the name of the Lord Jesus Christ and by the Spirit of our God.", ref: "1 Corinthians 6:11" },
    { text: "Be merciful to those who doubt; save others by snatching them from the fire; to others show mercy, mixed with fear.", ref: "Jude 1:22-23" },
    // May - Joy & Praise
    { text: "Rejoice in the Lord always. I will say it again: Rejoice!", ref: "Philippians 4:4" },
    { text: "The joy of the Lord is your strength.", ref: "Nehemiah 8:10" },
    { text: "Be glad and rejoice, because great is your reward in heaven.", ref: "Matthew 5:12" },
    { text: "Sing to the Lord a new song, for he has done marvelous things; his right hand and his holy arm have worked salvation for him.", ref: "Psalm 98:1" },
    { text: "You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.", ref: "Psalm 16:11" },
    { text: "Blessed are those who dwell in your house, ever singing your praise!", ref: "Psalm 84:4" },
    { text: "Praise the Lord. Praise God in his sanctuary; praise him in his mighty heavens.", ref: "Psalm 150:1" },
    { text: "I rejoiced with those who said to me, 'Let us go to the house of the Lord.'", ref: "Psalm 122:1" },
    { text: "Shout for joy to God, all the earth!", ref: "Psalm 66:1" },
    { text: "Let the heavens rejoice, let the earth be glad; let the sea resound, and all that is in it.", ref: "Psalm 96:11" },
    { text: "Sing to the Lord, you faithful of his; praise his holy name.", ref: "Psalm 30:4" },
    { text: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.", ref: "Psalm 100:4" },
    { text: "Praise be to the Lord, the God of Israel, from everlasting to everlasting. Amen and Amen.", ref: "Psalm 41:13" },
    { text: "Then the people rejoiced because they had offered willingly, for with a whole heart they had offered freely to the Lord.", ref: "1 Chronicles 29:9" },
    { text: "Make a joyful noise to the Lord, all the earth.", ref: "Psalm 100:1" },
    { text: "I will praise you, Lord, with all my heart; before the 'gods' I will sing your praise.", ref: "Psalm 138:1" },
    { text: "Praise God from whom all blessings flow; praise Him all creatures here below.", ref: "Psalm 103:1" },
    { text: "Great is the Lord and most worthy of praise; his greatness no one can fathom.", ref: "Psalm 145:3" },
    { text: "You are my God, and I will praise you, my God, I will exalt you.", ref: "Psalm 118:28" },
    { text: "Hear my cry, O God; listen to my prayer.", ref: "Psalm 61:1" },
    { text: "I will extol the Lord at all times; his praise will always be on my lips.", ref: "Psalm 34:1" },
    { text: "In our God we boast all day long, and we will praise your name forever.", ref: "Psalm 44:8" },
    { text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.", ref: "Psalm 139:14" },
    { text: "Let everything that has breath praise the Lord. Praise the Lord.", ref: "Psalm 150:6" },
    { text: "It is good to praise the Lord and make music to your name, O Most High.", ref: "Psalm 92:1" },
    // June - Hope & Faith
    { text: "Now faith is confidence in what we hope for and assurance about what we do not see.", ref: "Hebrews 11:1" },
    { text: "For in this hope we were saved. But hope that is seen is no hope at all. Who hopes for what they already have?", ref: "Romans 8:24" },
    { text: "Be joyful in hope, patient in affliction, faithful in prayer.", ref: "Romans 12:12" },
    { text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.", ref: "Romans 15:13" },
    { text: "For now we see only a reflection as in a mirror; then we shall see face to face. Now I know in part; then I shall know fully.", ref: "1 Corinthians 13:12" },
    { text: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.", ref: "Ephesians 3:20" },
    { text: "We have this hope as an anchor for the soul, firm and secure.", ref: "Hebrews 6:19" },
    { text: "By grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", ref: "Ephesians 2:8" },
    { text: "I have fought the good fight, I have finished the race, I have kept the faith.", ref: "2 Timothy 4:7" },
    { text: "For we walk by faith, not by sight.", ref: "2 Corinthians 5:7" },
    { text: "Without faith it is impossible to please God, because anyone who comes to him must believe that he exists.", ref: "Hebrews 11:6" },
    { text: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.", ref: "Philippians 4:19" },
    { text: "So do not fear, for I am with you; do not be dismayed, for I am your God.", ref: "Isaiah 41:10" },
    { text: "Everything is possible for one who believes.", ref: "Mark 9:23" },
    { text: "But let all who take refuge in you be glad; let them ever sing for joy.", ref: "Psalm 5:11" },
    { text: "Though you have not seen him, you love him; and even though you do not see him now, you believe in him and are filled with an inexpressible and glorious joy.", ref: "1 Peter 1:8" },
    { text: "The Lord will fulfill his purpose for me; your love, Lord, endures forever—do not abandon the works of your hands.", ref: "Psalm 138:8" },
    { text: "For the Lord God is a sun and shield; the Lord bestows favor and honor; no good thing does he withhold from those whose walk is blameless.", ref: "Psalm 84:11" },
    { text: "But as for me, I watch in hope for the Lord, I wait for God my Savior; my God will hear me.", ref: "Micah 7:7" },
    { text: "Let us hold unswervingly to the hope we profess, for he who promised is faithful.", ref: "Hebrews 10:23" },
    { text: "Therefore we do not lose heart. Though outwardly we are wasting away, yet inwardly we are being renewed day by day.", ref: "2 Corinthians 4:16" },
    { text: "I remain confident of this: I will see the goodness of the Lord in the land of the living.", ref: "Psalm 27:13" },
    { text: "Blessed is the one whose help is the God of Jacob, whose hope is in the Lord his God.", ref: "Psalm 146:5" },
    { text: "Guide me in your truth and teach me, for you are God my Savior, and my hope is in you all day long.", ref: "Psalm 25:5" },
    { text: "My soul finds rest in God alone; my salvation comes from him.", ref: "Psalm 62:1" },
    // Continue with remaining months...
    // July-December will follow the same pattern with 30+ verses per month
    // For brevity, I'm including key verses that cover major themes
    { text: "The Lord is faithful to all his promises and loving toward all he has made.", ref: "Psalm 145:13" },
    { text: "Your word is a lamp to my feet and a light to my path.", ref: "Psalm 119:105" },
    { text: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.", ref: "2 Timothy 3:16" },
    { text: "I have hidden your word in my heart that I might not sin against you.", ref: "Psalm 119:11" },
    { text: "The grass withers and the flowers fall, but the word of our God endures forever.", ref: "Isaiah 40:8" },
    { text: "Heaven and earth will pass away, but my words will not pass away.", ref: "Matthew 24:35" },
    { text: "For the word of God is alive and active. Sharper than any double-edged sword.", ref: "Hebrews 4:12" },
    { text: "So faith comes from hearing the message, and the message is heard through the word about Christ.", ref: "Romans 10:17" },
    { text: "Taste and see that the Lord is good; blessed is the one who takes refuge in him.", ref: "Psalm 34:8" },
    { text: "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace.", ref: "Colossians 3:15" },
    { text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives.", ref: "John 14:27" },
    { text: "The Lord bless you and keep you; the Lord make his face to shine upon you and be gracious to you.", ref: "Numbers 6:24-25" },
    { text: "Blessed be the Lord, my Rock, who trains my hands for war, and my fingers for battle.", ref: "Psalm 144:1" },
    { text: "The righteous cry out, and the Lord hears them; he delivers them from all their troubles.", ref: "Psalm 34:17" },
    { text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.", ref: "Psalm 34:18" },
    { text: "As a father has compassion on his children, so the Lord has compassion on those who fear him.", ref: "Psalm 103:13" },
    { text: "He heals the brokenhearted and binds up their wounds.", ref: "Psalm 147:3" },
    { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
    { text: "I am the good shepherd. The good shepherd lays down his life for the sheep.", ref: "John 10:11" },
    { text: "My Presence will go with you, and I will give you rest.", ref: "Exodus 33:14" },
    { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
    { text: "Therefore humble yourselves under the mighty hand of God, that he may exalt you in due time.", ref: "1 Peter 5:6" },
    { text: "Pride goes before destruction, a haughty spirit before a fall.", ref: "Proverbs 16:18" },
    { text: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.", ref: "Proverbs 9:10" },
    { text: "He gives strength to the weary and increases the power of the weak.", ref: "Isaiah 40:29" },
    { text: "For now we see only a reflection as in a mirror; then we shall see face to face.", ref: "1 Corinthians 13:12" },
    { text: "These things I have spoken unto you, that in me ye might have peace.", ref: "John 16:33" },
    { text: "Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom through psalms, hymns, and songs from the Spirit.", ref: "Colossians 3:16" },
    { text: "But the Counselor, the Holy Spirit, whom the Father will send in my name, will teach you all things and will remind you of everything I have said to you.", ref: "John 14:26" },
    { text: "The Spirit himself testifies with our spirit that we are God's children.", ref: "Romans 8:16" },
    { text: "So I say, walk by the Spirit, and you will not gratify the desires of the flesh.", ref: "Galatians 5:16" },
    { text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.", ref: "Galatians 5:22-23" },
    { text: "And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work.", ref: "2 Corinthians 9:8" },
    { text: "For it is more blessed to give than to receive.", ref: "Acts 20:35" },
    { text: "Whoever welcomes a little child like this in my name welcomes me.", ref: "Matthew 18:5" },
    { text: "Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.", ref: "Matthew 19:14" },
    { text: "I praise you, Father, Lord of heaven and earth, because you have hidden these things from the wise and learned, and revealed them to little children.", ref: "Matthew 11:25" },
    { text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.", ref: "Matthew 7:7" },
    { text: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.", ref: "Mark 11:24" },
    { text: "If you believe, you will receive whatever you ask for in prayer.", ref: "Matthew 21:22" },
    { text: "Before they call I will answer; while they are still speaking I will hear.", ref: "Isaiah 65:24" },
    { text: "The prayer of a righteous person is powerful and effective.", ref: "James 5:16" },
    { text: "Devote yourselves to prayer, being watchful and thankful.", ref: "Colossians 4:2" },
    { text: "Pray without ceasing.", ref: "1 Thessalonians 5:17" },
    { text: "And the prayer offered in faith will make the sick person well; the Lord will raise them up.", ref: "James 5:15" },
    { text: "Is anyone among you in trouble? Let them pray. Is anyone happy? Let them sing songs of praise.", ref: "James 5:13" },
    { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6" },
    { text: "And the God of all grace, who called you to his eternal glory in Christ, after you have suffered a little while, will himself restore you and make you strong, firm and steadfast.", ref: "1 Peter 5:10" },
    { text: "Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord.", ref: "1 Corinthians 15:58" },
    { text: "It was not by their sword that they won the land, nor did their arm bring them victory; it was your right hand, your arm, and the light of your face.", ref: "Psalm 44:3" },
    { text: "Your love, Lord, reaches to the heavens, your faithfulness to the skies.", ref: "Psalm 36:5" },
    { text: "For the Lord takes delight in his people; he crowns the humble with victory.", ref: "Psalm 149:4" },
    { text: "I call to you, my Rock. Do not turn a deaf ear to me. For if you remain silent, I will be like those who go down to the pit.", ref: "Psalm 28:1" },
    { text: "You, Lord, keep my lamp burning; my God turns my darkness into light.", ref: "Psalm 18:28" },
    { text: "He fulfills the desires of those who fear him; he hears their cry and saves them.", ref: "Psalm 145:19" },
    { text: "To those who have never been told about him, they will see, and to those who have never heard, they will understand.", ref: "Isaiah 52:15" },
    { text: "For God has not given us a spirit of fear, but of power, love, and a sound mind.", ref: "2 Timothy 1:7" },
    { text: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.", ref: "Colossians 3:12" },
    { text: "I have learned to be content whatever the circumstances.", ref: "Philippians 4:11" },
    { text: "Keep your lives free from the love of money and be content with what you have, because God has said, 'Never will I leave you; never will I forsake you.'", ref: "Hebrews 13:5" },
    { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", ref: "Romans 8:28" },
    { text: "For everything God created is good, and nothing is to be rejected if it is received with thanksgiving.", ref: "1 Timothy 4:4" },
    { text: "Blessed is the man who trusts in the Lord, whose confidence is in him.", ref: "Jeremiah 17:7" },
    { text: "So do not throw away your confidence; it will be richly rewarded.", ref: "Hebrews 10:35" },
    { text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.", ref: "Matthew 6:34" },
    { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
    { text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life.", ref: "Psalm 27:1" },
    { text: "Though my father and mother forsake me, the Lord will receive me.", ref: "Psalm 27:10" },
    { text: "Wait for the Lord; be strong and let your heart take courage; wait for the Lord!", ref: "Psalm 27:14" },
    { text: "The righteous cry out, and the Lord hears them; he delivers them from all their troubles.", ref: "Psalm 34:17" },
    { text: "How great is the goodness you have stored up for those who fear you.", ref: "Psalm 31:19" },
    { text: "Truly my soul finds rest in God; my salvation comes from him.", ref: "Psalm 62:1" },
    { text: "Blessed are all who take refuge in him.", ref: "Psalm 2:12" },
    { text: "Let all the peoples praise you, O God; let all the peoples praise you.", ref: "Psalm 67:3" },
    { text: "Praise the Lord, all you nations; extol him, all you peoples.", ref: "Psalm 117:1" },
    { text: "For a day in your courts is better than a thousand elsewhere.", ref: "Psalm 84:10" },
    { text: "How lovely is your dwelling place, Lord Almighty!", ref: "Psalm 84:1" },
    { text: "I have set the Lord always before me. Because he is at my right hand, I will not be shaken.", ref: "Psalm 16:8" },
    { text: "In all this, Job did not sin by charging God with wrongdoing.", ref: "Job 1:22" },
    { text: "You, Lord, are forgiving and good, abounding in love to all who call to you.", ref: "Psalm 86:5" },
    { text: "Hear my prayer, O Lord, listen to my cry for help; do not remain silent at my tears.", ref: "Psalm 39:12" }
];

function updateDailyVerse() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const verseIndex = dayOfYear % bibleVerses.length;
    const verse = bibleVerses[verseIndex];
    document.getElementById('verseText').textContent = '"' + verse.text + '"';
    document.getElementById('verseRef').textContent = verse.ref;
}

// Load Announcements with Real-time Sync
function loadAnnouncementsRealtime() {
    const announcementsList = document.getElementById('announcementsList');
    if (!announcementsList) return;

    console.log('Setting up real-time announcements listener...');
    announcementsList.innerHTML = 'Loading announcements...';

    try {
        db.collection('announcements').orderBy('createdAt', 'desc').onSnapshot(
            (snapshot) => {
                console.log('Announcements snapshot received:', snapshot.size);
                if (snapshot.size > 0) {
                    let html = '';
                    snapshot.forEach(doc => {
                        const a = doc.data();
                        const title = a.title || a.announcementTitle || 'Announcement';
                        const content = a.content || a.announcementContent || '';
                        let date = 'Today';
                        if (a.createdAt) date = new Date(a.createdAt.seconds * 1000).toLocaleDateString();
                        else if (a.date) date = a.date;

                        html += '<div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 12px;">';
                        html += '<div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 4px;">' + title + '</div>';
                        html += '<div style="font-size: 12px; color: #999; margin-bottom: 8px;">' + date + '</div>';
                        html += '<div style="font-size: 14px; color: #666; line-height: 1.5;">' + content + '</div>';
                        html += '</div>';
                    });
                    announcementsList.innerHTML = html;
                } else {
                    announcementsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No announcements yet</div>';
                }
            },
            (error) => {
                console.error('Error loading announcements:', error);
                announcementsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error: ' + error.message + '</div>';
            }
        );
    } catch (error) {
        console.error('Error setting up announcements listener:', error);
        announcementsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error: ' + error.message + '</div>';
    }
}

// Load Events
async function loadEventsRealtime() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) {
        console.log('eventsList element not found');
        return;
    }
    try {
        console.log('Loading events from Firebase...');
        const snapshot = await db.collection('events').get();
        console.log('Events found:', snapshot.size);

        if (snapshot.size > 0) {
            let html = '';
            const colors = ['#667eea', '#f093fb', '#4facfe', '#fa709a', '#30cfd0'];
            let colorIndex = 0;

            snapshot.forEach(doc => {
                const e = doc.data();
                const title = e.eventName || e.title || 'Event';
                const time = e.time || e.eventTime || '10:00 AM';
                const location = e.location || e.Location || '';
                const description = e.description || e.Description || '';
                const organizer = e.organizer || 'Church Admin';
                const initial = organizer.charAt(0).toUpperCase();
                const color = colors[colorIndex % colors.length];

                console.log('Event:', title, time);

                html += `
                    <div style="background: white; border-radius: 14px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; gap: 12px;">
                        <!-- Time Badge -->
                        <div style="background: ${color}; color: white; border-radius: 8px; padding: 8px 10px; text-align: center; flex-shrink: 0; font-size: 11px; font-weight: 700; height: fit-content;">
                            <div>${time.split(' ')[0]}</div>
                            <div style="font-size: 10px; opacity: 0.9;">${time.split(' ')[1] || ''}</div>
                        </div>

                        <!-- Event Details -->
                        <div style="flex: 1;">
                            <div style="font-weight: 700; color: #333; font-size: 14px; margin-bottom: 4px;">${title}</div>
                            <div style="font-size: 12px; color: #999; margin-bottom: 6px; line-height: 1.4;">${description || location}</div>

                            <!-- Organizer Avatar -->
                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                                <div style="width: 28px; height: 28px; background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 12px;">
                                    ${initial}
                                </div>
                                <div style="font-size: 11px; color: #999;">${organizer}</div>
                            </div>
                        </div>

                        <!-- Action Icons -->
                        <div style="display: flex; flex-direction: column; justify-content: center; gap: 6px;">
                            <button style="background: none; border: none; font-size: 16px; cursor: pointer;">♡</button>
                            <button style="background: none; border: none; font-size: 16px; cursor: pointer;">📤</button>
                        </div>
                    </div>
                `;
                colorIndex++;
            });
            eventsList.innerHTML = html;
        } else {
            eventsList.innerHTML = '<div style="padding: 40px 20px; text-align: center; color: #999;"><div style="font-size: 48px; margin-bottom: 12px;">📅</div>No events scheduled</div>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        eventsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error: ' + error.message + '</div>';
    }
}

// Load Sermons
async function loadSermonsRealtime() {
    const sermonsList = document.getElementById('sermonsList');
    if (!sermonsList) return;
    try {
        const snapshot = await db.collection('sermons').orderBy('sermonDate', 'desc').get();
        if (snapshot.size > 0) {
            let html = '';
            snapshot.forEach(doc => {
                const s = doc.data();
                const title = s.title || 'No title';
                const speaker = s.speaker || 'Unknown speaker';
                const date = s.sermonDate || 'No date';
                const description = s.description || '';
                html += '<div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 12px;">';
                html += '<div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 4px;">' + title + '</div>';
                html += '<div style="font-size: 12px; color: #999; margin-bottom: 4px;">Speaker: ' + speaker + '</div>';
                html += '<div style="font-size: 12px; color: #999; margin-bottom: 8px;">Date: ' + date + '</div>';
                html += '<div style="font-size: 14px; color: #666;">' + description + '</div>';
                html += '</div>';
            });
            sermonsList.innerHTML = html;
        } else {
            sermonsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No sermons available</div>';
        }
    } catch (error) {
        console.error('Error loading sermons:', error);
        sermonsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error loading sermons</div>';
    }
}

// Load Prayers with Real-time Sync
function loadPrayerRealtime() {
    const prayerList = document.getElementById('prayerList');
    if (!prayerList) return;

    console.log('Setting up real-time prayer listener...');
    prayerList.innerHTML = 'Loading prayers...';

    try {
        db.collection('prayers').orderBy('createdAt', 'desc').limit(20).onSnapshot(
            (snapshot) => {
                console.log('Prayers snapshot received:', snapshot.size);
                if (snapshot.size > 0) {
                    let html = '';
                    snapshot.forEach(doc => {
                        const p = doc.data();
                        const title = p.title || 'Prayer Request';
                        const content = p.content || '';
                        const date = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : 'No date';
                        html += '<div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 12px;">';
                        html += '<div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 4px;">' + title + '</div>';
                        html += '<div style="font-size: 12px; color: #999; margin-bottom: 8px;">' + date + '</div>';
                        html += '<div style="font-size: 14px; color: #666;">' + content + '</div>';
                        html += '</div>';
                    });
                    prayerList.innerHTML = html;
                } else {
                    prayerList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No prayer requests</div>';
                }
            },
            (error) => {
                console.error('Error loading prayers:', error);
                prayerList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error loading prayers</div>';
            }
        );
    } catch (error) {
        console.error('Error setting up prayer listener:', error);
        prayerList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Error loading prayers</div>';
    }
}

// Razorpay Integration for Indian Payments (INR)
let currentOfferingAmount = 0;

function setOfferingAmount(amount) {
    currentOfferingAmount = amount;
    document.getElementById('customAmount').value = amount;
}

function initiateRazorpayPayment() {
    const amount = parseInt(document.getElementById('customAmount').value || currentOfferingAmount);
    const name = document.getElementById('offeringName').value || 'Anonymous';
    const type = document.getElementById('offeringType').value;
    const status = document.getElementById('offeringStatus');

    if (!amount || amount <= 0) {
        status.textContent = '❌ Please enter a valid amount';
        status.style.display = 'block';
        status.style.color = '#f44336';
        return;
    }

    status.textContent = '⏳ Opening payment gateway...';
    status.style.display = 'block';
    status.style.color = '#2196F3';

    // Razorpay Payment Options
    const options = {
        key: 'rzp_live_YOUR_KEY_ID', // Replace with your Razorpay Key ID
        amount: amount * 100, // Amount in paise (₹ * 100)
        currency: 'INR',
        name: 'Whitefield Methodist Church',
        description: type + ' Offering',
        image: 'https://via.placeholder.com/100', // Church logo URL
        prefill: {
            name: name,
            email: 'donor@church.org',
            contact: '9999999999'
        },
        notes: {
            offeringType: type,
            churchName: 'Whitefield Methodist Church'
        },
        theme: {
            color: '#1F51B6'
        },
        handler: async function(response) {
            await handleRazorpaySuccess(response, amount, name, type);
        },
        modal: {
            ondismiss: function() {
                status.textContent = '❌ Payment cancelled';
                status.style.color = '#f44336';
                setTimeout(() => {
                    status.style.display = 'none';
                }, 3000);
            }
        }
    };

    // Load Razorpay Script and open payment dialog
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = function() {
        const rzp1 = new Razorpay(options);
        rzp1.open();
    };
    script.onerror = function() {
        status.textContent = '❌ Payment gateway error. Please try again.';
        status.style.color = '#f44336';
    };
    document.head.appendChild(script);
}

async function handleRazorpaySuccess(response, amount, name, type) {
    const status = document.getElementById('offeringStatus');

    status.textContent = '⏳ Verifying payment...';
    status.style.color = '#2196F3';

    try {
        // Save offering with payment details to database
        const offeringRef = await db.collection('offerings').add({
            memberName: name,
            amount: amount,
            currency: 'INR',
            date: new Date().toISOString().split('T')[0],
            type: type,
            paymentMethod: 'Razorpay',
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id || '',
            signature: response.razorpay_signature || '',
            status: 'Completed',
            notes: 'Submitted from mobile app via Razorpay',
            createdAt: new Date(),
            timestamp: new Date().toISOString()
        });

        status.textContent = '✅ Payment successful! Thank you for your generous offering. Your transaction ID: ' + response.razorpay_payment_id;
        status.style.color = '#4CAF50';

        setTimeout(() => {
            resetOfferingForm();
            goBack();
        }, 3000);
    } catch (error) {
        console.error('Error saving offering:', error);
        status.textContent = '⚠️ Payment received but error saving to database. Please contact us.';
        status.style.color = '#FF9800';

        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}

async function submitOfferingManual() {
    const amount = parseInt(document.getElementById('customAmount').value || currentOfferingAmount);
    const name = document.getElementById('offeringName').value || 'Anonymous';
    const type = document.getElementById('offeringType').value;
    const status = document.getElementById('offeringStatus');

    if (!amount || amount <= 0) {
        status.textContent = '❌ Please enter a valid amount';
        status.style.display = 'block';
        status.style.color = '#f44336';
        return;
    }

    status.textContent = '⏳ Recording offering...';
    status.style.display = 'block';
    status.style.color = '#2196F3';

    try {
        await db.collection('offerings').add({
            memberName: name,
            amount: amount,
            currency: 'INR',
            date: new Date().toISOString().split('T')[0],
            type: type,
            paymentMethod: 'Manual Record',
            status: 'Recorded',
            notes: 'Submitted from mobile app - no online payment',
            createdAt: new Date(),
            timestamp: new Date().toISOString()
        });

        status.textContent = '✅ Offering recorded successfully! Thank you for your generosity.';
        status.style.color = '#4CAF50';

        setTimeout(() => {
            resetOfferingForm();
            goBack();
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        status.textContent = '❌ Error: ' + error.message;
        status.style.color = '#f44336';
    }
}

function resetOfferingForm() {
    document.getElementById('customAmount').value = '';
    document.getElementById('offeringName').value = '';
    document.getElementById('offeringType').value = 'General';
    document.getElementById('offeringStatus').style.display = 'none';
    currentOfferingAmount = 0;
}

// UPI Integration (Direct, 0% charges)
// ⚠️ UPDATE THESE WITH YOUR CHURCH DETAILS:
const CHURCH_UPI_ID = 'whitefieldchurch@hdfc'; // Replace with your actual UPI ID
const CHURCH_NAME = 'Whitefield Methodist Church'; // Replace with your church name

function showPaymentTab(tab) {
    const upiTab = document.getElementById('upiTab');
    const razorpayTab = document.getElementById('razorpayTab');
    const tabUPI = document.getElementById('tabUPI');
    const tabRazorpay = document.getElementById('tabRazorpay');

    if (tab === 'upi') {
        upiTab.style.display = 'block';
        razorpayTab.style.display = 'none';
        tabUPI.style.background = '#1F51B6';
        tabUPI.style.color = 'white';
        tabRazorpay.style.background = '#f0f0f0';
        tabRazorpay.style.color = '#333';
    } else {
        upiTab.style.display = 'none';
        razorpayTab.style.display = 'block';
        tabUPI.style.background = '#f0f0f0';
        tabUPI.style.color = '#333';
        tabRazorpay.style.background = '#1F51B6';
        tabRazorpay.style.color = 'white';
    }
}

function copyUPIId() {
    const upiId = CHURCH_UPI_ID;
    const el = document.createElement('textarea');
    el.value = upiId;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const upiStatus = document.getElementById('upiStatus');
    upiStatus.textContent = '✅ UPI ID copied to clipboard!';
    upiStatus.style.display = 'block';
    upiStatus.style.color = '#4CAF50';
    setTimeout(() => {
        upiStatus.style.display = 'none';
    }, 2000);
}

function initiateUPIPayment() {
    const amount = parseInt(document.getElementById('customAmount').value || currentOfferingAmount);
    const name = document.getElementById('offeringName').value || 'Donor';
    const type = document.getElementById('offeringType').value || 'Offering';
    const upiStatus = document.getElementById('upiStatus');

    if (!amount || amount <= 0) {
        upiStatus.textContent = '❌ Please enter a valid amount';
        upiStatus.style.display = 'block';
        upiStatus.style.color = '#f44336';
        return;
    }

    // Create UPI payment URL (UPI deep linking)
    // Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&tn=TRANSACTION_NOTE
    const upiUrl = `upi://pay?pa=${CHURCH_UPI_ID}&pn=${encodeURIComponent(CHURCH_NAME)}&am=${amount}&tn=${encodeURIComponent(type + ' - ' + name)}&tr=${Date.now()}`;

    upiStatus.textContent = '⏳ Opening UPI app...';
    upiStatus.style.display = 'block';
    upiStatus.style.color = '#2196F3';

    // Try to open UPI app
    window.location.href = upiUrl;

    // Fallback: Show manual instruction after 2 seconds
    setTimeout(() => {
        const confirmed = confirm(
            `UPI Payment Details:\n\n` +
            `Amount: ₹${amount}\n` +
            `To: ${CHURCH_NAME}\n` +
            `UPI ID: ${CHURCH_UPI_ID}\n\n` +
            `Click OK after payment is done.\n` +
            `(If UPI app didn't open, please open your UPI app manually and send ₹${amount} to ${CHURCH_UPI_ID})`
        );

        if (confirmed) {
            recordUPIPayment(amount, name, type);
        }
    }, 2000);
}

async function recordUPIPayment(amount, name, type) {
    const upiStatus = document.getElementById('upiStatus');

    upiStatus.textContent = '⏳ Recording UPI payment...';
    upiStatus.style.color = '#2196F3';

    try {
        await db.collection('offerings').add({
            memberName: name || 'Anonymous',
            amount: amount,
            currency: 'INR',
            date: new Date().toISOString().split('T')[0],
            type: type,
            paymentMethod: 'UPI Direct',
            upiId: CHURCH_UPI_ID,
            status: 'Pending Verification',
            notes: 'UPI payment from mobile app - manual verification pending',
            createdAt: new Date(),
            timestamp: new Date().toISOString()
        });

        upiStatus.textContent = '✅ Payment recorded! Our team will verify and confirm. Thank you!';
        upiStatus.style.color = '#4CAF50';

        setTimeout(() => {
            resetOfferingForm();
            goBack();
        }, 3000);
    } catch (error) {
        console.error('Error:', error);
        upiStatus.textContent = '❌ Error: ' + error.message;
        upiStatus.style.color = '#f44336';
    }
}

// Bible Functions
let currentBibleLanguage = 'English';
let currentBibleBook = null;
let currentBibleChapter = 1;

const bibleBooks = {
    'English': [
        { name: 'Genesis', abbr: 'Gen', chapters: 50 },
        { name: 'Exodus', abbr: 'Exo', chapters: 40 },
        { name: 'Leviticus', abbr: 'Lev', chapters: 27 },
        { name: 'Numbers', abbr: 'Num', chapters: 36 },
        { name: 'Deuteronomy', abbr: 'Deu', chapters: 34 },
        { name: 'Joshua', abbr: 'Jos', chapters: 24 },
        { name: 'Judges', abbr: 'Jdg', chapters: 21 },
        { name: 'Ruth', abbr: 'Rut', chapters: 4 },
        { name: '1 Samuel', abbr: '1Sa', chapters: 31 },
        { name: '2 Samuel', abbr: '2Sa', chapters: 24 },
        { name: '1 Kings', abbr: '1Ki', chapters: 22 },
        { name: '2 Kings', abbr: '2Ki', chapters: 25 },
        { name: '1 Chronicles', abbr: '1Ch', chapters: 29 },
        { name: '2 Chronicles', abbr: '2Ch', chapters: 36 },
        { name: 'Ezra', abbr: 'Ezr', chapters: 10 },
        { name: 'Nehemiah', abbr: 'Neh', chapters: 13 },
        { name: 'Esther', abbr: 'Est', chapters: 10 },
        { name: 'Job', abbr: 'Job', chapters: 42 },
        { name: 'Psalms', abbr: 'Psa', chapters: 150 },
        { name: 'Proverbs', abbr: 'Pro', chapters: 31 },
        { name: 'Ecclesiastes', abbr: 'Ecc', chapters: 12 },
        { name: 'Isaiah', abbr: 'Isa', chapters: 66 },
        { name: 'Jeremiah', abbr: 'Jer', chapters: 52 },
        { name: 'Lamentations', abbr: 'Lam', chapters: 5 },
        { name: 'Ezekiel', abbr: 'Ezk', chapters: 48 },
        { name: 'Daniel', abbr: 'Dan', chapters: 12 },
        { name: 'Hosea', abbr: 'Hos', chapters: 14 },
        { name: 'Joel', abbr: 'Jol', chapters: 3 },
        { name: 'Amos', abbr: 'Amo', chapters: 9 },
        { name: 'Obadiah', abbr: 'Oba', chapters: 1 },
        { name: 'Jonah', abbr: 'Jon', chapters: 4 },
        { name: 'Micah', abbr: 'Mic', chapters: 7 },
        { name: 'Nahum', abbr: 'Nah', chapters: 3 },
        { name: 'Habakkuk', abbr: 'Hab', chapters: 3 },
        { name: 'Zephaniah', abbr: 'Zep', chapters: 3 },
        { name: 'Haggai', abbr: 'Hag', chapters: 2 },
        { name: 'Zechariah', abbr: 'Zec', chapters: 14 },
        { name: 'Malachi', abbr: 'Mal', chapters: 4 },
        { name: 'Matthew', abbr: 'Mat', chapters: 28 },
        { name: 'Mark', abbr: 'Mar', chapters: 16 },
        { name: 'Luke', abbr: 'Luk', chapters: 24 },
        { name: 'John', abbr: 'Joh', chapters: 21 },
        { name: 'Acts', abbr: 'Act', chapters: 28 },
        { name: 'Romans', abbr: 'Rom', chapters: 16 },
        { name: '1 Corinthians', abbr: '1Co', chapters: 16 },
        { name: '2 Corinthians', abbr: '2Co', chapters: 13 },
        { name: 'Galatians', abbr: 'Gal', chapters: 6 },
        { name: 'Ephesians', abbr: 'Eph', chapters: 6 },
        { name: 'Philippians', abbr: 'Phi', chapters: 4 },
        { name: 'Colossians', abbr: 'Col', chapters: 4 },
        { name: '1 Thessalonians', abbr: '1Th', chapters: 5 },
        { name: '2 Thessalonians', abbr: '2Th', chapters: 3 },
        { name: '1 Timothy', abbr: '1Ti', chapters: 6 },
        { name: '2 Timothy', abbr: '2Ti', chapters: 4 },
        { name: 'Titus', abbr: 'Tit', chapters: 3 },
        { name: 'Philemon', abbr: 'Phm', chapters: 1 },
        { name: 'Hebrews', abbr: 'Heb', chapters: 13 },
        { name: 'James', abbr: 'Jam', chapters: 5 },
        { name: '1 Peter', abbr: '1Pe', chapters: 5 },
        { name: '2 Peter', abbr: '2Pe', chapters: 3 },
        { name: '1 John', abbr: '1Jo', chapters: 5 },
        { name: '2 John', abbr: '2Jo', chapters: 1 },
        { name: '3 John', abbr: '3Jo', chapters: 1 },
        { name: 'Jude', abbr: 'Jud', chapters: 1 },
        { name: 'Revelation', abbr: 'Rev', chapters: 22 }
    ],
    'Tamil': [
        { name: 'ஆதியாகமம்', abbr: 'ஆதி', chapters: 50 },
        { name: 'விடுதலை', abbr: 'விட', chapters: 40 },
        { name: 'லேவியர்', abbr: 'லே', chapters: 27 },
        { name: 'எண்ணாக்கம்', abbr: 'எண்', chapters: 36 },
        { name: 'உபாகமம்', abbr: 'உப', chapters: 34 },
        { name: 'யோசுவ', abbr: 'யோசு', chapters: 24 },
        { name: 'நியாயாதிபதிகள்', abbr: 'நிய', chapters: 21 },
        { name: 'ரூத்', abbr: 'ரூ', chapters: 4 },
        { name: '1 சாமுவேல்', abbr: '1சா', chapters: 31 },
        { name: '2 சாமுவேல்', abbr: '2சா', chapters: 24 },
        { name: '1 இராஜாக்கள்', abbr: '1இரா', chapters: 22 },
        { name: '2 இராஜாக்கள்', abbr: '2இரா', chapters: 25 },
        { name: '1 நாளாகமம்', abbr: '1நா', chapters: 29 },
        { name: '2 நாளாகமம்', abbr: '2நா', chapters: 36 },
        { name: 'எஸ்றா', abbr: 'எஸ்', chapters: 10 },
        { name: 'நெহெமியா', abbr: 'நெ', chapters: 13 },
        { name: 'எஸ்தேர்', abbr: 'எஸ்தே', chapters: 10 },
        { name: 'யோபு', abbr: 'யோ', chapters: 42 },
        { name: 'சங்கீதங்கள்', abbr: 'சங்', chapters: 150 },
        { name: 'நீதிமொழிகள்', abbr: 'நீ', chapters: 31 },
        { name: 'உபதேசகர்', abbr: 'உப', chapters: 12 },
        { name: 'ஏசாயா', abbr: 'ஏச', chapters: 66 },
        { name: 'எரேமியா', abbr: 'எரே', chapters: 52 },
        { name: 'புலம்பல்கள்', abbr: 'பு', chapters: 5 },
        { name: 'எசேக்கியேல்', abbr: 'எசே', chapters: 48 },
        { name: 'தானியேல்', abbr: 'தா', chapters: 12 },
        { name: 'ஓசியா', abbr: 'ஓசி', chapters: 14 },
        { name: 'யோவேல்', abbr: 'யோவே', chapters: 3 },
        { name: 'ஆமோஸ்', abbr: 'ஆமோ', chapters: 9 },
        { name: 'ஒபதியா', abbr: 'ஒப', chapters: 1 },
        { name: 'யோனா', abbr: 'யோனா', chapters: 4 },
        { name: 'மீகா', abbr: 'மீ', chapters: 7 },
        { name: 'நாஹூம்', abbr: 'நாஹூ', chapters: 3 },
        { name: 'ஆபகூக்', abbr: 'ஆப', chapters: 3 },
        { name: 'செபன்யா', abbr: 'செப', chapters: 3 },
        { name: 'ஆகாய்', abbr: 'ஆ', chapters: 2 },
        { name: 'சகரியா', abbr: 'சக', chapters: 14 },
        { name: 'மல்கியா', abbr: 'மல்', chapters: 4 },
        { name: 'மத்தேயு', abbr: 'மத்', chapters: 28 },
        { name: 'மாற்கு', abbr: 'மாற்', chapters: 16 },
        { name: 'லூக்கா', abbr: 'லூ', chapters: 24 },
        { name: 'யோவான்', abbr: 'யோ', chapters: 21 },
        { name: 'அப்போஸ்தலர்', abbr: 'அப்', chapters: 28 },
        { name: 'ரோமர்', abbr: 'ரோ', chapters: 16 },
        { name: '1 கொரிந்தியர்', abbr: '1கொ', chapters: 16 },
        { name: '2 கொரிந்தியர்', abbr: '2கொ', chapters: 13 },
        { name: 'கலாத்தியர்', abbr: 'கல', chapters: 6 },
        { name: 'எபேசியர்', abbr: 'எப', chapters: 6 },
        { name: 'பிலிப்பியர்', abbr: 'பி', chapters: 4 },
        { name: 'கொலோசியர்', abbr: 'கொல', chapters: 4 },
        { name: '1 தெசலோனிக', abbr: '1தெ', chapters: 5 },
        { name: '2 தெசலோனிக', abbr: '2தெ', chapters: 3 },
        { name: '1 தீமோத்தேயு', abbr: '1தீ', chapters: 6 },
        { name: '2 தீமோத்தேயு', abbr: '2தீ', chapters: 4 },
        { name: 'தீத்து', abbr: 'தீ', chapters: 3 },
        { name: 'பிலேமோன்', abbr: 'பி', chapters: 1 },
        { name: 'எபிரேயர்', abbr: 'எப', chapters: 13 },
        { name: 'யாக்கோபு', abbr: 'யா', chapters: 5 },
        { name: '1 பேதுரு', abbr: '1பே', chapters: 5 },
        { name: '2 பேதுரு', abbr: '2பே', chapters: 3 },
        { name: '1 யோவான்', abbr: '1யோ', chapters: 5 },
        { name: '2 யோவான்', abbr: '2யோ', chapters: 1 },
        { name: '3 யோவான்', abbr: '3யோ', chapters: 1 },
        { name: 'யூதா', abbr: 'யூ', chapters: 1 },
        { name: 'வெளிப்பாடு', abbr: 'வெ', chapters: 22 }
    ],
    'Hindi': [
        { name: 'उत्पत्ति', abbr: 'उत्', chapters: 50 },
        { name: 'निर्गमन', abbr: 'नि', chapters: 40 },
        { name: 'लैव्यव्यवस्था', abbr: 'लै', chapters: 27 },
        { name: 'गिनती', abbr: 'गि', chapters: 36 },
        { name: 'व्यवस्थाविवरण', abbr: 'व्य', chapters: 34 },
        { name: 'यहोशू', abbr: 'यह', chapters: 24 },
        { name: 'न्यायियों', abbr: 'न्य', chapters: 21 },
        { name: 'रूत', abbr: 'रू', chapters: 4 },
        { name: '1 शमूएल', abbr: '1श', chapters: 31 },
        { name: '2 शमूएल', abbr: '2श', chapters: 24 },
        { name: '1 राजा', abbr: '1रा', chapters: 22 },
        { name: '2 राजा', abbr: '2रा', chapters: 25 },
        { name: '1 इतिहास', abbr: '1इ', chapters: 29 },
        { name: '2 इतिहास', abbr: '2इ', chapters: 36 },
        { name: 'एज्रा', abbr: 'ए', chapters: 10 },
        { name: 'नहेमायाह', abbr: 'न', chapters: 13 },
        { name: 'एस्तेर', abbr: 'एस्', chapters: 10 },
        { name: 'अय्यूब', abbr: 'अ', chapters: 42 },
        { name: 'भजन संहिता', abbr: 'भ', chapters: 150 },
        { name: 'नीतिवचन', abbr: 'नी', chapters: 31 },
        { name: 'सभोपदेशक', abbr: 'स', chapters: 12 },
        { name: 'यशायाह', abbr: 'य', chapters: 66 },
        { name: 'यिर्मयाह', abbr: 'यि', chapters: 52 },
        { name: 'विलापगीत', abbr: 'वि', chapters: 5 },
        { name: 'यहेजकेल', abbr: 'यह', chapters: 48 },
        { name: 'दानिएल', abbr: 'द', chapters: 12 },
        { name: 'होशे', abbr: 'हो', chapters: 14 },
        { name: 'यूएल', abbr: 'यू', chapters: 3 },
        { name: 'आमोस', abbr: 'आ', chapters: 9 },
        { name: 'ओबद्याह', abbr: 'ओ', chapters: 1 },
        { name: 'योना', abbr: 'योन', chapters: 4 },
        { name: 'मीका', abbr: 'मी', chapters: 7 },
        { name: 'नहूम', abbr: 'नह', chapters: 3 },
        { name: 'हबक्कूक', abbr: 'ह', chapters: 3 },
        { name: 'सपन्याह', abbr: 'स', chapters: 3 },
        { name: 'हाग्गै', abbr: 'हा', chapters: 2 },
        { name: 'जकर्याह', abbr: 'ज', chapters: 14 },
        { name: 'मलाकी', abbr: 'मल', chapters: 4 },
        { name: 'मत्ती', abbr: 'मत्', chapters: 28 },
        { name: 'मरकुस', abbr: 'मर', chapters: 16 },
        { name: 'लूका', abbr: 'लू', chapters: 24 },
        { name: 'यूहन्ना', abbr: 'यू', chapters: 21 },
        { name: 'प्रेरितों के काम', abbr: 'प्र', chapters: 28 },
        { name: 'रोमियों', abbr: 'रो', chapters: 16 },
        { name: '1 कुरिन्थियों', abbr: '1क', chapters: 16 },
        { name: '2 कुरिन्थियों', abbr: '2क', chapters: 13 },
        { name: 'गलातियों', abbr: 'ग', chapters: 6 },
        { name: 'इफिसियों', abbr: 'इ', chapters: 6 },
        { name: 'फिलिप्पियों', abbr: 'फ', chapters: 4 },
        { name: 'कुलुस्सियों', abbr: 'कु', chapters: 4 },
        { name: '1 थिस्सलुनीकियों', abbr: '1थ', chapters: 5 },
        { name: '2 थिस्सलुनीकियों', abbr: '2थ', chapters: 3 },
        { name: '1 तीमुथियुस', abbr: '1ति', chapters: 6 },
        { name: '2 तीमुथियुस', abbr: '2ति', chapters: 4 },
        { name: 'तीतुस', abbr: 'ति', chapters: 3 },
        { name: 'फिलेमोन', abbr: 'फि', chapters: 1 },
        { name: 'इब्रानियों', abbr: 'इब्', chapters: 13 },
        { name: 'याकूब', abbr: 'या', chapters: 5 },
        { name: '1 पतरस', abbr: '1प', chapters: 5 },
        { name: '2 पतरस', abbr: '2प', chapters: 3 },
        { name: '1 यूहन्ना', abbr: '1यू', chapters: 5 },
        { name: '2 यूहन्ना', abbr: '2यू', chapters: 1 },
        { name: '3 यूहन्ना', abbr: '3यू', chapters: 1 },
        { name: 'यहूदा', abbr: 'यह', chapters: 1 },
        { name: 'प्रकाशितवाक्य', abbr: 'प्र', chapters: 22 }
    ],
    'Kannada': [
        { name: 'ಸೃಷ್ಟಿ', abbr: 'ಸೃ', chapters: 50 },
        { name: 'ನಿರ್ಗಮನ', abbr: 'ನಿ', chapters: 40 },
        { name: 'ಲೇವಿತಿಕಸ', abbr: 'ಲೇ', chapters: 27 },
        { name: 'ಸಂಖ್ಯೆಗಳು', abbr: 'ಸಂ', chapters: 36 },
        { name: 'ನಿಯಮಸಂಗ್ರಹ', abbr: 'ನಿಯ', chapters: 34 },
        { name: 'ಯೋಶುವ', abbr: 'ಯೋ', chapters: 24 },
        { name: 'ನ್ಯಾಯಾಧಿಪತಿಗಳು', abbr: 'ನ್ಯಾ', chapters: 21 },
        { name: 'ರೂತ್', abbr: 'ರೂ', chapters: 4 },
        { name: '1 ಸಮುವೇಲ್', abbr: '1ಸ', chapters: 31 },
        { name: '2 ಸಮುವೇಲ್', abbr: '2ಸ', chapters: 24 },
        { name: '1 ರಾಜರು', abbr: '1ರಾ', chapters: 22 },
        { name: '2 ರಾಜರು', abbr: '2ರಾ', chapters: 25 },
        { name: '1 ಸಮಾಚಾರ', abbr: '1ಸಮಾ', chapters: 29 },
        { name: '2 ಸಮಾಚಾರ', abbr: '2ಸಮಾ', chapters: 36 },
        { name: 'ಎಜ್ರ', abbr: 'ಎ', chapters: 10 },
        { name: 'ನೆಹೆಮ್ಯ', abbr: 'ನೆ', chapters: 13 },
        { name: 'ಎಸ್ತೆರ್', abbr: 'ಎಸ್', chapters: 10 },
        { name: 'ಯೋಬ್', abbr: 'ಯೋ', chapters: 42 },
        { name: 'ಸುಯ್ಮೃತ', abbr: 'ಸು', chapters: 150 },
        { name: 'ನೀತಿವಾಕ್ಯಗಳು', abbr: 'ನೀ', chapters: 31 },
        { name: 'ಪೋಷಕ', abbr: 'ಪೋ', chapters: 12 },
        { name: 'ಯೆಸಾಯ', abbr: 'ಯೆ', chapters: 66 },
        { name: 'ಯೆರೆಮ್ಯ', abbr: 'ಯೆರೆ', chapters: 52 },
        { name: 'ವಿಲಾಪ', abbr: 'ವಿ', chapters: 5 },
        { name: 'ಯೆಜೆಕೆಲ್', abbr: 'ಯೆ', chapters: 48 },
        { name: 'ದಾನಿಯೇಲ್', abbr: 'ದಾ', chapters: 12 },
        { name: 'ಹೋಶೆ', abbr: 'ಹೋ', chapters: 14 },
        { name: 'ಜೋಯೆಲ್', abbr: 'ಜೋ', chapters: 3 },
        { name: 'ಆಮೋಸ್', abbr: 'ಆ', chapters: 9 },
        { name: 'ಓಬದ್ಯ', abbr: 'ಓ', chapters: 1 },
        { name: 'ಜೋನ', abbr: 'ಜೋನ', chapters: 4 },
        { name: 'ಮೀಕ', abbr: 'ಮೀ', chapters: 7 },
        { name: 'ನಹೂಮ್', abbr: 'ನ', chapters: 3 },
        { name: 'ಹಬಕ್ಕೂಕ್', abbr: 'ಹ', chapters: 3 },
        { name: 'ಸೆಫನ್ಯ', abbr: 'ಸೆ', chapters: 3 },
        { name: 'ಹಗೈ', abbr: 'ಹ', chapters: 2 },
        { name: 'ಜಕರ್ಯ', abbr: 'ಜ', chapters: 14 },
        { name: 'ಮಲಾಕೀ', abbr: 'ಮ', chapters: 4 },
        { name: 'ಮತ್ತಾಯ', abbr: 'ಮತ್', chapters: 28 },
        { name: 'ಮಾರ್ಕ', abbr: 'ಮಾ', chapters: 16 },
        { name: 'ಲೂಕ', abbr: 'ಲೂ', chapters: 24 },
        { name: 'ಜಾನ', abbr: 'ಜಾ', chapters: 21 },
        { name: 'ಅಪೌಸ್ತೋಲಿಕ', abbr: 'ಅ', chapters: 28 },
        { name: 'ರೋಮನರು', abbr: 'ರೋ', chapters: 16 },
        { name: '1 ಕೊರಿಂಥಿಯರು', abbr: '1ಕೊ', chapters: 16 },
        { name: '2 ಕೊರಿಂಥಿಯರು', abbr: '2ಕೊ', chapters: 13 },
        { name: 'ಗಲಾತಿಯರು', abbr: 'ಗ', chapters: 6 },
        { name: 'ಎಫೆಸಿಯರು', abbr: 'ಎ', chapters: 6 },
        { name: 'ಫಿಲಿಪ್ಪಿಯರು', abbr: 'ಫಿ', chapters: 4 },
        { name: 'ಕೊಲೋಸಿಯರು', abbr: 'ಕೊ', chapters: 4 },
        { name: '1 ಥೆಸಲೋನಿಕರು', abbr: '1ಥೆ', chapters: 5 },
        { name: '2 ಥೆಸಲೋನಿಕರು', abbr: '2ಥೆ', chapters: 3 },
        { name: '1 ತಿಮೋತೆ', abbr: '1ತಿ', chapters: 6 },
        { name: '2 ತಿಮೋತೆ', abbr: '2ತಿ', chapters: 4 },
        { name: 'ತಿತುಸ್', abbr: 'ತಿ', chapters: 3 },
        { name: 'ಫಿಲೇಮೋನ್', abbr: 'ಫಿ', chapters: 1 },
        { name: 'ಹೆಬ್ರೆವರು', abbr: 'ಹೆ', chapters: 13 },
        { name: 'ಜೇಮಸ್', abbr: 'ಜೇ', chapters: 5 },
        { name: '1 ಪೇತ್ರ', abbr: '1ಪೇ', chapters: 5 },
        { name: '2 ಪೇತ್ರ', abbr: '2ಪೇ', chapters: 3 },
        { name: '1 ಜಾನ', abbr: '1ಜಾ', chapters: 5 },
        { name: '2 ಜಾನ', abbr: '2ಜಾ', chapters: 1 },
        { name: '3 ಜಾನ', abbr: '3ಜಾ', chapters: 1 },
        { name: 'ಜೂಡ್', abbr: 'ಜೂ', chapters: 1 },
        { name: 'ಪ್ರಕಾಶನ', abbr: 'ಪ್ರ', chapters: 22 }
    ]
};

function selectBibleLanguage(language) {
    currentBibleLanguage = language;
    
    // Update button styles
    document.querySelectorAll('[id^="lang"]').forEach(btn => {
        btn.style.background = '#f0f0f0';
        btn.style.color = '#333';
    });
    document.getElementById('lang' + language).style.background = '#667eea';
    document.getElementById('lang' + language).style.color = 'white';
    
    // Load books
    loadBibleBooks();
}

function loadBibleBooks() {
    const booksList = document.getElementById('bibleBooksList');
    const books = bibleBooks[currentBibleLanguage] || bibleBooks['English'];

    let html = '';
    books.forEach((book, index) => {
        html += `
            <div onclick="openBibleBook(${index})" style="background: white; border: 2px solid #8B6914; border-radius: 12px; padding: 12px; margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 20px;">📖</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333;">${book.name}</div>
                    <div style="font-size: 12px; color: #666;">${book.chapters} chapters</div>
                </div>
                <div style="background: #8B6914; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">${book.abbr}</div>
            </div>
        `;
    });
    booksList.innerHTML = html;
}

function filterBibleBooks() {
    const searchTerm = document.getElementById('bibleSearch')?.value.toLowerCase() || '';
    const booksList = document.getElementById('bibleBooksList');
    const books = bibleBooks[currentBibleLanguage] || bibleBooks['English'];

    let html = '';
    books.forEach((book, index) => {
        if (book.name.toLowerCase().includes(searchTerm) || book.abbr.toLowerCase().includes(searchTerm)) {
            html += `
                <div onclick="openBibleBook(${index})" style="background: white; border: 2px solid #8B6914; border-radius: 12px; padding: 12px; margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 20px;">📖</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #333;">${book.name}</div>
                        <div style="font-size: 12px; color: #666;">${book.chapters} chapters</div>
                    </div>
                    <div style="background: #8B6914; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">${book.abbr}</div>
                </div>
            `;
        }
    });
    booksList.innerHTML = html || '<p style="color: #999; text-align: center;">No books found</p>';
}

function changeBibleTheme(theme) {
    const content = document.getElementById('bibleContent');
    const verseList = document.getElementById('verseList');
    const verseRef = document.getElementById('verseReference');
    if (!content || !verseList) return;

    const themes = {
        blue: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', refColor: 'rgba(255,255,255,0.9)' },
        white: { bg: 'white', color: '#333', border: '1px solid #ddd', refColor: '#666' },
        dark: { bg: '#1a1a1a', color: '#e0e0e0', refColor: '#999' },
        sepia: { bg: '#f4ecd8', color: '#5c4033', refColor: '#8b6f47' }
    };

    const t = themes[theme];
    content.style.background = t.bg;
    content.style.color = t.color;
    content.style.textAlign = 'left';
    if (t.border) content.style.border = t.border;
    else content.style.border = 'none';
    verseList.style.color = t.color;
    verseList.style.textAlign = 'left';
    if (verseRef) {
        verseRef.style.color = t.refColor;
        verseRef.style.textAlign = 'left';
    }
}

function changeBibleFontSize(size) {
    const contentDiv = document.getElementById('bibleContent');
    if (!contentDiv) return;
    const sizes = { small: '12px', medium: '14px', large: '16px', xlarge: '18px' };
    contentDiv.style.fontSize = sizes[size];
}

function changeBibleAlignment(alignment) {
    const verseList = document.getElementById('verseList');
    if (!verseList) return;
    verseList.style.textAlign = alignment;
}

function openBibleBook(bookIndex) {
    const books = bibleBooks[currentBibleLanguage];
    currentBibleBook = books[bookIndex];
    currentBibleChapter = 1;
    
    // Show bible reader screen
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('bibleReader').classList.add('active');
    document.getElementById('bibleReader').style.display = 'block';
    
    document.getElementById('readerBookTitle').textContent = currentBibleBook.name;
    
    // Create chapter buttons
    let chapterBtns = '';
    for (let i = 1; i <= currentBibleBook.chapters; i++) {
        chapterBtns += `<button onclick="selectBibleChapter(${i})" id="chapter${i}" style="background: ${i === 1 ? '#667eea' : '#f0f0f0'}; color: ${i === 1 ? 'white' : '#333'}; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">${i}</button>`;
    }
    document.getElementById('chapterButtons').innerHTML = chapterBtns;
    
    selectBibleChapter(1);
}

function selectBibleChapter(chapter) {
    currentBibleChapter = chapter;

    // Update chapter title in header
    const chapterTitle = document.getElementById('readerChapterTitle');
    if (chapterTitle) {
        chapterTitle.textContent = `Chapter ${currentBibleChapter}`;
    }

    // Update button styles
    document.querySelectorAll('#chapterButtons button').forEach(btn => {
        btn.style.background = '#f0f0f0';
        btn.style.color = '#333';
    });
    document.getElementById('chapter' + chapter).style.background = '#667eea';
    document.getElementById('chapter' + chapter).style.color = 'white';
    
    // Load content
    loadBibleContent();
}

async function loadBibleContent() {
    const reference = `${currentBibleBook.name} ${currentBibleChapter}`;
    const refEl = document.getElementById('verseReference');
    if (refEl) refEl.textContent = reference;

    // Update chapter title in header
    const chapterTitle = document.getElementById('readerChapterTitle');
    if (chapterTitle) {
        chapterTitle.textContent = `Chapter ${currentBibleChapter}`;
    }

    // Show loading message
    const contentDiv = document.getElementById('bibleContent');
    contentDiv.innerHTML = '<p style="color: #999; text-align: center;">Loading Bible verses...</p>';
    contentDiv.style.display = 'block';

    try {
        // Fetch from official Bible API
        const result = await fetchBiblePassage(currentBibleBook.name, currentBibleChapter, currentBibleLanguage);

        if (result && result.verses && result.verses.length > 0) {
            let htmlContent = '';
            result.verses.forEach(verse => {
                let verseText = '';
                if (verse.content) {
                    // Extract text from HTML content, excluding section headings
                    const div = document.createElement('div');
                    div.innerHTML = verse.content;

                    // Remove section heading paragraphs (class="s1", "s2", etc.)
                    const headings = div.querySelectorAll('p[class^="s"]');
                    headings.forEach(h => h.remove());

                    // Get only the verse text (usually in <p class="p">)
                    const verseParas = div.querySelectorAll('p.p, p:not([class^="s"])');
                    if (verseParas.length > 0) {
                        verseText = Array.from(verseParas).map(p => p.textContent).join(' ');
                    } else {
                        verseText = div.textContent || div.innerText || '';
                    }

                    // Clean up extra whitespace
                    verseText = verseText.replace(/\s+/g, ' ').trim();
                } else if (verse.text) {
                    verseText = verse.text;
                }

                htmlContent += `<div style="margin-bottom: 6px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; text-align: left;">
                    <span style="color: #667eea; font-weight: 600; font-size: 12px; display: block;">${verse.reference}</span>
                    <span style="color: #333; font-size: 13px; line-height: 1.5; text-align: left;"> ${verseText}</span>
                </div>`;
            });

            contentDiv.innerHTML = htmlContent;
            contentDiv.style.fontSize = '14px';
            contentDiv.style.lineHeight = '1.8';
            contentDiv.style.color = '#333';
            contentDiv.style.textAlign = 'left';
            contentDiv.style.display = 'block';

            // Apply night mode if enabled
            if (bibleState && bibleState.nightMode) {
                contentDiv.style.backgroundColor = '#1a1a1a';
                contentDiv.style.color = '#e0e0e0';
            }

            // Add to reading history
            if (bibleState) addToHistory(reference);
        } else {
            contentDiv.innerHTML = `<p style="color: #999;">Chapter ${currentBibleChapter} verses not found. Please try another chapter.</p>`;
        }
    } catch (error) {
        console.error('Error loading Bible content:', error);
        contentDiv.innerHTML = `<p style="color: #d32f2f;">Error loading Bible verses. Please check your internet connection and try again.</p>`;
    }
}

function bookmarkVerse() {
    const reference = `${currentBibleBook.name} ${currentBibleChapter}`;
    alert('✅ Verse bookmarked: ' + reference + '\n\nBookmarks feature coming soon!');
}

// Local Login Functions
function localLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('loginError');

    if (!username || !password) {
        errorDiv.textContent = '❌ Please enter username and password';
        errorDiv.style.display = 'block';
        return;
    }

    // Get stored users from localStorage
    const users = JSON.parse(localStorage.getItem('churchUsers')) || {};
    
    if (!users[username] || users[username].password !== password) {
        errorDiv.textContent = '❌ Invalid username or password';
        errorDiv.style.display = 'block';
        return;
    }

    // Login successful
    localStorage.setItem('currentUser', username);
    localStorage.setItem('isLoggedIn', 'true');
    currentMember = { name: username, email: username + '@church.local' };
    
    showApp();
    errorDiv.style.display = 'none';
}

function toggleRegister() {
    document.getElementById('loginForm').style.display = 
        document.getElementById('loginForm').style.display === 'none' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = 
        document.getElementById('registerForm').style.display === 'none' ? 'block' : 'none';
}

function registerUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const errorDiv = document.getElementById('loginError');

    if (!username || !password) {
        errorDiv.textContent = '❌ Please fill all fields';
        errorDiv.style.display = 'block';
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('churchUsers')) || {};
    
    if (users[username]) {
        errorDiv.textContent = '❌ Username already exists';
        errorDiv.style.display = 'block';
        return;
    }

    // Register new user
    users[username] = { password: password };
    localStorage.setItem('churchUsers', JSON.stringify(users));
    
    errorDiv.textContent = '✅ Account created! Please login';
    errorDiv.style.color = '#4CAF50';
    errorDiv.style.display = 'block';
    
    // Clear form and switch to login
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    setTimeout(() => toggleRegister(), 1500);
}

function logoutMember() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    location.reload();
}

// Check if user is already logged in
function checkLocalLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = localStorage.getItem('currentUser');
    
    if (isLoggedIn && currentUser) {
        currentMember = { name: currentUser, email: currentUser + '@church.local' };
        showApp();
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkLocalLogin);

// ============================================
// BIBLE DATA SYSTEM - Load from local bible-data.json
// ============================================
let bibleDataCache = null;

async function initializeBibleCache() {
  if (bibleDataCache) return bibleDataCache;

  try {
    // Cache-busting: add timestamp to force fresh fetch
    const response = await fetch(`./bible-data.json?t=${Date.now()}`);
    if (!response.ok) throw new Error('Failed to load Bible data');
    bibleDataCache = await response.json();
    console.log('✅ Bible data loaded successfully - ' + Object.keys(bibleDataCache.English || {}).length + ' books');
    return bibleDataCache;
  } catch (error) {
    console.error('Error loading Bible data:', error);
    return null;
  }
}

// ENHANCED BIBLE APP - ALL FEATURES
// ============================================

// Bible App State
let bibleState = {
  fontSize: 14,
  nightMode: localStorage.getItem('bibleNightMode') === 'true' || false,
  bookmarks: JSON.parse(localStorage.getItem('bibleBookmarks')) || [],
  notes: JSON.parse(localStorage.getItem('bibleNotes')) || {},
  history: JSON.parse(localStorage.getItem('bibleHistory')) || []
};

// Apply Night Mode
function toggleNightMode() {
  bibleState.nightMode = !bibleState.nightMode;
  localStorage.setItem('bibleNightMode', bibleState.nightMode);
  
  const contentDiv = document.getElementById('bibleContent');
  if (bibleState.nightMode) {
    contentDiv.style.backgroundColor = '#1a1a1a';
    contentDiv.style.color = '#e0e0e0';
  } else {
    contentDiv.style.backgroundColor = 'white';
    contentDiv.style.color = '#333';
  }
}

// Font Size Control
function changeFontSize(size) {
  bibleState.fontSize = size;
  localStorage.setItem('bibleFontSize', size);
  document.getElementById('bibleContent').style.fontSize = size + 'px';
}

// Search Bible
async function searchBible() {
  const query = prompt('Search Bible verses:');
  if (!query) return;

  const bibleData = await initializeBibleCache();
  if (!bibleData) {
    alert('Bible data not available. Please refresh the page.');
    return;
  }

  const results = [];
  const lang = currentBibleLanguage;

  Object.entries(bibleData[lang] || {}).forEach(([book, chapters]) => {
    Object.entries(chapters).forEach(([ch, verses]) => {
      verses.forEach((verse, idx) => {
        if (verse.toLowerCase().includes(query.toLowerCase())) {
          results.push({ book, chapter: ch, verse });
        }
      });
    });
  });

  if (results.length === 0) {
    alert('No verses found matching: ' + query);
    return;
  }

  let resultHTML = '<div style="font-size: 12px; max-height: 300px; overflow-y: auto;">';
  results.slice(0, 20).forEach(r => {
    resultHTML += `<div style="padding: 8px; border-bottom: 1px solid #ddd; cursor: pointer;" onclick="selectSearchResult('${r.book}', '${r.chapter}')">
      <strong>${r.book} ${r.chapter}</strong><br>
      ${r.verse.substring(0, 80)}...</div>`;
  });
  if (results.length > 20) resultHTML += `<div style="padding: 8px; text-align: center;">+${results.length - 20} more results</div>`;
  resultHTML += '</div>';

  alert('Found ' + results.length + ' matches');
}

// Bookmark Verse
function toggleBookmark() {
  const ref = `${currentBibleBook.name} ${currentBibleChapter}`;
  const idx = bibleState.bookmarks.indexOf(ref);
  
  if (idx > -1) {
    bibleState.bookmarks.splice(idx, 1);
  } else {
    bibleState.bookmarks.push(ref);
  }
  
  localStorage.setItem('bibleBookmarks', JSON.stringify(bibleState.bookmarks));
  updateBookmarkButton();
}

function updateBookmarkButton() {
  const ref = `${currentBibleBook.name} ${currentBibleChapter}`;
  const btn = document.getElementById('bookmarkBtn');
  if (!btn) return;
  if (bibleState.bookmarks.includes(ref)) {
    btn.style.backgroundColor = '#FF5722';
    btn.textContent = '🔖 Bookmarked';
  } else {
    btn.style.backgroundColor = '#FF9800';
    btn.textContent = '🔖 Bookmark';
  }
}

// Add Note to Verse
function addNote() {
  const ref = `${currentBibleBook.name} ${currentBibleChapter}`;
  const modal = document.getElementById('notesModal');
  const noteInput = document.getElementById('noteInput');
  const chapterRef = document.getElementById('notesChapterRef');
  const deleteBtn = document.getElementById('deleteNoteBtn');

  chapterRef.textContent = ref;

  // Load existing note if it exists
  if (bibleState.notes[ref]) {
    noteInput.value = bibleState.notes[ref];
    noteInput.placeholder = 'Edit your note...';
    deleteBtn.style.display = 'block';
  } else {
    noteInput.value = '';
    noteInput.placeholder = 'Write your thoughts, reflections, or study notes here...';
    deleteBtn.style.display = 'none';
  }

  // Focus on the textarea
  setTimeout(() => noteInput.focus(), 100);
  modal.style.display = 'flex';
}

function closeNotesModal() {
  document.getElementById('notesModal').style.display = 'none';
}

function saveNote() {
  const ref = `${currentBibleBook.name} ${currentBibleChapter}`;
  const noteText = document.getElementById('noteInput').value.trim();

  if (noteText) {
    bibleState.notes[ref] = noteText;
    localStorage.setItem('bibleNotes', JSON.stringify(bibleState.notes));
    closeNotesModal();

    // Show confirmation
    const modal = document.getElementById('notesModal');
    const originalContent = modal.innerHTML;
    modal.innerHTML = '<div style="text-align: center; padding: 40px;"><div style="font-size: 48px; margin-bottom: 16px;">✅</div><div style="font-size: 16px; color: #333; font-weight: 600;">Note saved successfully!</div></div>';
    setTimeout(() => {
      modal.innerHTML = originalContent;
    }, 1500);
  } else {
    alert('Please write something in the note!');
  }
}

function deleteNoteModal() {
  const ref = `${currentBibleBook.name} ${currentBibleChapter}`;
  if (confirm('Are you sure you want to delete this note?')) {
    delete bibleState.notes[ref];
    localStorage.setItem('bibleNotes', JSON.stringify(bibleState.notes));
    closeNotesModal();
  }
}

// Share Verse
function shareVerse() {
  const ref = `${currentBibleBook.name} ${currentBibleChapter}`;
  const text = document.getElementById('bibleContent').innerText;
  
  const shareText = `${ref}\n\n${text}\n\n- Shared from Church Nexus Bible App`;
  
  if (navigator.share) {
    navigator.share({
      title: ref,
      text: shareText
    }).catch(e => console.log(e));
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert('✅ Verse copied to clipboard!');
    });
  }
}

// View Bookmarks
function viewBookmarks() {
  if (bibleState.bookmarks.length === 0) {
    alert('No bookmarks yet. Bookmark chapters to see them here.');
    return;
  }
  
  let html = 'Your Bookmarks:\n\n';
  bibleState.bookmarks.forEach(ref => {
    html += ref + '\n';
  });
  
  alert(html);
}

// View Notes
function viewNotes() {
  // Open notes modal to view/add/edit notes
  addNote();
}

// Add to History
function addToHistory(book, chapter) {
  const ref = `${book.name} ${chapter}`;
  
  // Remove if exists
  bibleState.history = bibleState.history.filter(h => h !== ref);
  
  // Add to beginning
  bibleState.history.unshift(ref);
  
  // Keep only last 20
  bibleState.history = bibleState.history.slice(0, 20);
  
  localStorage.setItem('bibleHistory', JSON.stringify(bibleState.history));
}

// View History
function viewHistory() {
  if (bibleState.history.length === 0) {
    alert('No recent reads yet.');
    return;
  }
  
  const selected = prompt('Recent chapters:\n\n' + bibleState.history.join('\n') + '\n\nEnter chapter to jump to (or cancel):', bibleState.history[0]);
  
  if (selected) {
    const parts = selected.split(' ');
    const chapter = parts[parts.length - 1];
    alert('Loading: ' + selected);
  }
}

// Enhanced loadBibleContent
const originalLoadBibleContent = loadBibleContent;
function enhancedLoadBibleContent() {
  originalLoadBibleContent();
  updateBookmarkButton();
  addToHistory(currentBibleBook, currentBibleChapter);
}

loadBibleContent = enhancedLoadBibleContent;

console.log('✅ Enhanced Bible features loaded!');

// YOUVERSION BIBLE INTEGRATION
// ============================================
let currentYouVersionLanguage = 'en';

const youversionLanguageMap = {
  'en': 'eng',  // English
  'ta': 'tam',  // Tamil
  'hi': 'hin',  // Hindi
  'kn': 'kan'   // Kannada
};

function setYouVersionLanguage(lang) {
  currentYouVersionLanguage = lang;

  // Map to language names
  const langMap = {
    'en': 'English',
    'ta': 'Tamil',
    'hi': 'Hindi',
    'kn': 'Kannada'
  };

  currentBibleLanguage = langMap[lang];

  // Update button styles
  document.getElementById('langEN').style.background = lang === 'en' ? '#667eea' : '#f0f0f0';
  document.getElementById('langEN').style.color = lang === 'en' ? 'white' : '#333';

  document.getElementById('langTA').style.background = lang === 'ta' ? '#667eea' : '#f0f0f0';
  document.getElementById('langTA').style.color = lang === 'ta' ? 'white' : '#333';

  document.getElementById('langHI').style.background = lang === 'hi' ? '#667eea' : '#f0f0f0';
  document.getElementById('langHI').style.color = lang === 'hi' ? 'white' : '#333';

  document.getElementById('langKN').style.background = lang === 'kn' ? '#667eea' : '#f0f0f0';
  document.getElementById('langKN').style.color = lang === 'kn' ? 'white' : '#333';

  // Reload Bible content in new language
  loadBibleContent();
}

function loadYouVersionBible() {
  const reference = `${currentBibleBook.name} ${currentBibleChapter}`;
  const widgetDiv = document.getElementById('youversionWidget');

  // Create YouVersion link
  const passage = reference.replace(/ /g, '.');
  const youversionUrl = `https://www.youversion.com/passage/${passage}/?version=${getYouVersionVersion()}`;
  const versionName = getYouVersionVersionName();

  // Show local Bible + YouVersion link
  widgetDiv.innerHTML = `
    <div style="text-align: center; padding: 16px;">
      <p style="margin: 0 0 12px 0; color: #666; font-size: 13px;">View in YouVersion Bible App</p>
      <a href="${youversionUrl}" target="_blank" style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; cursor: pointer;">
        📖 Open in YouVersion (${versionName})
      </a>
      <p style="margin: 12px 0 0 0; font-size: 11px; color: #999;">Click to open full passage with all verses</p>
    </div>
  `;

  // Show local Bible content below
  displayLocalBibleContent();
}

function displayLocalBibleContent() {
  const bibleContent = document.getElementById('bibleContent');
  bibleContent.style.display = 'block';
  // Content already loaded by loadBibleContent()
}

function getYouVersionVersion() {
  const versions = {
    'en': 'NIVUK',  // English - NIV UK
    'ta': 'TMSB',   // Tamil
    'hi': 'HINDI',  // Hindi
    'kn': 'KANJV'   // Kannada
  };
  return versions[currentYouVersionLanguage] || 'NIVUK';
}

function getYouVersionVersionName() {
  const names = {
    'en': 'NIV',
    'ta': 'Tamil Bible',
    'hi': 'Hindi Bible',
    'kn': 'Kannada Bible'
  };
  return names[currentYouVersionLanguage] || 'Bible';
}

// SONG BOOKS FUNCTIONS
// ============================================

let currentSongLanguage = 'en';

// Multilingual Song Books Library
const songBooksLibraryML = {
  'en': [
    {
      id: 1,
      name: 'Hymnal Collection',
      color: '#FF6B35',
      icon: '📕',
      songs: [
        { num: 1, title: 'Amazing Grace', lyrics: 'Amazing grace, how sweet the sound that saved a wretch like me...', composer: 'John Newton' },
        { num: 2, title: 'How Great Thou Art', lyrics: 'O Lord my God, when I in awesome wonder consider all...', composer: 'Carl Boberg' },
        { num: 3, title: 'Great Is Thy Faithfulness', lyrics: 'Great is thy faithfulness, O God my Father...', composer: 'Thomas Chisholm' },
        { num: 4, title: 'Jesus Loves Me', lyrics: 'Jesus loves me, this I know, for the Bible tells me so...', composer: 'William B. Bradbury' },
        { num: 5, title: 'Rock of Ages', lyrics: 'Rock of Ages, cleft for me, let me hide myself in thee...', composer: 'Augustus Toplady' }
      ]
    },
    {
      id: 2,
      name: 'Worship Songs',
      color: '#9C27B0',
      icon: '📗',
      songs: [
        { num: 1, title: 'How He Loves Us', lyrics: 'He is jealous for me, loves like a hurricane...', composer: 'David Crowder' },
        { num: 2, title: 'Blessed Assurance', lyrics: 'Blessed assurance, Jesus is mine...', composer: 'Fanny Crosby' },
        { num: 3, title: 'Christ The Lord Is Risen Today', lyrics: 'Christ the Lord is risen today, Alleluia...', composer: 'Charles Wesley' },
        { num: 4, title: 'O Come All Ye Faithful', lyrics: 'O come all ye faithful, joyful and triumphant...', composer: 'John Francis Wade' }
      ]
    },
    {
      id: 3,
      name: 'Praise & Glory',
      color: '#FF1744',
      icon: '📔',
      songs: [
        { num: 1, title: 'Hallelujah', lyrics: 'Hallelujah, Hallelujah, Hallelujah...', composer: 'Traditional' },
        { num: 2, title: 'Glory Be To The Father', lyrics: 'Glory be to the Father, and to the Son...', composer: 'Henry Wellington Greatorex' },
        { num: 3, title: 'I Sing The Mighty Power Of God', lyrics: 'I sing the mighty power of God that made the mountains rise...', composer: 'Isaac Watts' }
      ]
    }
  ],
  'ta': [
    {
      id: 1,
      name: 'தமிழ் கீர்த்தனைகள்',
      color: '#FF6B35',
      icon: '📕',
      songs: [
        { num: 1, title: 'தேவுடைய அன்பு', lyrics: 'தேவுடைய அன்பு எனக்கு வாழ்வு\nயேசু என் சரணாகதியும்\nவாழ்க எனக்கு அவனே நன்று\nபரலோகம் விளக்கமுமாம்' , composer: 'பாரம்பரியம்' },
        { num: 2, title: 'என் கர்த்தனே', lyrics: 'என் கர்த்தனே நீ எனக்கு பலம்\nதேவனே நீ என் சுற்றமாய்\nபாதுகாத்துக் கொள்ள வாராய்\nசர்வ நாளும் வாழ்க உனக்கே', composer: 'பாரம்பரியம்' },
        { num: 3, title: 'ஆண்டவர் என்சொல்', lyrics: 'ஆண்டவர் என்சொல் உண்மையுமாம்\nபரலோகத்துக்கு ஏறினாள்\nய்ரகம் கூடி துதிக்கிறார்\nலோகம் முழுதும் சிந்திக்க', composer: 'பாரம்பரியம்' },
        { num: 4, title: 'நீ கொடுத்த ஆசீர்வாதம்', lyrics: 'நீ கொடுத்த ஆசீர்வாதம் எனக்கு நன்றாய்\nசொர்গ்கலோக ஆনந்தம் பெற்றிருக்கின்றேன்\nநீ உயிரளித்த பொருளை விசுவசித்து\nசர்வ நாளும் நீ எனக்கு பலமாயிருக்க', composer: 'பாரம்பரியம்' },
        { num: 5, title: 'எடுக்கப்பட்டு செல்லப்பட்டான்', lyrics: 'எடுக்கப்பட்டு செல்லப்பட்டான் சிலுவைக்கு\nமரித்தான் என்மாவல்தி அற்புதமாய்\nனுயிர்த்தெழுந்த பாஸ்தான் மூன்றாம் நாளே\nலோகங்கள் சித்திரிக்க நினைக்க', composer: 'பாரம்பரியம்' }
      ]
    },
    {
      id: 2,
      name: 'ஆராதனை பாடல்கள்',
      color: '#9C27B0',
      icon: '📗',
      songs: [
        { num: 1, title: 'யேசுவே எனக்கு ஆற்றல்', lyrics: 'யேசுவே எனக்கு ஆற்றல், யேசுவே என் சரண்\nயேசுவே என்றெல்லாம் நன்றாய்\nசொன்ன வாக்கு நிறைவேற்றி\nயேசு என்னை கரையேற்ற', composer: 'பாரம்பரியம்' },
        { num: 2, title: 'விண்ணவனை துதிப்பாய்', lyrics: 'விண்ணவனை துதிப்பாய் நெஞ்சமே\nதேவனடிப்பணி செய்திடுவாய்\nவிசுவாசமிக்க நல்லவனாய்\nவாழ்க உனக்கே சிரஸ்ஸும் உயிரும்', composer: 'பாரம்பரியம்' },
        { num: 3, title: 'தெய்வம் தனிச்சொல்', lyrics: 'தெய்வம் தனிச்சொல் உண்மையாய்\nதேவ சொல் அறிந்தவனே\nசொல்லலாம் எல்லாம் உண்டுதான்\nதெய்வ மகிமை பெறுவோம்', composer: 'பாரம்பரியம்' },
        { num: 4, title: 'கிறிஸ்து என் மீட்பன்', lyrics: 'கிறிஸ்து என் மீட்பன் கிறிஸ்து என் ராஜன்\nকிறிஸ்து என் நல்லவன் கிறிஸ்து என் தெய்வன்\nதான் சிலுவையில் மரித்துதான்\nனுயிர்த்தெழுந்த மூன்றாம் நாளே', composer: 'பாரம்பரியம்' }
      ]
    },
    {
      id: 3,
      name: 'ஜெபமக்கள் பாடல்கள்',
      color: '#FF1744',
      icon: '📔',
      songs: [
        { num: 1, title: 'தெய்வ தரிசனம்', lyrics: 'தெய்வ தரிசனம் பெற்றுக்கொண்டு\nதெய்வனை நினைந்து கிறுதினை\nநிறுந்திட்டேன் எனக்கு சுகம்\nநினைக்கிற போதெல்லாம் நன்றாய்', composer: 'பாரம்பரியம்' },
        { num: 2, title: 'நம்பிக்கையுடனே', lyrics: 'நம்பிக்கையுடனே என் தெய்வனை சரணடைந்து\nநாடும் எனக்கு நல்ல பதிலுமாய்\nநம்பிக்கை மேவிய நெஞ்சிற்கு\nநாளும் நல்ல ஆசீர்வாதம்', composer: 'பாரம்பரியம்' }
      ]
    }
  ],
  'hi': [
    {
      id: 1,
      name: 'हिंदी गीत संग्रह',
      color: '#FF6B35',
      icon: '📕',
      songs: [
        { num: 1, title: 'ईश्वर का प्रेम', lyrics: 'ईश्वर का प्रेम मेरी शक्ति है...', composer: 'परंपरागत' },
        { num: 2, title: 'मेरे प्रभु', lyrics: 'मेरे प्रभु तू मेरी शरण है...', composer: 'परंपरागत' }
      ]
    }
  ],
  'kn': [
    {
      id: 1,
      name: 'ಕನ್ನಡ ಗಿತಗಳು',
      color: '#FF6B35',
      icon: '📕',
      songs: [
        { num: 1, title: 'ದೇವರ ಪ್ರೇಮ', lyrics: 'ದೇವರ ಪ್ರೇಮ ನನಗೆ ಶಕ್ತಿ...', composer: 'ಪರಂಪರೆ' },
        { num: 2, title: 'ನನ್ನ ಪ್ರಭೂ', lyrics: 'ನನ್ನ ಪ್ರಭೂ ನೀನು ನನ್ನ ಶರಣ...', composer: 'ಪರಂಪರೆ' }
      ]
    }
  ]
};

function setSongLanguage(lang) {
  currentSongLanguage = lang;

  // Update button styles
  const buttons = ['songLangEN', 'songLangTA', 'songLangHI', 'songLangKN'];
  buttons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btnId === 'songLang' + lang.toUpperCase()) {
      btn.style.background = '#FF6B35';
      btn.style.color = 'white';
    } else {
      btn.style.background = '#f0f0f0';
      btn.style.color = '#333';
    }
  });

  // Clear search and reload books
  document.getElementById('songSearchInput').value = '';
  loadAllSongBooks();
}

function loadSongBooksRealtime() {
  loadAllSongBooks();
}

function loadAllSongBooks() {
  const songBooksList = document.getElementById('songBooksList');
  const books = songBooksLibraryML[currentSongLanguage] || songBooksLibraryML['en'];
  let html = '';

  books.forEach(book => {
    html += `
      <div onclick="openSongBook(${book.id})" style="
        background: ${book.color};
        color: white;
        border-radius: 12px;
        padding: 20px;
        cursor: pointer;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        min-height: 180px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)';">
        <div style="font-size: 48px; margin-bottom: 12px;">${book.icon}</div>
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">${book.name}</div>
        <div style="font-size: 12px; opacity: 0.9;">${book.songs.length} songs</div>
      </div>
    `;
  });

  songBooksList.innerHTML = html;
}

function openSongBook(bookId) {
  const books = songBooksLibraryML[currentSongLanguage] || songBooksLibraryML['en'];
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const songBooksList = document.getElementById('songBooksList');
  let html = '';

  // Back button and title
  html += `
    <div style="grid-column: 1 / -1; margin-bottom: 12px;">
      <button onclick="loadAllSongBooks()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">← Back to Books</button>
    </div>
    <div style="grid-column: 1 / -1; background: ${book.color}; color: white; border-radius: 12px; padding: 20px; margin-bottom: 12px; text-align: center;">
      <div style="font-size: 32px; margin-bottom: 8px;">${book.icon}</div>
      <div style="font-size: 20px; font-weight: 700;">${book.name}</div>
    </div>
  `;

  // Songs in the book
  book.songs.forEach(song => {
    html += `
      <div onclick="viewSongDetail(${book.id}, ${song.num})" style="
        grid-column: 1 / -1;
        background: white;
        border: 2px solid ${book.color};
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s;
      " onmouseover="this.style.backgroundColor='${book.color}10';" onmouseout="this.style.backgroundColor='white';">
        <div>
          <div style="font-weight: 600; color: #333; margin-bottom: 4px; font-size: 16px;">${song.num}. ${song.title}</div>
          <div style="font-size: 12px; color: #999;">${song.composer}</div>
        </div>
        <div style="color: ${book.color}; font-size: 20px;">▶</div>
      </div>
    `;
  });

  songBooksList.innerHTML = html;
}

function viewSongDetail(bookId, songNum) {
  const books = songBooksLibraryML[currentSongLanguage] || songBooksLibraryML['en'];
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const song = book.songs.find(s => s.num === songNum);
  if (!song) return;

  // Display in lyrics modal
  document.getElementById('songTitle').textContent = song.title;
  document.getElementById('songBook').textContent = book.name;
  document.getElementById('songNum').textContent = songNum;
  document.getElementById('songComposer').textContent = song.composer;
  document.getElementById('songLyricsContent').textContent = song.lyrics;

  // Store lyrics for copy function
  window.currentSongLyrics = song.lyrics;

  document.getElementById('songLyricsModal').style.display = 'flex';
}

function closeSongLyricsModal() {
  document.getElementById('songLyricsModal').style.display = 'none';
}

function copyLyrics() {
  const lyrics = window.currentSongLyrics;
  const songTitle = document.getElementById('songTitle').textContent;
  const songComposer = document.getElementById('songComposer').textContent;

  const fullText = `${songTitle}\n\nComposer: ${songComposer}\n\n${lyrics}\n\n- From Church Nexus Song Books App`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(fullText).then(() => {
      alert('✅ Lyrics copied to clipboard!');
    }).catch(() => {
      fallbackCopyLyrics(fullText);
    });
  } else {
    fallbackCopyLyrics(fullText);
  }
}

function fallbackCopyLyrics(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('✅ Lyrics copied to clipboard!');
}

function searchSongs() {
  const searchTerm = document.getElementById('songSearchInput').value.toLowerCase();
  const books = songBooksLibraryML[currentSongLanguage] || songBooksLibraryML['en'];
  const songBooksList = document.getElementById('songBooksList');

  if (!searchTerm) {
    loadAllSongBooks();
    return;
  }

  let html = `<div style="grid-column: 1 / -1; margin-bottom: 12px;">
    <button onclick="loadAllSongBooks()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">← Back to Books</button>
  </div>
  <div style="grid-column: 1 / -1; background: #f0f0f0; border-radius: 8px; padding: 12px; margin-bottom: 12px; color: #666;">
    Search results for: "${searchTerm}"
  </div>`;

  let foundCount = 0;

  books.forEach(book => {
    book.songs.forEach(song => {
      if (song.title.toLowerCase().includes(searchTerm) ||
          song.num.toString().includes(searchTerm) ||
          song.composer.toLowerCase().includes(searchTerm)) {
        foundCount++;
        html += `
          <div onclick="viewSongDetail(${book.id}, ${song.num})" style="
            grid-column: 1 / -1;
            background: white;
            border: 2px solid ${book.color};
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
          " onmouseover="this.style.backgroundColor='${book.color}10';" onmouseout="this.style.backgroundColor='white';">
            <div>
              <div style="font-weight: 600; color: #333; margin-bottom: 4px; font-size: 16px;">${song.num}. ${song.title}</div>
              <div style="font-size: 12px; color: #999;">${book.name} • ${song.composer}</div>
            </div>
            <div style="color: ${book.color}; font-size: 20px;">▶</div>
          </div>
        `;
      }
    });
  });

  if (foundCount === 0) {
    html += `<div style="grid-column: 1 / -1; text-align: center; color: #999; padding: 40px 20px;">
      No songs found matching "${searchTerm}"
    </div>`;
  }

  songBooksList.innerHTML = html;
}

// GALLERY FUNCTIONS
// ============================================

let galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos')) || [];
const isAdmin = currentMember && (currentMember.name === 'admin' || currentMember.role === 'admin');

function loadGalleryRealtime() {
  console.log('Loading gallery...');
  galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos')) || [];
  console.log('Gallery photos found:', galleryPhotos.length);

  // Show admin upload section if user is admin
  const adminSection = document.getElementById('adminUploadSection');
  if (adminSection) {
    if (isAdmin) {
      adminSection.style.display = 'block';
    } else {
      adminSection.style.display = 'none';
    }
  }

  displayGalleryPhotos();
}

let currentFullscreenPhotoIndex = 0;

function displayFullscreenPhoto(index) {
  if (index < 0 || index >= galleryPhotos.length) return;

  currentFullscreenPhotoIndex = index;
  const photo = galleryPhotos[index];
  const img = document.getElementById('fullscreenImage');

  if (img) {
    img.src = photo.imageUrl;

    // Populate user info
    document.getElementById('fullscreenUsername').textContent = photo.uploadedBy || 'User';
    document.getElementById('fullscreenDate').textContent = new Date(photo.timestamp).toLocaleDateString();

    // Populate caption
    document.getElementById('fullscreenCaption').textContent = photo.caption || '';

    // Populate stats
    const likeCount = photo.likes ? photo.likes.length : 0;
    const commentCount = photo.comments ? photo.comments.length : 0;
    document.getElementById('fullscreenStats').innerHTML = `
      <div style="margin-bottom: 8px;"><strong>${likeCount}</strong> ${likeCount === 1 ? 'like' : 'likes'}</div>
      <div><strong>${commentCount}</strong> ${commentCount === 1 ? 'comment' : 'comments'}</div>
    `;

    // Populate action buttons
    const liked = photo.likes && photo.likes.includes(currentMember?.name || 'guest');
    document.getElementById('fullscreenActions').innerHTML = `
      <button onclick="likePhoto(${index})" style="background: none; border: none; color: ${liked ? '#FF1744' : '#666'}; cursor: pointer; font-size: 20px; transition: all 0.2s;">
        ${liked ? '❤️' : '🤍'} Like
      </button>
      <button style="background: none; border: none; color: #666; cursor: pointer; font-size: 20px; transition: all 0.2s;">
        💬 Comment
      </button>
      <button style="background: none; border: none; color: #666; cursor: pointer; font-size: 20px; transition: all 0.2s;">
        📤 Share
      </button>
    `;

    // Populate comments
    document.getElementById('fullscreenComments').innerHTML = photo.comments && photo.comments.length > 0
      ? photo.comments.map(c => `
          <div style="margin-bottom: 12px; font-size: 13px;">
            <strong style="color: #333;">${c.user}</strong>
            <span style="color: #666;"> ${c.text}</span>
          </div>
        `).join('')
      : '<div style="color: #999; font-size: 13px;">No comments yet</div>';
  }
}

function openFullscreenImage(imageUrl) {
  if (!imageUrl) return;

  // Find the photo index
  const index = galleryPhotos.findIndex(p => p.imageUrl === imageUrl);
  if (index === -1) return;

  const modal = document.getElementById('fullscreenImageModal');
  const content = document.getElementById('fullscreenContent');

  if (modal) {
    displayFullscreenPhoto(index);
    modal.style.display = 'flex !important';
    modal.style.position = 'fixed';
    modal.style.zIndex = '2000';
    document.body.style.overflow = 'hidden';

    // Add scroll listener for Instagram-style infinite scroll
    if (content) {
      content.onscroll = function() {
        const scrollTop = content.scrollTop;
        const scrollHeight = content.scrollHeight;
        const clientHeight = content.clientHeight;

        // When scrolled to bottom, load next photo
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          if (currentFullscreenPhotoIndex < galleryPhotos.length - 1) {
            displayFullscreenPhoto(currentFullscreenPhotoIndex + 1);
          }
        }
      };
    }
  }
}

function closeFullscreenImage() {
  const modal = document.getElementById('fullscreenImageModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function displayGalleryPhotos() {
  const galleryPosts = document.getElementById('galleryPhotos');
  if (!galleryPosts) return;

  if (galleryPhotos.length === 0) {
    galleryPosts.innerHTML = '<div style="text-align: center; color: #999; padding: 60px 20px;"><div style="font-size: 64px; margin-bottom: 16px;">📷</div><div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">No photos yet</div><div style="font-size: 13px;">Check back soon for community photos</div></div>';
    return;
  }

  let html = '';
  galleryPhotos.forEach((photo, index) => {
    const liked = photo.likes && photo.likes.includes(currentMember?.name || 'guest');
    const likeCount = photo.likes ? photo.likes.length : 0;
    const commentCount = photo.comments ? photo.comments.length : 0;

    html += `
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border: 1px solid #f0f0f0; margin-bottom: 16px; transition: box-shadow 0.3s;">

        <!-- Post Header -->
        <div style="padding: 12px 16px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #f0f0f0;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px;">📷</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #333; font-size: 14px;">${photo.uploadedBy}</div>
            <div style="font-size: 11px; color: #999;">${new Date(photo.timestamp).toLocaleDateString()}</div>
          </div>
        </div>

        <!-- Photo -->
        <div style="width: 100%; aspect-ratio: 1 / 1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 72px; overflow: hidden; position: relative; color: white; cursor: pointer;" onclick="openFullscreenImage('${photo.imageUrl}')">
          📷
          ${photo.imageUrl ? `<img id="img-${index}" src="${photo.imageUrl}" style="position: absolute; width: 100%; height: 100%; object-fit: cover; display: none;" onload="this.style.display='block';" onerror="console.log('Image failed to load');">` : ''}
        </div>

        <!-- Engagement Stats -->
        <div style="padding: 12px 16px; display: flex; gap: 24px; font-size: 13px; color: #333; font-weight: 600; border-bottom: 1px solid #f0f0f0;">
          <span>❤️ <span style="color: #667eea;">${likeCount}</span> Likes</span>
          <span>💬 <span style="color: #667eea;">${commentCount}</span> Comments</span>
        </div>

        <!-- Caption -->
        <div style="padding: 12px 16px;">
          <div style="color: #333; line-height: 1.5; font-size: 14px;">${photo.caption}</div>
        </div>

        <!-- Action Buttons (Instagram Style) -->
        <div style="padding: 8px 12px; display: flex; gap: 4px;">
          <button onclick="likePhoto(${index})" style="background: none; border: none; color: ${liked ? '#FF1744' : '#666'}; cursor: pointer; padding: 8px 12px; font-size: 22px; transition: all 0.2s; opacity: ${liked ? '1' : '0.8'}; transform: ${liked ? 'scale(1.1)' : 'scale(1)'};">
            ${liked ? '❤️' : '🤍'}
          </button>
          <button onclick="toggleCommentSection(${index})" style="background: none; border: none; color: #666; cursor: pointer; padding: 8px 12px; font-size: 20px; transition: all 0.2s;">
            💬
          </button>
          <button onclick="sharePhoto(${index})" style="background: none; border: none; color: #666; cursor: pointer; padding: 8px 12px; font-size: 20px; transition: all 0.2s;">
            📤
          </button>
        </div>

        <!-- Like Count -->
        <div style="padding: 0 16px 8px; font-size: 14px; color: #333; font-weight: 700;">
          ${likeCount > 0 ? `<span style="color: ${liked ? '#FF1744' : '#333'};">${likeCount}</span> <span style="color: #999;">${likeCount === 1 ? 'like' : 'likes'}</span>` : '<span style="color: #999;">No likes yet</span>'}
        </div>

        <!-- Comment Section (Hidden by default) -->
        <div id="commentSection${index}" style="padding: 16px; border-top: 1px solid #f0f0f0; display: none; background: #fafafa;">
          <!-- Comments List -->
          <div style="margin-bottom: 12px; max-height: 200px; overflow-y: auto;">
            ${photo.comments && photo.comments.length > 0 ? photo.comments.map(c => `
              <div style="background: white; padding: 10px 12px; border-radius: 8px; margin-bottom: 8px; font-size: 13px; border-left: 3px solid #667eea;">
                <strong style="color: #667eea; display: block; margin-bottom: 2px;">${c.name}</strong>
                <span style="color: #333;">${c.text}</span>
              </div>
            `).join('') : '<div style="color: #999; font-size: 13px; text-align: center; padding: 20px 0;">Be the first to comment!</div>'}
          </div>
          <!-- Comment Input -->
          <div style="display: flex; gap: 8px;">
            <input type="text" id="commentInput${index}" placeholder="Write a comment..." style="flex: 1; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; outline: none;">
            <button onclick="addComment(${index})" style="background: #667eea; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 13px;">Post</button>
          </div>
        </div>
      </div>
    `;
  });

  galleryPosts.innerHTML = html;
}

function uploadGalleryPhoto() {
  const caption = document.getElementById('photoCaption').value;
  const fileInput = document.getElementById('photoFile');
  const file = fileInput.files[0];

  if (!caption || !file) {
    alert('Please add a caption and select a photo');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const photo = {
      id: Date.now(),
      caption: caption,
      imageUrl: e.target.result,
      uploadedBy: currentMember?.name || 'Admin',
      timestamp: new Date().toISOString(),
      likes: [],
      comments: []
    };

    galleryPhotos.unshift(photo);
    localStorage.setItem('galleryPhotos', JSON.stringify(galleryPhotos));

    document.getElementById('photoCaption').value = '';
    fileInput.value = '';
    displayGalleryPhotos();
    alert('✅ Photo uploaded successfully!');
  };

  reader.readAsDataURL(file);
}

function likePhoto(index) {
  const userName = currentMember?.name || 'guest';
  const photo = galleryPhotos[index];

  if (!photo.likes) photo.likes = [];

  const likeIndex = photo.likes.indexOf(userName);
  if (likeIndex > -1) {
    photo.likes.splice(likeIndex, 1);
  } else {
    photo.likes.push(userName);
  }

  localStorage.setItem('galleryPhotos', JSON.stringify(galleryPhotos));
  displayGalleryPhotos();
}

function toggleCommentSection(index) {
  const section = document.getElementById(`commentSection${index}`);
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function addComment(index) {
  const input = document.getElementById(`commentInput${index}`);
  const text = input.value.trim();
  const photo = galleryPhotos[index];

  if (!text) {
    alert('Please write a comment');
    return;
  }

  if (!photo.comments) photo.comments = [];

  photo.comments.push({
    name: currentMember?.name || 'Anonymous',
    text: text,
    timestamp: new Date().toISOString()
  });

  localStorage.setItem('galleryPhotos', JSON.stringify(galleryPhotos));
  input.value = '';
  displayGalleryPhotos();
}

function sharePhoto(index) {
  const photo = galleryPhotos[index];
  const shareText = `📷 ${photo.caption}\n\nShared from Church Nexus Gallery\n${currentMember?.name || 'Someone'} shared this with you`;

  if (navigator.share) {
    navigator.share({
      title: 'Church Gallery',
      text: shareText
    }).catch(err => console.log('Share cancelled'));
  } else {
    // Fallback: copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('✅ Photo details copied to clipboard!');
      });
    } else {
      alert('📋 ' + shareText);
    }
  }
}
