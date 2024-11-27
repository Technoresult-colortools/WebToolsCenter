import { Metadata } from 'next';
import LoremIpsumClient from './LoremIpsumClient';

export const metadata: Metadata = {
    title: 'Lorem Ipsum Generator | Create Placeholder Text | WebToolsCenter',
    description: 'Generate Lorem Ipsum placeholder text easily for your projects. Perfect for designers, developers, and anyone needing dummy text for layout design or content testing.',
    keywords: 'lorem ipsum generator, placeholder text, dummy text, text generator, layout design, content testing, shuffle text, copy lorem ipsum',
    openGraph: {
        title: 'Lorem Ipsum Generator | Dummy Text for Layout Design',
        description: 'Quickly create Lorem Ipsum placeholder text for your design and development projects. Ideal for layout testing and content simulation.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/lorem-ipsum-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lorem Ipsum Generator | Generate Dummy Text',
        description: 'Easily generate Lorem Ipsum placeholder text for design and content testing. Perfect for developers and designers.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/lorem-ipsum-generator',
    }
};

export default function LoremIpsumGenerator() {
    return <LoremIpsumClient />;
}
