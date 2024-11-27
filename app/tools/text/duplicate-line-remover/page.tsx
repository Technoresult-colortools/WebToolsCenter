import { Metadata } from 'next';
import DuplicateLineRemoverClient from './DuplicateLineRemoverClient';

export const metadata: Metadata = {
    title: 'Duplicate Line Remover | Text Cleanup Tool | WebToolsCenter',
    description: 'Effortlessly remove duplicate lines from your text with advanced options like case sensitivity and whitespace trimming. Organize and process text efficiently with our Duplicate Line Remover.',
    keywords: 'duplicate line remover, remove duplicates, clean up text, case sensitive, trim whitespace, line numbering, sort text, text processing, list organizer, text data tool',
    openGraph: {
        title: 'Duplicate Line Remover | Text Cleanup Tool',
        description: 'Remove duplicate lines, sort text, and organize your data with customizable options for case sensitivity and trimming. Perfect for text processing and list management.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/duplicate-line-remover',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Duplicate Line Remover | Clean and Organize Text',
        description: 'Streamline your text with our Duplicate Line Remover. Remove duplicates, sort, and process text data easily and efficiently.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/duplicate-line-remover',
    }
};

export default function DuplicateLineRemover() {
    return <DuplicateLineRemoverClient />;
}
