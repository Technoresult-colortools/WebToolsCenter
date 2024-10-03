import { Metadata } from 'next';
import ImageColorPickerClient from './ImageColorPickerClient';

export const metadata: Metadata = {
    title: 'Image Color Picker | WebToolsCenter',
    description: 'Extract colors from any image with our Image Color Picker. Easily select, copy, and save colors in HEX, RGB, and HSL formats for your design projects. Features real-time magnification and color history for quick access.',
    keywords: 'image color picker, color extraction, HEX, RGB, HSL, color formats, design tools, color magnifier, color history, web design, graphic design, color picker tool',
  };  
export default function ImageColorPicker() {
  return <ImageColorPickerClient />;
}