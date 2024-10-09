import { Metadata } from 'next';
import TextToAsciiClient from './TextToAsciiClient';

export const metadata: Metadata = {
    title: 'Text to ASCII/Hex/Binary Converter | WebToolsCenter',
    description: 'Convert plain text into ASCII, hexadecimal, and binary representations with our Text to ASCII/Hex/Binary Converter. Perfect for data encoding, cryptography, and learning about text encoding in computers.',
    keywords: 'text to ascii, text to hex, text to binary, ascii converter, hex converter, binary converter, data encoding, cryptography, text encoding, copy ascii, copy hex, copy binary',
};

   

export default function TextToAsciiHexBinary() {
  return <TextToAsciiClient />;
}