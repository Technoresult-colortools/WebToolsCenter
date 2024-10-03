import { Metadata } from 'next';
import ColorConverterClient from './ColorConverterClient';
export const metadata: Metadata = {
  title: 'Color Converter | WebToolsCenter',
  description: 'Easily convert between HEX, RGB, HSL, HSV, and RGBA color formats with our Color Converter. Adjust values, preview colors in real-time, and copy color codes for web and graphic design projects.',
  keywords: 'color converter, HEX to RGB, HSL converter, HSV color converter, RGBA to HEX, color format conversion, web design, graphic design tools, color preview, real-time color adjustment',
};

  

export default function ColorConverter() {
  return <ColorConverterClient />;
}