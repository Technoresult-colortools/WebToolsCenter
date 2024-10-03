import { Metadata } from 'next';
import ColorGradientGeneratorClient from './ColorGradientGeneratorClient';
export const metadata: Metadata = {
    title: 'Color Gradient Generator | WebToolsCenter',
    description: 'Create beautiful linear, radial, and conic CSS gradients with the Color Gradient Generator. Add up to 5 color stops, adjust angles, and generate CSS code or PNG exports for your web design and graphic projects.',
    keywords: 'color gradient generator, CSS gradients, linear gradient, radial gradient, conic gradient, web design tools, gradient CSS code, gradient PNG export, color stops, color picker, gradient generator tool, graphic design',
  };
export default function GradientGeneratorPage() {
  return <ColorGradientGeneratorClient />;
}