import { Metadata } from 'next';
import BoxShadowGeneratorClient from './BoxShadowGeneratorClient';

export const metadata: Metadata = {
    title: 'Box Shadow Generator | WebToolsCenter',
    description: 'Create customizable CSS box shadows with ease. Adjust offset, blur, spread, and color for each shadow, preview in real-time, and copy or download the generated CSS for your web projects.',
    keywords: 'box shadow generator, CSS box shadow, customizable box shadows, web design tools, shadow effects, real-time CSS preview, inset shadows, web design shadows',
}; 
  
export default function BoxShadowGenerator() {
  return <BoxShadowGeneratorClient />;
}