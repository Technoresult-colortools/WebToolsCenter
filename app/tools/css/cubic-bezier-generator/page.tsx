import { Metadata } from 'next';
import CubicBezierGeneratorClient from './CubicBezierGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Background Pattern Generator | WebToolsCenter',
    description: 'Create stunning and customizable CSS background patterns with this interactive generator. Choose from various pattern types, adjust sizes, colors, and animations, and copy the CSS code for easy integration.',
    keywords: 'CSS background pattern generator, customizable patterns, CSS patterns, stripes, dots, hexagons, zigzag, pattern generator, background design tool',
};

  
export default function CSSCubicBezierGenerator() {
  return <CubicBezierGeneratorClient />;
}