import { Metadata } from 'next';
import HsvToHexClient from './HsvToHexClient';

export const metadata: Metadata = {
    title: 'HSV to Hex Converter | WebToolsCenter',
    description: 'Quickly and easily convert HSV (Hue, Saturation, Value) color values to Hexadecimal codes with our HSV to Hex Converter. Ideal for web designers and developers.',
    keywords: 'HSV to Hex, color converter, HSV to Hex converter, color conversion tool, web design, Hex colors, color formats, design tools',
  };
  
  
export default function HsvToHex() {
  return <HsvToHexClient />;
}