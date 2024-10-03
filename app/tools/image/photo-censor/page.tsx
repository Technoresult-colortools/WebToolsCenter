import { Metadata } from 'next';
import PhotoCensorClient from './PhotoCensorClient';

export const metadata: Metadata = {
    title: 'Photo Censor Tool | WebToolsCenter',
    description: 'Easily apply censoring to images with the Photo Censor tool. Blur, pixelate, or black-out areas of your image, customize the intensity, and download the censored image.',
    keywords: 'photo censor, blur image, pixelate image, black-out image, image censoring, privacy protection, image editing tool, download censored image',
  };
  
   
export default function PhotoCensor() {
  return <PhotoCensorClient />;
}