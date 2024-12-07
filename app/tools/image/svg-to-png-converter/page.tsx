import { Metadata } from 'next';
import SvgToPngClient from './SvgToPngClient';

export const metadata: Metadata = {
    title: 'SVG to PNG Converter | WebToolsCenter',
    description: 'Easily convert SVG files to high-quality PNG images with our SVG to PNG Converter. Customize the scale, background, and download the PNG in your preferred resolution.',
    keywords: 'svg to png, svg to png converter, convert svg to png, svg png tool, svg image conversion, scalable vector graphics to png, png image download',
    openGraph: {
        title: 'SVG to PNG Converter | Convert Images Online | WebToolsCenter',
        description: 'Convert SVG files to high-quality PNG images. Customize scale, background, and download PNGs in your desired resolution with the SVG to PNG Converter.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/svg-to-png-converter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SVG to PNG Converter | Online Image Conversion Tool',
        description: 'Easily convert SVG files to PNG images with customizable settings. Download high-quality PNGs for web and graphic projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/svg-to-png-converter',
    },
};

export default function SvgToPngConverter() {
    return <SvgToPngClient />;
}
