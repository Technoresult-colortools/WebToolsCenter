import { Metadata } from 'next';
import JavaScriptMinifierClient from './JavaScriptMinifierClient';

export const metadata: Metadata = {
    title: 'JavaScript Minifier | WebToolsCenter',
    description: 'Optimize your JavaScript code with the JavaScript Minifier tool. Reduce file size by removing unnecessary characters and applying optimizations, improving load times and overall site performance.',
    keywords: 'JavaScript minifier, minify JavaScript, compress JavaScript, reduce file size, JavaScript file upload, Terser minification, web performance, optimize JavaScript code, remove whitespace from JavaScript, JavaScript optimization tool',
};
  
export default function JavaScriptMinifier() {
  return <JavaScriptMinifierClient />;
}