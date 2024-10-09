import { Metadata } from 'next';
import LoremIpsumClient from './LoremIpsumClient';

export const metadata: Metadata = {
    title: 'Lorem Ipsum Generator | WebToolsCenter',
    description: 'Generate Lorem Ipsum placeholder text easily with our Lorem Ipsum Generator. Perfect for designers, developers, and anyone needing dummy text for layout design or content testing.',
    keywords: 'lorem ipsum generator, placeholder text, dummy text, text generator, layout design, content testing, shuffle text, copy lorem ipsum',
  };
   

export default function LoremIpsumGenerator() {
  return <LoremIpsumClient />;
}