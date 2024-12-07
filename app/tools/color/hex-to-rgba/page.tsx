import { Metadata } from 'next';
import HexToRgbaClient from './HexToRgbaClient';

export const metadata: Metadata = {
    title: 'Hex to RGBA Converter | WebToolsCenter',
    description: 'Easily convert Hex color codes to RGBA format with our Hex to RGBA Converter. Specify alpha values for transparency and get instant previews for your designs.',
    keywords: 'hex to RGBA converter, color conversion tool, color transparency, web design tools, CSS color formats, RGBA color values, hex color code, color picker, graphic design tools',
    openGraph: {
        title: 'Hex to RGBA Converter | Convert Colors with Transparency',
        description: 'Convert Hex color codes to RGBA format seamlessly. Adjust alpha transparency and preview your color transformations in real-time.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/hex-to-rgba',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Hex to RGBA Converter | WebToolsCenter',
        description: 'Easily convert Hex color codes to RGBA format and customize alpha transparency with our tool. Ideal for web and graphic design.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/hex-to-rgba',
    },
};

export default function HexToRgba() {
    return <HexToRgbaClient />;
}
