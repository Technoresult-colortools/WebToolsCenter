import { Metadata } from 'next';
import ImageFiltersClient from './ImageFiltersClient';

export const metadata: Metadata = {
    title: 'Image Filters | WebToolsCenter',
    description: 'Enhance and transform your images with our Image Filters tool. Apply a wide range of filters, adjust intensity, and create stunning visual content effortlessly. Perfect for photographers, designers, and social media enthusiasts.',
    keywords: 'image filters, photo editing, image enhancement, filter intensity, grayscale, sepia, hue rotation, image manipulation, visual content creation, social media images, artistic effects, photo filters online',
};
   
export default function ImageFilters() {
  return <ImageFiltersClient />;
}