import { Metadata } from 'next';
import RgbToHsvClient from './RgbToHsvClient';

  export const metadata: Metadata = {
    title: 'RGB to HSV Converter | WebToolsCenter',
    description: 'Convert RGB (Red, Green, Blue) color values to HSV (Hue, Saturation, Value) format easily with our user-friendly RGB to HSV Converter. Perfect for artists, designers, and developers.',
    keywords: 'RGB to HSV, color converter, color conversion tool, digital design tools, color palettes, HSV color codes',
  };
  
  
  
   
export default function RgbToHsv() {
  return <RgbToHsvClient />;
}