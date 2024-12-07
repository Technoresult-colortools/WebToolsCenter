import { Metadata } from 'next';
import PhotoCensorClient from './PhotoCensorClient';

export const metadata: Metadata = {
    title: 'Photo Censor Tool | WebToolsCenter',
    description: 'Easily apply censoring to images with the Photo Censor tool. Blur, pixelate, or black-out areas of your image, customize the intensity, and download the censored image.',
    keywords: 'photo censor, blur image, pixelate image, black-out image, image censoring, privacy protection, image editing tool, download censored image',
    openGraph: {
        title: 'Photo Censor Tool | Blur, Pixelate & Edit Images | WebToolsCenter',
        description: 'Censor images with ease using the Photo Censor tool. Blur, pixelate, or black-out specific areas and download the edited image.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/image/photo-censor',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Photo Censor Tool | Image Privacy Editor',
        description: 'Protect privacy by censoring images. Blur, pixelate, or black-out areas using the Photo Censor tool and download your edited image.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/image/photo-censor',
    },
};

export default function PhotoCensor() {
    return <PhotoCensorClient />;
}
