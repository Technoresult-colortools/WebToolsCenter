import { Metadata } from 'next';
import ImageColorExtractorClient from './ImageColorExtractorClient';

export const metadata: Metadata = {
    title: 'Image Color Extractor | WebToolsCenter',
    description: 'Analyze images and extract their dominant colors with our Image Color Extractor. Perfect for designers and artists, this tool helps you quickly identify and use color palettes in HEX, RGB, and HSL formats.',
    keywords: 'image color extractor, dominant colors extraction, color palettes, HEX, RGB, HSL, design tools, visual content, color analysis, web design, graphic design, color swatches',
    openGraph: {
        title: 'Image Color Extractor | Extract Dominant Colors from Images',
        description: 'Use the Image Color Extractor to analyze images and identify dominant colors. Export palettes in HEX, RGB, and HSL formats for design and creative projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/image-color-extractor',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Image Color Extractor | Analyze and Extract Colors',
        description: 'Quickly extract dominant colors from images with our Image Color Extractor. Perfect for creating color palettes in HEX, RGB, and HSL formats.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/image-color-extractor',
    },
};

export default function ColorExtractor() {
    return <ImageColorExtractorClient />;
}
