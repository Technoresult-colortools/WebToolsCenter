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
};

export default function HTMLFormatter() {
  return <HtmlFormatterClient />;
}
