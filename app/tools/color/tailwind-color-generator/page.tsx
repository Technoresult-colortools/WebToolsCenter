import { Metadata } from 'next';
import TailWindColorClient from './TailWindColorClient';

export const metadata: Metadata = {
    title: 'Tailwind Color Generator | WebToolsCenter',
    description: 'Discover and explore the full Tailwind CSS color palette with our Tailwind Color Generator. Easily search, filter, and copy color class names and hex codes for your projects.',
    keywords: 'tailwind color generator, tailwind css colors, color palette tool, hex code copy, tailwind class names, web design tools, color filter, responsive design, CSS tools',
  };
  

export default function TailwindColorGenerator() {
  return <TailWindColorClient />;
}