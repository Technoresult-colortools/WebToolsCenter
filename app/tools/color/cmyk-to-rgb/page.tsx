import { Metadata } from 'next';
import CmykToRgbClient from './CmykToRgbClient';

export const metadata: Metadata = {
    title: 'CMYK to RGB Converter | WebToolsCenter',
    description: 'Easily convert CMYK (Cyan, Magenta, Yellow, Key) color values to RGB (Red, Green, Blue) format with our user-friendly CMYK to RGB Converter. Perfect for graphic designers and digital artists.',
    keywords: 'CMYK to RGB, color converter, color conversion tool, graphic design tools, digital color palettes, RGB color codes',
    openGraph: {
        title: 'CMYK to RGB Converter | Accurate Color Conversion Tool',
        description: 'Convert CMYK color values to RGB format effortlessly. Perfect for graphic designers and digital artists looking to work seamlessly with color palettes.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/cmyk-to-rgb',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CMYK to RGB Converter | WebToolsCenter',
        description: 'Convert CMYK to RGB with ease. Use our accurate color conversion tool for all your graphic design and digital art needs.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/cmyk-to-rgb',
    },
};

export default function CMYKtoRGBConverter() {
    return <CmykToRgbClient />;
}
