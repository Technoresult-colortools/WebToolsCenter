import { Metadata } from 'next';
import CharacterFrequencyClient from './CharacterFrequencyClient';

export const metadata: Metadata = {
    title: 'Character Frequency Counter | Text Analysis Tool | WebToolsCenter',
    description: 'Analyze character and word frequency in text with our Character Frequency Counter. Perfect for text analysis, research, and identifying patterns in data.',
    keywords: 'character frequency counter, text analysis, frequency analysis, character count, word count, text frequency tool, copy character frequency, download frequency results',
    openGraph: {
        title: 'Character Frequency Counter | Text Analysis Tool',
        description: 'Perform detailed character and word frequency analysis with our powerful tool. Ideal for research, text analysis, and data pattern detection.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/character-frequency-counter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Character Frequency Counter | Analyze Text Patterns',
        description: 'Discover character and word frequency in text with our Character Frequency Counter. Copy or download results for deeper analysis.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/character-frequency-counter',
    }
};

export default function CharacterFrequencyCounter() {
    return <CharacterFrequencyClient />;
}
