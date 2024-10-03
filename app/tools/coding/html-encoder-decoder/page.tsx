import { Metadata } from 'next';
import HtmlEncodeClient from './HtmlEncodeClient';

export const metadata: Metadata = {
    title: 'HTML Encoder/Decoder | WebToolsCenter',
    description: 'Easily encode or decode HTML special characters and entities with the HTML Encoder/Decoder. Protect your web content from errors and security vulnerabilities like XSS.',
    keywords: 'HTML encoder, HTML decoder, HTML special characters, encode HTML, decode HTML, HTML entities, HTML conversion tool, XSS prevention, HTML security, web encoding tool',
};
  
export default function HTMLEncoderDecoder() {
  return <HtmlEncodeClient />;
}