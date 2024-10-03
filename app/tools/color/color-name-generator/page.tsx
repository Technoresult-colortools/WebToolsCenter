import { Metadata } from 'next';
import ColorNameGeneratorClient from './ColorNameGeneratorClient';

export const metadata: Metadata = {
    title: 'Color Name Generator | WebToolsCenter',
    description: 'Discover the name of any color by entering its HEX, RGB, or HSL value. The Color Name Generator tool is perfect for designers, artists, and developers who need precise color identification.',
    keywords: 'color name generator, hex to color name, rgb to color name, hsl to color name, color identification, color picker tool, design tools, web design, color names, hex to rgb converter',
  };
  
   
export default function ColorNameGenerator() {
  return <ColorNameGeneratorClient />;
}