import { Metadata } from 'next';
import CodeToImageClient from './CodeToImageClient';

export const metadata: Metadata = {
    title: 'Code to Image Converter | WebToolsCenter',
    description: 'Convert your code snippets into beautifully styled, shareable images with the Code to Image Converter. Perfect for developers to showcase their code with syntax highlighting, themes, and custom layouts.',
    keywords: 'code to image, code image converter, convert code to image, code to png, syntax highlighting images, code sharing, code snippet images, watermark code images, programming code images, code image editor',
  };
  
export default function CodeToImageConverter() {
  return <CodeToImageClient />;
}