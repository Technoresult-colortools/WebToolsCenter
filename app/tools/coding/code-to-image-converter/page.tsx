import { Metadata } from 'next';
import CodeToImageClient from './CodeToImageClient';

export const metadata: Metadata = {
    title: 'Code to Image Converter | WebToolsCenter',
    description: 'Convert your code snippets into beautifully styled, shareable images with the Code to Image Converter. Perfect for developers to showcase their code with syntax highlighting, themes, and custom layouts.',
    keywords: 'code to image, code image converter, convert code to image, code to png, syntax highlighting images, code sharing, code snippet images, watermark code images, programming code images, code image editor',
    openGraph: {
        title: 'Code to Image Converter | Share Beautiful Code Snippets | WebToolsCenter',
        description: 'Convert code snippets into stylish, shareable images with syntax highlighting and custom themes using the Code to Image Converter.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/coding/code-to-image-converter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Code to Image Converter | Stylish Code Sharing',
        description: 'Turn your code into beautifully styled images with the Code to Image Converter. Perfect for developers and educators.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/coding/code-to-image-converter',
    },
};

export default function CodeToImageConverter() {
    return <CodeToImageClient />;
}
