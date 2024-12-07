import { Metadata } from 'next';
import ClipPathGeneratorClient from './ClipPathGeneratorClient';

export const metadata: Metadata = {
    title: 'Clip Path Generator | WebToolsCenter',
    description: 'Easily create custom clip-path shapes with this visual generator. Adjust shape, size, opacity, and more, then copy the generated CSS for your designs.',
    keywords: 'Clip path generator, CSS clip-path, custom shapes, clip-path tool, interactive shape adjustment, CSS generator, clip path preview, web design tools',
    openGraph: {
        title: 'Clip Path Generator | Design Custom Shapes | WebToolsCenter',
        description: 'Create and customize CSS clip-path shapes with ease. Adjust properties visually, preview changes, and copy the CSS for your web design projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/clip-path-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Clip Path Generator | Visual CSS Design Tool',
        description: 'Easily design and customize CSS clip-path shapes. Adjust shape settings, preview results, and copy CSS for your creative projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/clip-path-generator',
    },
};

export default function ClipPathGenerator() {
    return <ClipPathGeneratorClient />;
}
