import { Metadata } from 'next';
import RgbToHslClient from './RgbToHslClient';

export const metadata: Metadata = {
    title: 'RGB to HSL Converter | WebToolsCenter',
    description: 'Convert RGB color values to HSL (Hue, Saturation, Lightness) easily with our RGB to HSL Converter tool. Ideal for designers and developers working with color formats.',
    keywords: 'RGB to HSL, color converter, RGB to HSL converter, color conversion tool, web design, HSL colors, color formats, design tools',
    openGraph: {
        title: 'RGB to HSL Converter | Effortless Color Conversion',
        description: 'Easily convert RGB color values to HSL (Hue, Saturation, Lightness) with our user-friendly tool. Perfect for designers and developers.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/rgb-to-hsl',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RGB to HSL Converter | WebToolsCenter',
        description: 'Quickly convert RGB values to HSL with our intuitive converter tool. Ideal for web and graphic design projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/rgb-to-hsl',
    },
};

export default function RgbToHsl() {
    return <RgbToHslClient />;
}
