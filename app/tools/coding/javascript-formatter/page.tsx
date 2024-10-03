import { Metadata } from 'next';
import JavaScriptFormatterClient from './JavaScriptFormatterClient';

export const metadata: Metadata = {
    title: 'JavaScript Formatter | WebToolsCenter',
    description: 'Clean and standardize your JavaScript code with the JavaScript Formatter. Customize indentation, quotes, semicolons, and more for consistent, readable output.',
    keywords: 'JavaScript formatter, format JavaScript, JS code cleaner, JS code formatting, JavaScript beautifier, clean JavaScript code, code formatting tool, web development tool, JS code standardization',
};
  
export default function JavaScriptFormatter() {
  return <JavaScriptFormatterClient />;
}