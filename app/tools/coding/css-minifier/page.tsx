import { Metadata } from 'next';
import CSSMinifierClient from './CSSMinifierClient';

export const metadata: Metadata = {
    title: 'CSS Minifier | WebToolsCenter',
    description: 'Minify your CSS stylesheets with the CSS Minifier tool. Remove unnecessary characters, reduce file size, and improve site performance by optimizing your CSS code for faster load times.',
    keywords: 'CSS minifier, CSS optimization, minify CSS, compress CSS, reduce file size, CSS file upload, remove whitespace from CSS, CSS compression tool, web performance, Toptal CSS Minifier API',
};

  
export default function CSSMinifier() {
  return <CSSMinifierClient />;
}