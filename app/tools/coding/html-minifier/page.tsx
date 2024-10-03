import { Metadata } from 'next';
import HtmlMinifierClient from './HtmlMinifierClient';

export const metadata: Metadata = {
    title: 'HTML Minifier | WebToolsCenter',
    description: 'Optimize your HTML code by minifying it with the HTML Minifier tool. Remove unnecessary characters, adjust aggressiveness, and improve your website’s performance with smaller file sizes.',
    keywords: 'HTML minifier, HTML optimizer, minify HTML, compress HTML, remove whitespace, reduce file size, web performance optimization, HTML compression tool, HTML file upload minification, minified HTML',
};
  
export default function HTMLMinifier() {
  return <HtmlMinifierClient />;
}