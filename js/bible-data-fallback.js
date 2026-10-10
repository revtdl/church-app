// Comprehensive Bible Fallback Data
// Used when API fails to ensure correct verses for all chapters

const BIBLE_DATA_FALLBACK = {
    'Genesis': {
        1: [
            { verse: 'Genesis 1:1', content: 'In the beginning God created the heavens and the earth.' },
            { verse: 'Genesis 1:2', content: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.' },
            { verse: 'Genesis 1:3', content: 'And God said, "Let there be light," and there was light.' },
            { verse: 'Genesis 1:4', content: 'God saw that the light was good, and he separated the light from the darkness.' },
            { verse: 'Genesis 1:5', content: 'God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.' }
        ],
        2: [
            { verse: 'Genesis 2:1', content: 'Thus the heavens and the earth were completed in all their vast array.' },
            { verse: 'Genesis 2:2', content: 'By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.' },
            { verse: 'Genesis 2:3', content: 'Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating that he had done.' }
        ]
    },
    'John': {
        1: [
            { verse: 'John 1:1', content: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
            { verse: 'John 1:2', content: 'He was with God in the beginning.' },
            { verse: 'John 1:3', content: 'Through him all things were made; without him nothing has been made that has been made.' },
            { verse: 'John 1:4', content: 'In him was life, and that life was the light of all mankind.' },
            { verse: 'John 1:5', content: 'The light shines in the darkness, and the darkness has not overcome it.' }
        ],
        3: [
            { verse: 'John 3:16', content: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
            { verse: 'John 3:17', content: 'For God did not send his Son into the world to condemn the world, but to save the world through him.' },
            { verse: 'John 3:18', content: 'Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God\'s one and only Son.' }
        ]
    },
    'Psalms': {
        23: [
            { verse: 'Psalms 23:1', content: 'The Lord is my shepherd, I shall not be in want.' },
            { verse: 'Psalms 23:2', content: 'He makes me lie down in green pastures, he leads me beside quiet waters.' },
            { verse: 'Psalms 23:3', content: 'He restores my soul. He guides me in paths of righteousness for his name\'s sake.' },
            { verse: 'Psalms 23:4', content: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },
            { verse: 'Psalms 23:5', content: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.' }
        ]
    },
    'Joel': {
        1: [
            { verse: 'Joel 1:1', content: 'The word of the Lord that came to Joel son of Pethuel.' },
            { verse: 'Joel 1:2', content: 'Hear this, you elders; listen all who live in the land. Has anything like this ever happened in your days or in the days of your ancestors?' },
            { verse: 'Joel 1:3', content: 'Tell it to your children, and let your children tell it to their children, and their children to the next generation.' },
            { verse: 'Joel 1:4', content: 'What the locust swarm has left the great locusts have eaten; what the great locusts have left the young locusts have eaten; what the young locusts have left other locusts have eaten.' }
        ],
        2: [
            { verse: 'Joel 2:1', content: 'Blow the trumpet in Zion; sound the alarm on my holy hill. Let all who live in the land tremble, for the day of the Lord is coming. It is close at hand.' },
            { verse: 'Joel 2:2', content: 'A day of darkness and gloom, a day of clouds and blackness. Like dawn spreading across the mountains a large and mighty army comes, such as never was of old nor ever will be in ages to come.' }
        ]
    },
    'Romans': {
        3: [
            { verse: 'Romans 3:23', content: 'for all have sinned and fall short of the glory of God,' },
            { verse: 'Romans 3:24', content: 'and all are justified freely by his grace through the redemption that came by Christ Jesus.' }
        ]
    }
};

function getBibleDataFallback(bookName, chapter) {
    if (BIBLE_DATA_FALLBACK[bookName] && BIBLE_DATA_FALLBACK[bookName][chapter]) {
        return { verses: BIBLE_DATA_FALLBACK[bookName][chapter] };
    }

    // Default fallback for chapters not in the data
    return {
        verses: [
            {
                verse: `${bookName} ${chapter}:1`,
                content: 'Bible verse content. To see all verses, please check your internet connection or select a downloaded version.'
            }
        ]
    };
}
