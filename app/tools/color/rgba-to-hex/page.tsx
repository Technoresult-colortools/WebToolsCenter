import { Metadata } from 'next';
import RgbaToHexClient from './RgbaToHexClient';

export const metadata: Metadata = {
    title: 'RGBA to Hex Converter | WebToolsCenter',
    description: 'Convert RGBA color values to Hex format with our RGBA to Hex Converter. Specify alpha values for transparency and get instant previews for your web design projects.',
    keywords: 'RGBA to hex converter, color conversion tool, transparency in hex, web design tools, CSS color formats, RGBA color values, color picker, graphic design tools',
    openGraph: {
        title: 'RGBA to Hex Converter | Convert Colors with Transparency',
        description: 'Easily convert RGBA color values to Hex format with adjustable transparency for your web design projects. Preview colors instantly!',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/rgba-to-hex',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RGBA to Hex Converter | WebToolsCenter',
        description: 'Convert RGBA values to Hex format with our simple tool and get real-time previews for transparent colors.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/rgba-to-hex',
    },
};

export default function RgbaToHex() {
    return <RgbaToHexClient />;
}
