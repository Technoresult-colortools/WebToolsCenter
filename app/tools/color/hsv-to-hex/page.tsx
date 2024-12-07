import { Metadata } from 'next';
import HsvToHexClient from './HsvToHexClient';

export const metadata: Metadata = {
    title: 'HSV to Hex Converter | WebToolsCenter',
    description: 'Quickly and easily convert HSV (Hue, Saturation, Value) color values to Hexadecimal codes with our HSV to Hex Converter. Ideal for web designers and developers.',
    keywords: 'HSV to Hex, color converter, HSV to Hex converter, color conversion tool, web design, Hex colors, color formats, design tools',
    openGraph: {
        title: 'HSV to Hex Converter | Quick and Accurate Color Conversion',
        description: 'Effortlessly convert HSV (Hue, Saturation, Value) color values to Hex codes. Perfect for web designers and developers needing precise color representation.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/hsv-to-hex',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HSV to Hex Converter | WebToolsCenter',
        description: 'Convert HSV values to Hex codes quickly and accurately with our user-friendly converter. Ideal for web and graphic design.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/hsv-to-hex',
    },
};

export default function HsvToHex() {
    return <HsvToHexClient />;
}
