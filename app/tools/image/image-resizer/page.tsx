import { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient';

export const metadata: Metadata = {
    title: 'Image Resizer | Adjust Image Dimensions Online | WebToolsCenter',
    description: 'Resize images quickly with our Image Resizer tool. Adjust dimensions, preserve aspect ratio, and save in formats like PNG, JPEG, or WebP. Ideal for web design and social media.',
    keywords: 'image resizer, resize images online, image resizing tool, adjust image dimensions, preserve aspect ratio, PNG, JPEG, WebP, web design, social media images, download resized image',
    openGraph: {
        title: 'Image Resizer | Online Image Editing Tool | WebToolsCenter',
        description: 'Resize images to specific dimensions effortlessly. Choose from PNG, JPEG, or WebP formats and preserve quality for web use and social media.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/image-resizer',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Image Resizer | Online Image Adjustment Tool',
        description: 'Quickly resize images to desired dimensions, maintain aspect ratio, and choose output formats like PNG, JPEG, and WebP.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/image-resizer',
    }
};

export default function EnhancedImageResizer() {
    return <ImageResizerClient />;
}
