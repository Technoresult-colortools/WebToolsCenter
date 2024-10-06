import { Metadata } from 'next';
import GlassMorphismGeneratorClient from './GlassMorphismGeneratorClient';

export const metadata: Metadata = {
    title: 'Glassmorphism Generator | WebToolsCenter',
    description: 'Create stunning glass-like UI elements with the Glassmorphism Generator. Customize shapes, colors, blur intensity, transparency, and more. Real-time preview and easy CSS code generation.',
    keywords: 'Glassmorphism generator, glass effect, UI design, CSS glassmorphism, blur effect, customizable glass design, transparency, CSS generator, web design tool',
};


  
export default function GlassmorphismGenerator() {
  return <GlassMorphismGeneratorClient />;
}