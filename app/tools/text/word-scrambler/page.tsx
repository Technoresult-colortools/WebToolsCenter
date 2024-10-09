import { Metadata } from 'next';
import WordScramblerClient from './WordScramblerClient';

export const metadata: Metadata = {
    title: 'Word Scrambler | WebToolsCenter',
    description: 'Shuffle the letters of each word in your text with our Word Scrambler tool. Perfect for creating puzzles, games, or just for fun. Easily generate scrambled text and enjoy the challenge!',
    keywords: 'word scrambler, text manipulation, word puzzles, games, shuffle words, fun text tool',
  };   

export default function WordScrambler() {
  return <WordScramblerClient />;
}