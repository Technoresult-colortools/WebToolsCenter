import { Metadata } from 'next';
import GlitchEffectGeneratorClient from './GlitchEffectGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Text Glitch Effect Generator | WebToolsCenter',
    description: 'Create stunning, glitchy text effects with the CSS Text Glitch Effect Generator. Customize glitch styles, colors, intensities, and animation speeds, and generate HTML and CSS code with one-click copy functionality.',
    keywords: 'CSS text glitch effect generator, glitchy text effects, customizable glitch effects, text animation, CSS animation, glitch effect, dynamic text effects, text design tool',
    openGraph: {
        title: 'CSS Text Glitch Effect Generator | Create Dynamic Glitchy Text',
        description: 'Generate glitchy text effects with customizable styles, colors, intensities, and animation speeds. Get HTML and CSS code instantly for your designs.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/text-glitch-effect-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CSS Text Glitch Effect Generator | WebToolsCenter',
        description: 'Design glitchy text effects effortlessly with our Glitch Effect Generator. Customize styles, colors, and animations, and get CSS instantly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/text-glitch-effect-generator',
    },
};

export default function TextGlitchEffectGenerator() {
    return <GlitchEffectGeneratorClient />;
}
