import { Metadata } from 'next';
import CharacterFrequencyClient from './CharacterFrequencyClient';

export const metadata: Metadata = {
    title: 'Character Frequency Counter | WebToolsCenter',
    description: 'Analyze character frequency in your text with our Character Frequency Counter. Useful for text analysis, research, and pattern detection.',
    keywords: 'character frequency counter, text analysis, frequency analysis, character count, word count, text frequency tool, copy character frequency, download frequency results',
};

   

export default function CharacterFrequencyCounter() {
  return <CharacterFrequencyClient />;
}