import { Metadata } from 'next';
import LetterCounterClient from './LetterCounterClient';

export const metadata: Metadata = {
    title: 'Letter Counter | WebToolsCenter',
    description: 'Quickly count letters, words, and characters with our Letter Counter tool. Analyze your text and get detailed statistics for writing, editing, or content creation.',
    keywords: 'letter counter, word count, character count, text analytics, writing tools, text analysis, copy analytics, download text stats',
  };   

export default function LetterCounter() {
  return <LetterCounterClient />;
}