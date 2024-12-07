import { Metadata } from 'next';
import BoxShadowGeneratorClient from './BoxShadowGeneratorClient';

export const metadata: Metadata = {
    title: 'Box Shadow Generator | WebToolsCenter',
    description: 'Create customizable CSS box shadows with ease. Adjust offset, blur, spread, and color for each shadow, preview in real-time, and copy or download the generated CSS for your web projects.',
    keywords: 'box shadow generator, CSS box shadow, customizable box shadows, web design tools, shadow effects, real-time CSS preview, inset shadows, web design shadows',
    openGraph: {
        title: 'Box Shadow Generator | Design CSS Shadows | WebToolsCenter',
        description: 'Design and customize CSS box shadows with ease. Adjust settings, preview shadows in real-time, and copy the CSS for your web design projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/box-shadow-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Box Shadow Generator | CSS Design Tool',
        description: 'Create customizable CSS box shadows. Adjust settings like offset, blur, and color, preview in real-time, and copy CSS for your projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/box-shadow-generator',
    },
};

export default function BoxShadowGenerator() {
    return <BoxShadowGeneratorClient />;
}
