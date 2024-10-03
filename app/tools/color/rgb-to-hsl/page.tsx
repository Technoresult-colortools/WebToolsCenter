import { Metadata } from 'next';
import RgbToHslClient from './RgbToHslClient';

export const metadata: Metadata = {
    title: 'RGB to HSL Converter | WebToolsCenter',
    description: 'Convert RGB color values to HSL (Hue, Saturation, Lightness) easily with our RGB to HSL Converter tool. Ideal for designers and developers working with color formats.',
    keywords: 'RGB to HSL, color converter, RGB to HSL converter, color conversion tool, web design, HSL colors, color formats, design tools',
  };
  
export default function RgbToHsl() {
  return <RgbToHslClient />;
}