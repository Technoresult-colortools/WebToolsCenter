import { Metadata } from 'next';
import ColorConverterClient from './ColorConverterClient';

export const metadata: Metadata = {
    title: 'Color Converter | WebToolsCenter',
    description: 'Easily convert between HEX, RGB, HSL, HSV, and RGBA color formats with our Color Converter. Adjust values, preview colors in real-time, and copy color codes for web and graphic design projects.',
    keywords: 'color converter, HEX to RGB, HSL converter, HSV color converter, RGBA to HEX, color format conversion, web design, graphic design tools, color preview, real-time color adjustment',
    openGraph: {
        title: 'Color Converter | Convert HEX, RGB, HSL, and More',
        description: 'Convert between popular color formats like HEX, RGB, HSL, and RGBA. Preview colors in real-time and get accurate color codes for web and graphic design projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/color-converter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Color Converter | WebToolsCenter',
        description: 'Effortlessly convert between HEX, RGB, HSL, and other color formats. Adjust values, preview in real-time, and copy codes for your projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/color-converter',
    },
};

export default function ColorConverter() {
    return <ColorConverterClient />;
}
