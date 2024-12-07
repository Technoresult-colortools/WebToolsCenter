import { Metadata } from 'next';
import TriangleGeneratorClient from './TriangleGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Triangle Generator | WebToolsCenter',
    description: 'Easily generate customizable CSS triangles with the CSS Triangle Generator. Adjust triangle direction, size, color, and rotation to fit your design. Perfect for web designers and developers looking to create decorative elements using pure CSS.',
    keywords: 'CSS triangle generator, triangle shapes in CSS, customizable CSS triangles, CSS shapes, triangle design tool, CSS generator, triangle layouts, web design tools',
    openGraph: {
        title: 'CSS Triangle Generator | Create Custom CSS Triangles',
        description: 'Generate customizable CSS triangles with adjustable direction, size, color, and rotation. Perfect for creating decorative web elements with pure CSS.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/css/triangle-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CSS Triangle Generator | WebToolsCenter',
        description: 'Create CSS triangles effortlessly with our Triangle Generator. Customize direction, size, and color, and get the CSS instantly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/css/triangle-generator',
    },
};

export default function CSSTriangleGenerator() {
    return <TriangleGeneratorClient />;
}
