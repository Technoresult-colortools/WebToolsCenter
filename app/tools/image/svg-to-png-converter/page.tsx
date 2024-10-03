import { Metadata } from 'next';
import SvgToPngClient from './SvgToPngClient';

export const metadata: Metadata = {
    title: 'SVG to PNG Converter | WebToolsCenter',
    description: 'Easily convert SVG files to high-quality PNG images with our SVG to PNG Converter. Customize the scale, background, and download the PNG in your preferred resolution.',
    keywords: 'svg to png, svg to png converter, convert svg to png, svg png tool, svg image conversion, scalable vector graphics to png, png image download',
  };
  
  
   
export default function SvgToPngConverter() {
  return <SvgToPngClient />;
}