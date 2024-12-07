import { Metadata } from 'next';
import ImageToBase64Client from './ImageToBase64Client';

export const metadata: Metadata = {
    title: 'Image to Base64 Converter | WebToolsCenter',
    description: 'Convert image files into Base64 encoded strings easily with our Image to Base64 Converter. Perfect for embedding image data directly into HTML, CSS, or JavaScript files.',
    keywords: 'image to base64, image to base64 converter, convert image to base64, base64 encoding, base64 image embedding, download base64 string, base64 converter',
    openGraph: {
        title: 'Image to Base64 Converter | Encode Images to Base64 | WebToolsCenter',
        description: 'Easily convert images to Base64 encoded strings for embedding directly into your HTML, CSS, or JavaScript. A must-have tool for developers.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/image-to-base64',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Image to Base64 Converter | Encode Images Easily',
        description: 'Convert images to Base64 strings for easy embedding. Use the Image to Base64 Converter to generate and download Base64 encodings quickly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/image-to-base64',
    },
};

export default function ImageToBase64Converter() {
    return <ImageToBase64Client />;
}
