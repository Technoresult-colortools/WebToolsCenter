import { Metadata } from 'next';
import WordCounterClient from './WordCounterClient';

export const metadata: Metadata = {
    title: 'Words Counter | WebToolsCenter',
    description: 'Count words and characters in your text with our Words Counter tool. Shuffle, copy, download, and clear text easily for various uses.',
    keywords: 'words counter, character counter, text analysis, word shuffle, copy text, download text, content tools',
  };
  
   

export default function WordsCounter() {
  return <WordCounterClient />;
}