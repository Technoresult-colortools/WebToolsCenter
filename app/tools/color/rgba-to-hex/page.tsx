import { Metadata } from 'next';
import RgbaToHexClient from './RgbaToHexClient';

export const metadata: Metadata = {
    title: 'RGBA to Hex Converter | WebToolsCenter',
    description: 'Convert RGBA color values to Hex format with our RGBA to Hex Converter. Specify alpha values for transparency and get instant previews for your web design projects.',
    keywords: 'RGBA to hex converter, color conversion tool, transparency in hex, web design tools, CSS color formats, RGBA color values, color picker, graphic design tools',
  };
  
  
   
export default function RgbaToHex() {
  return <RgbaToHexClient />;
}