import { Metadata } from 'next';
import CmykToRgbClient from './CmykToRgbClient';

  export const metadata: Metadata = {
    title: 'CMYK to RGB Converter | WebToolsCenter',
    description: 'Easily convert CMYK (Cyan, Magenta, Yellow, Key) color values to RGB (Red, Green, Blue) format with our user-friendly CMYK to RGB Converter. Perfect for graphic designers and digital artists.',
    keywords: 'CMYK to RGB, color converter, color conversion tool, graphic design tools, digital color palettes, RGB color codes',
  };
  
  
  
export default function CmykToRgb() {
  return <CmykToRgbClient />;
}