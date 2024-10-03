import { Metadata } from 'next';
import ColorMixerClient from './ColorMixerClient';

  export const metadata: Metadata = {
    title: 'Color Mixer | WebToolsCenter',
    description: 'Use our interactive Color Mixer tool to blend two colors and generate a palette of intermediate shades. Perfect for designers and artists looking to enhance their projects with unique color combinations.',
    keywords: 'color mixer, color blending, color palette generator, graphic design, hex color, RGB color, HSL color',
  };
  
  
   
export default function ColorMixer() {
  return <ColorMixerClient />;
}