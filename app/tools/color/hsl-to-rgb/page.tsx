import { Metadata } from 'next';
import HslToRgbClient from './HslToRgbClient';

  export const metadata: Metadata = {
    title: 'HSL to RGB Converter | WebToolsCenter',
    description: 'Easily convert HSL (Hue, Saturation, Lightness) values to RGB (Red, Green, Blue) format with our HSL to RGB Converter. Perfect for designers and artists to achieve accurate color representation.',
    keywords: 'HSL to RGB, color converter, color conversion tool, digital design tools, RGB values, HSL values',
  };
  
export default function HslToRgb() {
  return <HslToRgbClient />;
}