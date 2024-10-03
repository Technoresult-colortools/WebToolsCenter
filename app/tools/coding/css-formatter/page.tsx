import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const CssFormatterClient = dynamic(
  () => import('./CssFormatterClient'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'CSS Formatter | WebToolsCenter',
  description: 'Clean and standardize your CSS code with the CSS Formatter powered by Prettier. Ensure consistent, readable stylesheets with options for indentation, quotes, and property sorting.',
  keywords: 'CSS formatter, format CSS, Prettier CSS, clean CSS, CSS code formatting, CSS beautifier, consistent CSS output, CSS code standardization, web development tool, CSS code cleaner',
};

export default function CSSMinifier() {
  return <CssFormatterClient />;
}
