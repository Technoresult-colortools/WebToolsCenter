import { Metadata } from 'next';
import CSSMinifierClient from './CSSMinifierClient';

export const metadata: Metadata = {
    title: 'CSS Minifier | WebToolsCenter',
    description: 'Minify your CSS stylesheets with the CSS Minifier tool. Remove unnecessary characters, reduce file size, and improve site performance by optimizing your CSS code for faster load times.',
    keywords: 'CSS minifier, CSS optimization, minify CSS, compress CSS, reduce file size, CSS file upload, remove whitespace from CSS, CSS compression tool, web performance, Toptal CSS Minifier API',
    openGraph: {
        title: 'CSS Minifier | Optimize CSS for Performance | WebToolsCenter',
        description: 'Efficiently minify your CSS files with our CSS Minifier. Reduce file size, remove unnecessary characters, and enhance website performance.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/coding/css-minifier',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CSS Minifier | Compress CSS for Faster Websites',
        description: 'Minimize your CSS code with our CSS Minifier. Improve site speed and performance by reducing unnecessary characters and file size.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/coding/css-minifier',
    },
};

export default function CSSMinifier() {
    return <CSSMinifierClient />;
}
