import { Metadata } from 'next';
import ColorWheelClient from './ColorWheelClient';

export const metadata: Metadata = {
    title: 'Color Wheel Tool | WebToolsCenter',
    description: 'Explore and understand color relationships with the Color Wheel Tool. Create harmonious palettes, fine-tune colors, and generate hex codes using our interactive color wheel. Perfect for designers, artists, and creatives.',
    keywords: 'color wheel, color theory, color harmonies, color palette generator, complementary colors, analogous colors, triadic colors, hue saturation lightness, hex code generator, interactive color wheel, design tools, web design, color picker',
  };
  
  
   
export default function ColorWheel() {
  return <ColorWheelClient />;
}