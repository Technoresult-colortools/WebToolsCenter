import { Metadata } from 'next';
import DuplicateLineRemoverClient from './DuplicateLineRemoverClient';

export const metadata: Metadata = {
    title: 'Duplicate Line Remover | WebToolsCenter',
    description: 'Effortlessly remove duplicate lines from your text with the Duplicate Line Remover. Customize options like case sensitivity, trim whitespace, and more for optimal text processing and organization.',
    keywords: 'duplicate line remover, remove duplicates, clean up text, case sensitive, trim whitespace, line numbering, sort text, text processing, list organizer, text data tool',
};
   

export default function DuplicateLineRemover() {
  return <DuplicateLineRemoverClient />;
}