import { Metadata } from 'next';
import GlitchEffectGeneratorClient from './GlitchEffectGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Text Glitch Effect Generator | WebToolsCenter',
    description: 'Create stunning, glitchy text effects with the CSS Text Glitch Effect Generator. Customize glitch styles, colors, intensities, and animation speeds, and generate HTML and CSS code with one-click copy functionality.',
    keywords: 'CSS text glitch effect generator, glitchy text effects, customizable glitch effects, text animation, CSS animation, glitch effect, dynamic text effects, text design tool',
};
  
export default function TextGlitchEffectGenerator() {
  return <GlitchEffectGeneratorClient />;
}