import { Metadata } from 'next';
import FlexBoxGeneratorClient from './FlexBoxGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Flexbox Generator | WebToolsCenter',
    description: 'Create and visualize flexible layouts effortlessly with the CSS Flexbox Generator. Adjust Flexbox properties interactively and see real-time results, perfect for quick prototyping by web developers and designers.',
    keywords: 'CSS Flexbox generator, flexible layouts, interactive interface, real-time visualization, web development tools, layout prototyping, CSS tools',
  };  

  
export default function FlexboxGenerator() {
  return <FlexBoxGeneratorClient />;
}