import { Metadata } from 'next';
import WhiteSpaceRemoverClient from './WhiteSpaceRemoverClient';

export const metadata: Metadata = {
    title: 'White Space Remover | Clean and Format Text | WebToolsCenter',
    description: 'Effortlessly remove unwanted white spaces, extra spaces, and compress line breaks in your text with our White Space Remover tool. Perfect for content formatting and clean text preparation.',
    keywords: 'white space remover, text cleaner, remove spaces, format text, clean text, content formatting tool',
    openGraph: {
        title: 'White Space Remover | Clean and Format Text',
        description: 'Quickly remove unnecessary spaces and format your text with the White Space Remover tool. Ideal for clean, professional content preparation.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/whitespace-remover',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'White Space Remover | Clean and Format Text Online',
        description: 'Clean up your text by removing extra spaces and formatting it efficiently. Use the White Space Remover for professional content creation.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/whitespace-remover',
    }
};

export default function WhiteSpaceRemover() {
    return <WhiteSpaceRemoverClient />;
}
