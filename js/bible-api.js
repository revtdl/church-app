// Bible API Integration
// Fetches Bible passages from various sources

async function fetchBiblePassage(bookName, chapter, language = 'English') {
    try {
        console.log('📖 Fetching:', bookName, 'Chapter', chapter);

        // Try the API FIRST (gets better/more complete verses)
        const reference = `${bookName} ${chapter}`;
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`, { timeout: 5000 });

        if (response && response.ok) {
            const data = await response.json();
            if (data.verses && data.verses.length > 0) {
                const verses = data.verses.map(verse => ({
                    verse: verse.reference || '',
                    content: verse.text || ''
                }));
                console.log('✅ Got', verses.length, 'verses from API');
                return { verses };
            }
        }

        // API failed or returned no data - use local fallback
        console.log('⚠️ API failed, using local fallback data');
        if (BIBLE_DATA_FALLBACK && BIBLE_DATA_FALLBACK[bookName]) {
            const fallbackData = getBibleDataFallback(bookName, chapter);
            if (fallbackData && fallbackData.verses && fallbackData.verses.length > 0) {
                console.log('✅ Using local fallback -', fallbackData.verses.length, 'verses');
                return fallbackData;
            }
        }

        // Final fallback: Sample verses
        console.log('⚠️ Using sample fallback verses');
        return getSampleVerses(bookName, chapter);

    } catch (error) {
        console.error('❌ API Error:', error.message);

        // Use local data as fallback
        if (BIBLE_DATA_FALLBACK && BIBLE_DATA_FALLBACK[bookName]) {
            console.log('📚 Falling back to local data');
            return getBibleDataFallback(bookName, chapter);
        }

        return getSampleVerses(bookName, chapter);
    }
}

function getSampleVerses(bookName, chapter) {
    // Sample Bible verses for display when API is unavailable
    const sampleVerses = {
        'Genesis': {
            1: [
                { verse: 'Genesis 1:1', content: 'In the beginning God created the heavens and the earth.' },
                { verse: 'Genesis 1:2', content: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.' }
            ]
        },
        'John': {
            3: [
                { verse: 'John 3:16', content: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
                { verse: 'John 3:17', content: 'For God did not send his Son into the world to condemn the world, but to save the world through him.' }
            ]
        },
        'Psalms': {
            23: [
                { verse: 'Psalms 23:1', content: 'The LORD is my shepherd, I shall not be in want.' },
                { verse: 'Psalms 23:2', content: 'He makes me lie down in green pastures, he leads me beside quiet waters.' }
            ]
        },
        'Romans': {
            3: [
                { verse: 'Romans 3:23', content: 'for all have sinned and fall short of the glory of God' },
                { verse: 'Romans 3:24', content: 'and all are justified freely by his grace through the redemption that came by Christ Jesus.' }
            ]
        }
    };

    const bookVerses = sampleVerses[bookName];
    if (bookVerses && bookVerses[chapter]) {
        return { verses: bookVerses[chapter] };
    }

    return {
        verses: [
            {
                verse: `${bookName} ${chapter}:1`,
                content: 'Bible content. This is a sample verse. To see full Bible content, please check your internet connection.'
            }
        ]
    };
}

// Alternative: Use a local Bible data source if available
async function fetchBiblePassageLocal(bookName, chapter, language = 'English') {
    try {
        // This function would fetch from a local JSON file or Firestore
        // For now, return a placeholder
        return {
            verses: [
                {
                    verse: `${bookName} ${chapter}:1`,
                    content: 'Verse content to be loaded from local source'
                }
            ]
        };
    } catch (error) {
        console.error('Error loading Bible passage from local source:', error);
        return null;
    }
}
