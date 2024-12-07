import { Metadata } from 'next';
import ColorNameGeneratorClient from './ColorNameGeneratorClient';

export const metadata: Metadata = {
    title: 'Color Name Generator | WebToolsCenter',
    description: 'Discover the name of any color by entering its HEX, RGB, or HSL value. The Color Name Generator tool is perfect for designers, artists, and developers who need precise color identification.',
    keywords: 'color name generator, hex to color name, rgb to color name, hsl to color name, color identification, color picker tool, design tools, web design, color names, hex to rgb converter',
    openGraph: {
        title: 'Color Name Generator | Identify Any Color',
        description: 'Input HEX, RGB, or HSL values to find the precise name of any color. Perfect for designers, developers, and artists seeking accurate color identification.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/color-name-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Color Name Generator | WebToolsCenter',
        description: 'Identify the name of any color using HEX, RGB, or HSL values. Ideal for designers and developers looking for precise color names.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/color-name-generator',
    },
};

export default function ColorNameGenerator() {
    return <ColorNameGeneratorClient />;
}
