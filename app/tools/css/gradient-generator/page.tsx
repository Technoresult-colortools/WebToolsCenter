import { Metadata } from 'next';
import GradientGeneratorClient from './GradientGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Gradient Generator | WebToolsCenter',
    description: 'Design beautiful and customizable CSS gradients with ease. Choose between linear and radial gradients, preview in real-time, and copy the CSS for your web projects with just a click.',
    keywords: 'CSS gradient generator, customizable gradients, linear gradient, radial gradient, gradient backgrounds, gradient design tool, web design gradients',
  };  
  
export default function CSSGradientGenerator() {
  return <GradientGeneratorClient />;
}