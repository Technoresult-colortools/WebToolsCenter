import { Metadata } from 'next';
import BoxRadiusGeneratorClient from './BoxRadiusGeneratorClient';

export const metadata: Metadata = {
    title: 'Border Radius Generator | WebToolsCenter',
    description: 'Easily create and customize border radii for your UI elements. Adjust individual corners, link them for simultaneous changes, and preview in real-time. Copy the generated CSS code with ease for your web projects.',
    keywords: 'border radius generator, customizable border radius, UI design tool, CSS border radius, pixel and percentage units, responsive design, real-time preview',
  };  
  
export default function BorderRadiusGenerator() {
  return <BoxRadiusGeneratorClient />;
}