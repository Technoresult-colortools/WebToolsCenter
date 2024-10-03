import { Metadata } from 'next';
import ImageCropperClient from './ImageCropperClient';

export const metadata: Metadata = {
    title: 'Image Cropper | WebToolsCenter',
    description: 'Easily crop and edit images with our Image Cropper. Adjust aspect ratios, rotate, zoom, and download your customized images with a user-friendly tool perfect for designers, marketers, and social media managers.',
    keywords: 'image cropper, image cropping tool, image editor, image rotation, preset aspect ratios, zoom, crop images online, web tools, graphic design, visual content, social media images',
};
   
export default function ImageCropper() {
  return <ImageCropperClient />;
}