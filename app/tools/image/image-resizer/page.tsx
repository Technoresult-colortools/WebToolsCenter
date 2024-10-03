import { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient';

export const metadata: Metadata = {
    title: 'Image Resizer | WebToolsCenter',
    description: 'Quickly resize images to specific dimensions with the Image Resizer tool. Adjust width and height, preserve aspect ratio, and choose from output formats like PNG, JPEG, and WebP. Perfect for web use and social media.',
    keywords: 'image resizer, resize images online, image resizing tool, adjust image dimensions, preserve aspect ratio, PNG, JPEG, WebP, web design, social media images, download resized image',
};
   
export default function ImageResizer() {
  return <ImageResizerClient />;
}