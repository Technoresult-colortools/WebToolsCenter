import { Metadata } from 'next';
import RgbToCmykClient from './RgbToCmykClient';

export const metadata: Metadata = {
    title: 'RGB to CMYK Converter | WebToolsCenter',
    description: 'Convert RGB color values to CMYK easily with our RGB to CMYK Converter. Ideal for designers and printers to ensure accurate color representation.',
    keywords: 'RGB to CMYK, color converter, color conversion tool, design tools, print design, color accuracy',
    openGraph: {
        title: 'RGB to CMYK Converter | Accurate Color Conversion',
        description: 'Easily convert RGB color values to CMYK for accurate color representation in print and design projects. Perfect for designers and printers.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/rgb-to-cmyk',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RGB to CMYK Converter | WebToolsCenter',
        description: 'Quickly convert RGB color values to CMYK with our easy-to-use tool. Ensure precise color accuracy for your designs.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/rgb-to-cmyk',
    },
};

export default function RgbToCmyk() {
    return <RgbToCmykClient />;
}
