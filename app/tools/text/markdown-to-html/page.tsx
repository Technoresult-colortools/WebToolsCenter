import { Metadata } from 'next';
import MarkdownToHtmlClient from './MarkdownToHtmlClient';

export const metadata: Metadata = {
    title: 'Markdown to HTML Converter | WebToolsCenter',
    description: 'Transform your Markdown content into clean, properly formatted HTML with our powerful Markdown to HTML Converter. Ideal for developers, writers, and content creators.',
    keywords: 'markdown to html converter, markdown, html converter, content creation, syntax highlighting, output sanitization, web development',
    openGraph: {
        title: 'Markdown to HTML Converter',
        description: 'Transform your Markdown content into clean, properly formatted HTML. Perfect for developers, writers, and content creators.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/markdown-to-html',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Markdown to HTML Converter | WebToolsCenter',
        description: 'Convert your Markdown to HTML with ease using our feature-rich Markdown to HTML Converter. Ideal for developers, writers, and content creators.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/markdown-to-html',
    },
};

export default function MarkdownConverter() {
    return <MarkdownToHtmlClient />;
}
