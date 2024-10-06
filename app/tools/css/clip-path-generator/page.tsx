import { Metadata } from 'next';
import ClipPathGeneratorClient from './ClipPathGeneratorClient';

export const metadata: Metadata = {
    title: 'Clip Path Generator | WebToolsCenter',
    description: 'Easily create custom clip-path shapes with this visual generator. Adjust shape, size, opacity, and more, then copy the generated CSS for your designs.',
    keywords: 'Clip path generator, CSS clip-path, custom shapes, clip-path tool, interactive shape adjustment, CSS generator, clip path preview, web design tools',
};

  
export default function ClipPathGenerator() {
  return <ClipPathGeneratorClient />;
}