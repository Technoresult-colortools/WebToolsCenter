import { Metadata } from 'next';
import TextToAsciiClient from './TextToAsciiClient';

export const metadata: Metadata = {
    title: 'Text to ASCII/Hex/Binary Converter | Encode Text Easily | WebToolsCenter',
    description: 'Convert plain text into ASCII, hexadecimal, and binary formats with our Text to ASCII/Hex/Binary Converter. Ideal for data encoding, cryptography, and understanding text representation in computers.',
    keywords: 'text to ascii, text to hex, text to binary, ascii converter, hex converter, binary converter, data encoding, cryptography, text encoding, copy ascii, copy hex, copy binary',
    openGraph: {
        title: 'Text to ASCII/Hex/Binary Converter | Data Encoding Tool',
        description: 'Easily transform plain text into ASCII, hexadecimal, and binary formats. Perfect for developers, cryptography enthusiasts, and those learning about data encoding.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/text-to-ascii-hex-binary',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Text to ASCII/Hex/Binary Converter | Convert Text Instantly',
        description: 'Quickly convert plain text into ASCII, hex, and binary formats with our easy-to-use converter. Learn and explore data encoding today!',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/text-to-ascii-hex-binary',
    }
};

export default function TextToAsciiHexBinary() {
    return <TextToAsciiClient />;
}
