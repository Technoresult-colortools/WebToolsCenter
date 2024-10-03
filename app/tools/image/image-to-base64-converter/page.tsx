import { Metadata } from 'next';
import ImageToBase64Client from './ImageToBase64Client';

export const metadata: Metadata = {
    title: 'Image to Base64 Converter | WebToolsCenter',
    description: 'Convert image files into Base64 encoded strings easily with our Image to Base64 Converter. Perfect for embedding image data directly into HTML, CSS, or JavaScript files.',
    keywords: 'image to base64, image to base64 converter, convert image to base64, base64 encoding, base64 image embedding, download base64 string, base64 converter',
  };
  
export default function ImageToBase64Converter() {
  return <ImageToBase64Client />;
}