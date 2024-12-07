import { Metadata } from 'next';
import GradientGeneratorClient from './GradientGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Gradient Generator | WebToolsCenter',
    description: 'Design beautiful and customizable CSS gradients with ease. Choose between linear and radial gradients, preview in real-time, and copy the CSS for your web projects with just a click.',
    keywords: 'CSS gradient generator, customizable gradients, linear gradient, radial gradient, gradient backgrounds, gradient design tool, web design gradients',
    openGraph: {
        title: 'CSS Gradient Generator | Create Stunning Gradients',
        description: 'Design customizable CSS gradients, including linear and radial types. Preview in real-time and copy the CSS instantly for your web projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/gradient-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CSS Gradient Generator | WebToolsCenter',
        description: 'Create beautiful CSS gradients with our Gradient Generator. Customize linear or radial gradients, preview them live, and get the CSS instantly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/gradient-generator',
    },
};

export default function CSSGradientGenerator() {
    return <GradientGeneratorClient />;
}
