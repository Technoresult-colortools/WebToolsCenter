import { Metadata } from 'next';
import HexToRgbaClient from './HexToRgbaClient';

export const metadata: Metadata = {
    title: 'Hex to RGBA Converter | WebToolsCenter',
    description: 'Easily convert Hex color codes to RGBA format with our Hex to RGBA Converter. Specify alpha values for transparency and get instant previews for your designs.',
    keywords: 'hex to RGBA converter, color conversion tool, color transparency, web design tools, CSS color formats, RGBA color values, hex color code, color picker, graphic design tools',
  };
  
   
export default function HexToRgba() {
  return <HexToRgbaClient />;
}