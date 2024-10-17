import { Metadata } from 'next';
import TriangleGeneratorClient from './TriangleGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Triangle Generator | WebToolsCenter',
    description: 'Easily generate customizable CSS triangles with the CSS Triangle Generator. Adjust triangle direction, size, color, and rotation to fit your design. Perfect for web designers and developers looking to create decorative elements using pure CSS.',
    keywords: 'CSS triangle generator, triangle shapes in CSS, customizable CSS triangles, CSS shapes, triangle design tool, CSS generator, triangle layouts, web design tools',
};

  
export default function TriangleGenerator() {
  return <TriangleGeneratorClient />;
}