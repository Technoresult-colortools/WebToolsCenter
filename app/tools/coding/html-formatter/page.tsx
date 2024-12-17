import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const HtmlFormatterClient = dynamic(
  () => import('./HtmlFormatterClient'),
  { ssr: false }
);

export const metadata: Metadata = {
    title: 'HTML Formatter | WebToolsCenter',
    description: 'Format and clean your HTML code with the HTML Formatter tool powered by Prettier. Ensure consistent, readable HTML output with customizable options for indentation and quotes.',
    keywords: 'HTML formatter, format HTML, Prettier HTML, clean HTML, HTML code formatting, HTML beautifier, consistent HTML output, HTML code standardization, web development tool, HTML code cleaner',
    openGraph: {
        title: 'HTML Formatter | Beautify HTML Code | WebToolsCenter',
        description: 'Effortlessly format and clean your HTML code with the HTML Formatter. Powered by Prettier, it ensures consistent and readable HTML output.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/coding/html-formatter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HTML Formatter | Beautify HTML Code Online',
        description: 'Clean and format your HTML code with our HTML Formatter. Ensure consistent and readable output for web development projects.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/coding/html-formatter',
    },
};

export default function HTMLFormatter() {
    return <HtmlFormatterClient />;
}
