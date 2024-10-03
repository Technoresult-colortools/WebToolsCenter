import { Metadata } from 'next';
import HsvToRgbClient from './HsvToRgbClient';

  export const metadata: Metadata = {
    title: 'HSV to RGB Converter | WebToolsCenter',
    description: 'Convert HSV (Hue, Saturation, Value) color values to RGB (Red, Green, Blue) format effortlessly with our user-friendly HSV to RGB Converter. Ideal for artists, designers, and developers.',
    keywords: 'HSV to RGB, color converter, color conversion tool, web design tools, RGB color codes, digital design',
  };
  
  
  
export default function HsvToRgb() {
  return <HsvToRgbClient />;
}