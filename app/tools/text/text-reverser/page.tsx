import { Metadata } from 'next';
import TextReverserClient from './TextReverserClient';

export const metadata: Metadata = {
    title: 'Text Reverser | WebToolsCenter',
    description: 'Reverse the order of characters in your text instantly with our Text Reverser tool. Perfect for puzzles, text formatting experiments, or just for fun!',
    keywords: 'text reverser, reverse text tool, reverse characters, flip text, text manipulation, text puzzles, copy reversed text, text formatting tool',
};
   

export default function TextReverser() {
  return <TextReverserClient />;
}