// Bible API Integration
// Fetches Bible passages from various sources

async function fetchBiblePassage(bookName, chapter, language = 'English') {
    try {
        // Map book names to standard abbreviations
        const bookMap = {
            'Genesis': 'GEN',
            'Exodus': 'EXO',
            'Leviticus': 'LEV',
            'Numbers': 'NUM',
            'Deuteronomy': 'DEU',
            'Joshua': 'JOS',
            'Judges': 'JDG',
            'Ruth': 'RUT',
            '1 Samuel': '1SA',
            '2 Samuel': '2SA',
            '1 Kings': '1KI',
            '2 Kings': '2KI',
            '1 Chronicles': '1CH',
            '2 Chronicles': '2CH',
            'Ezra': 'EZR',
            'Nehemiah': 'NEH',
            'Esther': 'EST',
            'Job': 'JOB',
            'Psalms': 'PSA',
            'Proverbs': 'PRO',
            'Ecclesiastes': 'ECC',
            'Isaiah': 'ISA',
            'Jeremiah': 'JER',
            'Lamentations': 'LAM',
            'Ezekiel': 'EZK',
            'Daniel': 'DAN',
            'Hosea': 'HOS',
            'Joel': 'JOL',
            'Amos': 'AMO',
            'Obadiah': 'OBA',
            'Jonah': 'JON',
            'Micah': 'MIC',
            'Nahum': 'NAH',
            'Habakkuk': 'HAB',
            'Zephaniah': 'ZEP',
            'Haggai': 'HAG',
            'Zechariah': 'ZEC',
            'Malachi': 'MAL',
            'Matthew': 'MAT',
            'Mark': 'MRK',
            'Luke': 'LUK',
            'John': 'JHN',
            'Acts': 'ACT',
            'Romans': 'ROM',
            '1 Corinthians': '1CO',
            '2 Corinthians': '2CO',
            'Galatians': 'GAL',
            'Ephesians': 'EPH',
            'Philippians': 'PHP',
            'Colossians': 'COL',
            '1 Thessalonians': '1TH',
            '2 Thessalonians': '2TH',
            '1 Timothy': '1TI',
            '2 Timothy': '2TI',
            'Titus': 'TIT',
            'Philemon': 'PHM',
            'Hebrews': 'HEB',
            'James': 'JAS',
            '1 Peter': '1PE',
            '2 Peter': '2PE',
            '1 John': '1JN',
            '2 John': '2JN',
            '3 John': '3JN',
            'Jude': 'JUD',
            'Revelation': 'REV'
        };

        const bookCode = bookMap[bookName] || bookName;
        const reference = `${bookCode} ${chapter}`;

        // Try using Bible.com API
        const response = await fetch(`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/search?query=${encodeURIComponent(reference)}`, {
            headers: {
                'api-key': 'e8f5d1c2b3e4a5f6c7d8e9f0a1b2c3d4'
            }
        }).catch(() => null);

        if (response && response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const verses = data.results.map(result => ({
                    verse: result.reference || '',
                    content: result.text || ''
                }));
                return { verses };
            }
        }

        // Fallback: Return mock verses if API fails
        return {
            verses: [
                {
                    verse: `${bookName} ${chapter}:1`,
                    content: 'Bible content could not be loaded. Please check your internet connection.'
                }
            ]
        };

    } catch (error) {
        console.error('Error fetching Bible passage:', error);
        return {
            verses: [
                {
                    verse: 'Error',
                    content: 'Unable to load Bible verses at this time.'
                }
            ]
        };
    }
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
