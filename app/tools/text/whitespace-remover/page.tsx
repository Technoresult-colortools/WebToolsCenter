import { Metadata } from 'next';
import WhiteSpaceRemoverClient from './WhiteSpaceRemoverClient';

export const metadata: Metadata = {
    title: 'White Space Remover | WebToolsCenter',
    description: 'Easily remove unwanted white spaces, extra spaces, and compress line breaks in your text with our White Space Remover tool.',
    keywords: 'white space remover, text cleaner, remove spaces, format text, clean text, content formatting tool',
  };  
   

export default function WhiteSpaceRemover() {
  return <WhiteSpaceRemoverClient />;
}