import { Metadata } from 'next';
import BackgroundPatternGeneratorClient from './BackgroundPatternGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Background Pattern Generator | WebToolsCenter',
    description: 'Create customizable background patterns with this intuitive generator. Choose from various patterns, adjust colors, size, and animation, then preview and copy the generated CSS for your projects.',
    keywords: 'CSS background pattern generator, customizable patterns, pattern animation, background design tool, CSS generator, web design tools, real-time preview, pattern creation tool',
};

  
export default function BackgroundPatternGenerator() {
  return <BackgroundPatternGeneratorClient />;
}