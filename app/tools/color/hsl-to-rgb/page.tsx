import { Metadata } from 'next';
import HslToRgbClient from './HslToRgbClient';

export const metadata: Metadata = {
    title: 'HSL to RGB Converter | WebToolsCenter',
    description: 'Easily convert HSL (Hue, Saturation, Lightness) values to RGB (Red, Green, Blue) format with our HSL to RGB Converter. Perfect for designers and artists to achieve accurate color representation.',
    keywords: 'HSL to RGB, color converter, color conversion tool, digital design tools, RGB values, HSL values',
    openGraph: {
        title: 'HSL to RGB Converter | Convert Colors Accurately',
        description: 'Convert HSL (Hue, Saturation, Lightness) values to RGB (Red, Green, Blue) format effortlessly. Ideal for web design and artistic projects requiring precise color translation.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/hsl-to-rgb',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HSL to RGB Converter | WebToolsCenter',
        description: 'Convert HSL values to RGB format with ease. Perfect for designers and artists looking for accurate color representation.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/hsl-to-rgb',
    },
};

export default function HslToRgb() {
    return <HslToRgbClient />;
}
