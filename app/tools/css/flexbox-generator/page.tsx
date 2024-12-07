import { Metadata } from 'next';
import FlexBoxGeneratorClient from './FlexBoxGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Flexbox Generator | WebToolsCenter',
    description: 'Create and visualize flexible layouts effortlessly with the CSS Flexbox Generator. Adjust Flexbox properties interactively and see real-time results, perfect for quick prototyping by web developers and designers.',
    keywords: 'CSS Flexbox generator, flexible layouts, interactive interface, real-time visualization, web development tools, layout prototyping, CSS tools',
    openGraph: {
        title: 'CSS Flexbox Generator | Interactive Layout Tool | WebToolsCenter',
        description: 'Effortlessly create and customize flexible layouts with the CSS Flexbox Generator. Adjust properties interactively and visualize layouts in real-time.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/flexbox-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CSS Flexbox Generator | Web Design Tool',
        description: 'Visualize and prototype flexible layouts with the CSS Flexbox Generator. Adjust properties interactively and copy the CSS code easily.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/flexbox-generator',
    },
};

export default function FlexboxGenerator() {
    return <FlexBoxGeneratorClient />;
}
