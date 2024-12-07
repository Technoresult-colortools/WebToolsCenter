import { Metadata } from 'next';
import CubicBezierGeneratorClient from './CubicBezierGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Background Pattern Generator | WebToolsCenter',
    description: 'Create stunning and customizable CSS background patterns with this interactive generator. Choose from various pattern types, adjust sizes, colors, and animations, and copy the CSS code for easy integration.',
    keywords: 'CSS background pattern generator, customizable patterns, CSS patterns, stripes, dots, hexagons, zigzag, pattern generator, background design tool',
    openGraph: {
        title: 'CSS Background Pattern Generator | Design Unique Patterns | WebToolsCenter',
        description: 'Generate stunning CSS background patterns with ease. Adjust pattern types, sizes, colors, and animations to suit your web design projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/cubic-bezier-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CSS Background Pattern Generator | Interactive Design Tool',
        description: 'Design customizable CSS background patterns. Choose types like stripes or dots, adjust colors and animations, and copy CSS code seamlessly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/cubic-bezier-generator',
    },
};

export default function CSSCubicBezierGenerator() {
    return <CubicBezierGeneratorClient />;
}
