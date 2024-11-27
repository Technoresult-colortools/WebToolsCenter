import { Metadata } from 'next';
import TextToHandwritingClient from './TextToHandwritingClient';

export const metadata: Metadata = {
    title: 'Text to Handwriting Converter | Create Realistic Notes | WebToolsCenter',
    description: 'Convert digital text into lifelike handwritten notes with our Text to Handwriting Converter. Customize fonts, colors, and backgrounds for unique and authentic-looking documents.',
    keywords: 'text to handwriting, handwriting converter, digital to handwritten, custom fonts, personalized notes, handwriting simulation, document customization, PDF generation, educational tools, design resources',
    openGraph: {
        title: 'Text to Handwriting Converter | Lifelike Handwritten Notes',
        description: 'Easily transform text into realistic handwritten notes with customizable fonts, colors, and backgrounds. Perfect for creating personalized notes and educational resources.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/text-to-handwriting',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Text to Handwriting Converter | Personalized Handwritten Documents',
        description: 'Create authentic handwritten notes from text with customizable options. Ideal for design, education, and personalized documents.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/text-to-handwriting',
    }
};

export default function TextToHandwriting() {
    return <TextToHandwritingClient />;
}
