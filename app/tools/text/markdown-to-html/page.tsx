import { Metadata } from 'next';
import MarkdownToHtmlClient from './MarkdownToHtmlClient';

export const metadata: Metadata = {
    title: 'Markdown to HTML Converter | WebToolsCenter',
    description: 'Transform your Markdown content into clean, properly formatted HTML with our powerful Markdown to HTML Converter. Ideal for developers, writers, and content creators.',
    keywords: 'markdown to html converter, markdown, html converter, content creation, syntax highlighting, output sanitization, web development',
  };   

export default function MarkdownToHTMLConverter() {
  return <MarkdownToHtmlClient />;
}