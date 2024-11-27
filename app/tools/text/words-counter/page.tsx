import { Metadata } from 'next';
import WordCounterClient from './WordCounterClient';

export const metadata: Metadata = {
    title: 'Word Counter | Count Words and Characters | WebToolsCenter',
    description: 'Efficiently count words and characters in your text with the Word Counter tool. Enjoy features like text shuffling, copying, downloading, and clearing for all your content needs.',
    keywords: 'word counter, character counter, text analysis, word shuffle, copy text, download text, content tools',
    openGraph: {
        title: 'Word Counter | Analyze Text Easily',
        description: 'Quickly count words and characters with our Word Counter tool. Perfect for content creation, editing, and professional writing needs.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/words-counter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Word Counter | Count Words and Characters Online',
        description: 'Count and analyze your text easily with the Word Counter tool. Shuffle, copy, and download text for professional and personal projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/words-counter',
    }
};

export default function WordsCounter() {
    return <WordCounterClient />;
}
