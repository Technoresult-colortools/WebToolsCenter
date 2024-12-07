import { Metadata } from 'next';
import SvgBlobClient from './SvgBlobClient';

export const metadata: Metadata = {
    title: 'SVG Blob Generator | WebToolsCenter',
    description: 'Effortlessly create customizable SVG blobs with the SVG Blob Generator. Adjust growth, edge count, complexity, and smoothness to craft unique abstract shapes. Export your blob in SVG or PNG format for use in web design, illustrations, or other creative projects.',
    keywords: 'SVG Blob Generator, blob shapes, customizable SVG blobs, abstract design tool, export SVG, export PNG, blob generator online, graphic design tool, web design, creative blobs, random shape generator',
    openGraph: {
        title: 'SVG Blob Generator | Create Unique Shapes | WebToolsCenter',
        description: 'Generate customizable SVG blobs for creative projects. Adjust complexity and smoothness to design unique shapes and export in SVG or PNG formats.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/svg-blob-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SVG Blob Generator | Design Unique Shapes Online',
        description: 'Create and customize abstract SVG blobs for your design projects. Adjust settings, generate random shapes, and export in SVG or PNG.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/svg-blob-generator',
    },
};

export default function SVGBlobGenerator() {
    return <SvgBlobClient />;
}
