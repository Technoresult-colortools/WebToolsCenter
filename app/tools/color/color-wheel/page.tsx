import { Metadata } from 'next';
import ColorWheelClient from './ColorWheelClient';

export const metadata: Metadata = {
    title: 'Color Wheel Tool | WebToolsCenter',
    description: 'Explore and understand color relationships with the Color Wheel Tool. Create harmonious palettes, fine-tune colors, and generate hex codes using our interactive color wheel. Perfect for designers, artists, and creatives.',
    keywords: 'color wheel, color theory, color harmonies, color palette generator, complementary colors, analogous colors, triadic colors, hue saturation lightness, hex code generator, interactive color wheel, design tools, web design, color picker',
    openGraph: {
        title: 'Color Wheel Tool | Explore Color Relationships',
        description: 'Interactive Color Wheel Tool for creating harmonious palettes, understanding color theory, and generating hex codes. Ideal for designers and artists.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/color-wheel',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Color Wheel Tool | WebToolsCenter',
        description: 'Discover color harmonies and relationships with our interactive Color Wheel Tool. Generate hex codes and design perfect palettes.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/color-wheel',
    },
};

export default function ColorWheel() {
    return <ColorWheelClient />;
}
