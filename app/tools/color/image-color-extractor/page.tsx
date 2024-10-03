import { Metadata } from 'next';
import ImageColorExtractorClient from './ImageColorExtractorClient';

export const metadata: Metadata = {
    title: 'Image Color Extractor | WebToolsCenter',
    description: 'Analyze images and extract their dominant colors with our Image Color Extractor. Perfect for designers and artists, this tool helps you quickly identify and use color palettes in HEX, RGB, and HSL formats.',
    keywords: 'image color extractor, dominant colors extraction, color palettes, HEX, RGB, HSL, design tools, visual content, color analysis, web design, graphic design, color swatches',
  };
   
export default function ColorExtractor() {
  return <ImageColorExtractorClient />;
}