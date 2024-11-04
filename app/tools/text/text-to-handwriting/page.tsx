import { Metadata } from 'next';
import TextToHandwritingClient from './TextToHandwritingClient';

export const metadata: Metadata = {
    title: 'Text to Handwriting Converter | WebToolsCenter',
    description: 'Transform digital text into realistic handwritten notes with our Text to Handwriting Converter. Customize fonts, colors, and backgrounds for authentic-looking handwritten documents.',
    keywords: 'text to handwriting, handwriting converter, digital to handwritten, custom fonts, personalized notes, handwriting simulation, document customization, PDF generation, educational tools, design resources',
  };

   

export default function TextToHandwriting() {
  return <TextToHandwritingClient />;
}