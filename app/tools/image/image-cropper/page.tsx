import { Metadata } from 'next';
import ImageCropperClient from './ImageCropperClient';

export const metadata: Metadata = {
    title: 'Image Cropper | Crop and Edit Images Online | WebToolsCenter',
    description: 'Effortlessly crop, rotate, and customize images with the Image Cropper tool. Adjust aspect ratios, zoom, and download your edited visuals. Ideal for designers, marketers, and social media managers.',
    keywords: 'image cropper, image cropping tool, image editor, image rotation, preset aspect ratios, zoom, crop images online, web tools, graphic design, visual content, social media images',
    openGraph: {
        title: 'Image Cropper | Edit Images Online | WebToolsCenter',
        description: 'Crop and edit your images online with the Image Cropper tool. Perfect for creating visuals for design, marketing, and social media.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/image-cropper',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Image Cropper | Online Image Editing Tool',
        description: 'Easily crop, rotate, zoom, and edit images with the Image Cropper tool. Download your customized visuals for design and social media.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/image-cropper',
    }
};

export default function EnhancedImageCropper() {
    return <ImageCropperClient />;
}
