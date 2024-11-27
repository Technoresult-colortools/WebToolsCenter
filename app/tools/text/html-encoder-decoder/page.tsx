import { Metadata } from 'next';
import HtmlEncoderDecoderClient from './HtmlEncoderDecoderClient';

export const metadata: Metadata = {
    title: 'HTML Encoder/Decoder | Encode & Decode Text | WebToolsCenter',
    description: 'Easily convert text between plain text and HTML-encoded formats with advanced options like preserving newlines, encoding quotes, and handling non-ASCII characters for precise control.',
    keywords: 'html encoder, html decoder, encode text, decode text, html entities, encode non-ascii, web development tools, content encoding, text processing, online html tools',
    openGraph: {
        title: 'HTML Encoder/Decoder | Convert Text to HTML Format',
        description: 'Transform text into HTML-encoded or decoded formats with ease. Use advanced options like handling non-ASCII characters, encoding quotes, and preserving newlines.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/html-encoder-decoder',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HTML Encoder/Decoder | Convert Text Formats Online',
        description: 'Effortlessly encode or decode text to and from HTML format. Perfect for developers needing precision in content handling.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/html-encoder-decoder',
    }
};

export default function HTMLEncoderDecoder() {
    return <HtmlEncoderDecoderClient />;
}
