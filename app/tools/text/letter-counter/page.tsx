import { Metadata } from 'next';
import LetterCounterClient from './LetterCounterClient';

export const metadata: Metadata = {
    title: 'Letter Counter | Count Letters, Words & Characters | WebToolsCenter',
    description: 'Quickly count letters, words, and characters in your text with our Letter Counter tool. Analyze text efficiently for writing, editing, or content creation with detailed statistics.',
    keywords: 'letter counter, word count, character count, text analytics, writing tools, text analysis, copy analytics, download text stats',
    openGraph: {
        title: 'Letter Counter | Text Analytics Tool',
        description: 'Analyze your text with our Letter Counter. Count letters, words, and characters instantly. Ideal for writers, editors, and content creators.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/letter-counter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Letter Counter | Analyze Text Instantly',
        description: 'Count letters, words, and characters in your text with ease. Perfect for writing, editing, and content analysis.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/letter-counter',
    }
};

export default function LetterCounter() {
    return <LetterCounterClient />;
}
