import { Metadata } from 'next';
import SvgPatternClient from './SvgPatternClient';

export const metadata: Metadata = {
    title: 'SVG Pattern Generator | WebToolsCenter',
    description: 'Create fully customizable and scalable SVG patterns with the SVG Pattern Generator. Adjust size, spacing, rotation, and color to design unique patterns. Export your pattern in SVG or copy the SVG code for use in web projects.',
    keywords: 'SVG Pattern Generator, pattern design, customizable patterns, SVG export, web design tool, background patterns, creative design tool, random pattern generator, scalable vector graphics, pattern creation tool',
};
   
export default function SvgPatternGenerator() {
  return <SvgPatternClient />;
}