import { Metadata } from 'next';
import WordScramblerClient from './WordScramblerClient';

export const metadata: Metadata = {
    title: 'Word Scrambler | Create Puzzles and Games | WebToolsCenter',
    description: 'Scramble words effortlessly with our Word Scrambler tool. Perfect for puzzles, games, or adding a fun twist to your text. Shuffle letters with ease and generate challenging content.',
    keywords: 'word scrambler, text manipulation, word puzzles, games, shuffle words, fun text tool',
    openGraph: {
        title: 'Word Scrambler | Fun Text Manipulation Tool',
        description: 'Easily shuffle the letters of words in your text to create puzzles, games, or just for fun. Generate scrambled text instantly and enjoy the challenge.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/word-scrambler',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Word Scrambler | Create Puzzles and Fun Text',
        description: 'Use our Word Scrambler to shuffle text for puzzles, games, or creative challenges. Generate scrambled words in seconds.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/word-scrambler',
    }
};

export default function WordScrambler() {
    return <WordScramblerClient />;
}
