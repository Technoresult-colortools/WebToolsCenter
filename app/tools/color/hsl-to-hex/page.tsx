import { Metadata } from 'next';
import HslToHexClient from './HslToHexClient';

  export const metadata: Metadata = {
    title: 'HSL to Hex Converter | WebToolsCenter',
    description: 'Quickly convert HSL (Hue, Saturation, Lightness) values to Hex color codes with our user-friendly HSL to Hex Converter. Ideal for designers and developers seeking accurate color representation in web design.',
    keywords: 'HSL to Hex, color converter, color conversion tool, web design tools, Hex color codes, digital design',
  };
  
  
export default function HslToHex() {
  return <HslToHexClient />;
}