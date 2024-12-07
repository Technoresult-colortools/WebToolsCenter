import { Metadata } from 'next';
import PngToSvgClient from './PngToSvgClient';

export const metadata: Metadata = {
    title: 'PNG to SVG Converter | WebToolsCenter',
    description: 'Convert PNG images to scalable SVG format with ease. Maintain quality while reducing file size, perfect for web and graphic design projects.',
    keywords: 'PNG to SVG, PNG to SVG converter, convert PNG to SVG, image conversion tool, vectorize image, SVG graphics, web design tools, graphic design tools, image optimization',
    openGraph: {
        title: 'PNG to SVG Converter | Convert Images to Vectors | WebToolsCenter',
        description: 'Easily convert PNG files to scalable SVG format. Optimize images for web and graphic design with the PNG to SVG Converter.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/png-to-svg-converter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PNG to SVG Converter | Image Vectorization Tool',
        description: 'Convert PNG images to scalable SVG format. Use the PNG to SVG Converter for high-quality image optimization.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/png-to-svg-converter',
    },
};

export default function PNGtoSVGConverter() {
    return <PngToSvgClient />;
}
