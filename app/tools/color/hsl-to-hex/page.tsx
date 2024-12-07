import { Metadata } from 'next';
import HslToHexClient from './HslToHexClient';

export const metadata: Metadata = {
    title: 'HSL to Hex Converter | WebToolsCenter',
    description: 'Quickly convert HSL (Hue, Saturation, Lightness) values to Hex color codes with our user-friendly HSL to Hex Converter. Ideal for designers and developers seeking accurate color representation in web design.',
    keywords: 'HSL to Hex, color converter, color conversion tool, web design tools, Hex color codes, digital design',
    openGraph: {
        title: 'HSL to Hex Converter | Convert Colors Accurately',
        description: 'Convert HSL values to Hex color codes effortlessly. Perfect for web design and development projects requiring precise color representation.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/hsl-to-hex',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HSL to Hex Converter | WebToolsCenter',
        description: 'Convert HSL (Hue, Saturation, Lightness) values to Hex color codes easily with our tool. Ideal for web and graphic designers.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/hsl-to-hex',
    },
};

export default function HslToHex() {
    return <HslToHexClient />;
}
