import { Metadata } from 'next';
import RgbToCmykClient from './RgbToCmykClient';

export const metadata: Metadata = {
    title: 'RGB to CMYK Converter | WebToolsCenter',
    description: 'Convert RGB color values to CMYK easily with our RGB to CMYK Converter. Ideal for designers and printers to ensure accurate color representation.',
    keywords: 'RGB to CMYK, color converter, color conversion tool, design tools, print design, color accuracy',
  };
  
  
export default function RgbToCmyk() {
  return <RgbToCmykClient />;
}