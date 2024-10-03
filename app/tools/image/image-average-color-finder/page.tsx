import { Metadata } from 'next';
import ImageAverageColorClient from './ImageAverageColorClient';

export const metadata: Metadata = {
    title: 'Image Average Color Finder | WebToolsCenter',
    description: 'The Image Average Color Finder analyzes uploaded images to determine their average color and dominant colors. Perfect for designers and artists, it provides accurate color palettes in HEX, RGB, and HSL formats.',
    keywords: 'image average color finder, dominant colors extraction, color palettes, HEX, RGB, HSL, design tools, color analysis, web design, graphic design, color swatches, average color calculation, responsive design',
};

   
export default function ImageAverageColorFinder() {
  return <ImageAverageColorClient />;
}