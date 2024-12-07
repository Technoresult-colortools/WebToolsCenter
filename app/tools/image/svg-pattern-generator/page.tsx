import { Metadata } from 'next';
import SvgPatternClient from './SvgPatternClient';

export const metadata: Metadata = {
    title: 'SVG Pattern Generator | WebToolsCenter',
    description: 'Create fully customizable and scalable SVG patterns with the SVG Pattern Generator. Adjust size, spacing, rotation, and color to design unique patterns. Export your pattern in SVG or copy the SVG code for use in web projects.',
    keywords: 'SVG Pattern Generator, pattern design, customizable patterns, SVG export, web design tool, background patterns, creative design tool, random pattern generator, scalable vector graphics, pattern creation tool',
    openGraph: {
        title: 'SVG Pattern Generator | Create Customizable Patterns | WebToolsCenter',
        description: 'Design unique and scalable SVG patterns with the SVG Pattern Generator. Adjust size, spacing, rotation, and color. Export or copy the SVG code for web projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/svg-pattern-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SVG Pattern Generator | Design Patterns Online',
        description: 'Create and customize scalable SVG patterns for web and design projects. Adjust settings, generate unique designs, and export patterns easily.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/svg-pattern-generator',
    },
};

export default function SvgPatternGenerator() {
    return <SvgPatternClient />;
}
