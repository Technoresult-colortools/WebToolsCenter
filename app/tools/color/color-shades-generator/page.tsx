import { Metadata } from 'next';
import ColorShadesGeneratorClient from './ColorShadesGeneratorClient';

export const metadata: Metadata = {
    title: 'Color Shades Generator | WebToolsCenter',
    description: 'Easily generate multiple shades from a base color with our Color Shades Generator. Perfect for designers and developers looking for harmonious color palettes.',
    keywords: 'color shades generator, color palette tool, generate shades, color converter, design tools, web design, color harmonies',
  }; 
   
export default function ColorShadesGenerator() {
  return <ColorShadesGeneratorClient />;
}