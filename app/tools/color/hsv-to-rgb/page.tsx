import { Metadata } from 'next';
import HsvToRgbClient from './HsvToRgbClient';

export const metadata: Metadata = {
    title: 'HSV to RGB Converter | WebToolsCenter',
    description: 'Convert HSV (Hue, Saturation, Value) color values to RGB (Red, Green, Blue) format effortlessly with our user-friendly HSV to RGB Converter. Ideal for artists, designers, and developers.',
    keywords: 'HSV to RGB, color converter, color conversion tool, web design tools, RGB color codes, digital design',
    openGraph: {
        title: 'HSV to RGB Converter | Easy Color Conversion Tool',
        description: 'Easily convert HSV (Hue, Saturation, Value) values to RGB (Red, Green, Blue) format. Perfect for designers and developers needing precise color formats.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/hsv-to-rgb',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HSV to RGB Converter | WebToolsCenter',
        description: 'Effortlessly convert HSV color values to RGB format with our tool. Designed for artists, designers, and developers.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/hsv-to-rgb',
    },
};

export default function HsvToRgb() {
    return <HsvToRgbClient />;
}
