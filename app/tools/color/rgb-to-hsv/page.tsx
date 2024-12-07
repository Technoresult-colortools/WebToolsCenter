import { Metadata } from 'next';
import RgbToHsvClient from './RgbToHsvClient';

export const metadata: Metadata = {
    title: 'RGB to HSV Converter | WebToolsCenter',
    description: 'Convert RGB (Red, Green, Blue) color values to HSV (Hue, Saturation, Value) format easily with our user-friendly RGB to HSV Converter. Perfect for artists, designers, and developers.',
    keywords: 'RGB to HSV, color converter, color conversion tool, digital design tools, color palettes, HSV color codes',
    openGraph: {
        title: 'RGB to HSV Converter | Effortless Color Transformation',
        description: 'Easily convert RGB color values to HSV (Hue, Saturation, Value) format using our intuitive tool. Ideal for design professionals and developers.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/rgb-to-hsv',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RGB to HSV Converter | WebToolsCenter',
        description: 'Quickly transform RGB values to HSV with our simple and efficient tool. Ideal for graphic designers and developers.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/rgb-to-hsv',
    },
};

export default function RgbToHsv() {
    return <RgbToHsvClient />;
}
