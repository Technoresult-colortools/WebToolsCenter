import { Metadata } from 'next';
import TextReverserClient from './TextReverserClient';

export const metadata: Metadata = {
    title: 'Text Reverser | Reverse Characters Instantly | WebToolsCenter',
    description: 'Reverse the order of characters in your text with ease using our Text Reverser tool. Ideal for puzzles, experiments, or just for fun!',
    keywords: 'text reverser, reverse text tool, reverse characters, flip text, text manipulation, text puzzles, copy reversed text, text formatting tool',
    openGraph: {
        title: 'Text Reverser | Fun Text Manipulation Tool',
        description: 'Flip and reverse your text instantly with our Text Reverser. Great for puzzles, text experiments, or casual fun!',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/text-reverser',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Text Reverser | Flip and Reverse Text Easily',
        description: 'Reverse the order of characters in your text for puzzles, formatting experiments, or just for fun. Try it now!',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/text-reverser',
    }
};

export default function TextReverser() {
    return <TextReverserClient />;
}
