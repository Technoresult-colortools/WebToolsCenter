import { Metadata } from 'next';
import BackgroundPatternGeneratorClient from './BackgroundPatternGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Background Pattern Generator | WebToolsCenter',
    description: 'Create customizable background patterns with this intuitive generator. Choose from various patterns, adjust colors, size, and animation, then preview and copy the generated CSS for your projects.',
    keywords: 'CSS background pattern generator, customizable patterns, pattern animation, background design tool, CSS generator, web design tools, real-time preview, pattern creation tool',
    openGraph: {
        title: 'CSS Background Pattern Generator | Design Custom Patterns | WebToolsCenter',
        description: 'Design and customize CSS background patterns with ease. Adjust colors, sizes, and animations, and copy the CSS for your projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/background-pattern-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CSS Background Pattern Generator | Web Design Tool',
        description: 'Create customizable CSS background patterns. Adjust settings, preview patterns in real-time, and copy CSS for web design projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/background-pattern-generator',
    },
};

export default function BackgroundPatternGenerator() {
    return <BackgroundPatternGeneratorClient />;
}
