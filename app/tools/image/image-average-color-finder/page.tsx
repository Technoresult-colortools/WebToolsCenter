import { Metadata } from 'next';
import ImageAverageColorClient from './ImageAverageColorClient';

export const metadata: Metadata = {
    title: 'Image Average Color Finder | WebToolsCenter',
    description: 'The Image Average Color Finder analyzes uploaded images to determine their average color and dominant colors. Perfect for designers and artists, it provides accurate color palettes in HEX, RGB, and HSL formats.',
    keywords: 'image average color finder, dominant colors extraction, color palettes, HEX, RGB, HSL, design tools, color analysis, web design, graphic design, color swatches, average color calculation, responsive design',
    openGraph: {
        title: 'Image Average Color Finder | Analyze Colors Online | WebToolsCenter',
        description: 'Discover average and dominant colors in your images with our Image Average Color Finder. Generate HEX, RGB, and HSL palettes for design and art.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/image-average-color-finder',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Image Average Color Finder | Online Tool for Designers',
        description: 'Analyze your images and find average and dominant colors with the Image Average Color Finder. Ideal for creating accurate color palettes.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/image-average-color-finder',
    },
};

export default function ImageAverageColorFinder() {
    return <ImageAverageColorClient />;
}
