import { Metadata } from 'next';
import HtmlEncoderDecoderClient from './HtmlEncoderDecoderClient';

export const metadata: Metadata = {
    title: 'HTML Encoder/Decoder | WebToolsCenter',
    description: 'Easily convert text between plain text and HTML-encoded formats with our HTML Encoder/Decoder tool. Supports options like preserving newlines, encoding quotes, and handling non-ASCII characters for precise control.',
    keywords: 'html encoder, html decoder, encode text, decode text, html entities, encode non-ascii, web development tools, content encoding, text processing, online html tools',
};


export default function HTMLEncoderDecoder() {
  return <HtmlEncoderDecoderClient />;
}