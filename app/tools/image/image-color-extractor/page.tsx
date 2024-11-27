import { Metadata } from 'next';
import ImageColorExtractorClient from './ImageColorExtractorClient';

export const metadata: Metadata = {
    title: 'Image Color Extractor | WebToolsCenter',
    description: 'Analyze images and extract their dominant colors with our Image Color Extractor. Perfect for designers and artists, this tool helps you quickly identify and use color palettes in HEX, RGB, and HSL formats.',
    keywords: 'image color extractor, dominant colors extraction, color palettes, HEX, RGB, HSL, design tools, visual content, color analysis, web design, graphic design, color swatches',
    openGraph: {
        title: 'Image Color Extractor | Extract Dominant Colors | WebToolsCenter',
        description: 'Use the Image Color Extractor to analyze images and extract their dominant colors. Create stunning color palettes for your designs with ease.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/image-color-extractor',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Image Color Extractor | Online Tool for Designers',
        description: 'Extract dominant colors from images with the Image Color Extractor. Quickly generate HEX, RGB, and HSL palettes for your projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/image-color-extractor',
    },
};

export default function ColorExtractor() {
    return <ImageColorExtractorClient />;
}
