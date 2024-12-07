import { Metadata } from 'next';
import BoxRadiusGeneratorClient from './BoxRadiusGeneratorClient';

export const metadata: Metadata = {
    title: 'Border Radius Generator | WebToolsCenter',
    description: 'Easily create and customize border radii for your UI elements. Adjust individual corners, link them for simultaneous changes, and preview in real-time. Copy the generated CSS code with ease for your web projects.',
    keywords: 'border radius generator, customizable border radius, UI design tool, CSS border radius, pixel and percentage units, responsive design, real-time preview',
    openGraph: {
        title: 'Border Radius Generator | Customize Corners | WebToolsCenter',
        description: 'Design and customize border radii for UI elements with ease. Adjust corners, preview in real-time, and copy the CSS code for your projects.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/border-radius-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Border Radius Generator | UI Design Tool',
        description: 'Create and customize border radii with the Border Radius Generator. Preview changes in real-time and copy the CSS for your web projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/border-radius-generator',
    },
};

export default function BorderRadiusGenerator() {
    return <BoxRadiusGeneratorClient />;
}
