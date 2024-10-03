import { Metadata } from 'next';
import Base64EncodeClient from './Base64EncodeClient';

export const metadata: Metadata = {
    title: 'Base64 Encoder/Decoder | WebToolsCenter',
    description: 'Easily encode or decode text and files using Base64 Encoder/Decoder. Supports real-time text conversion, file uploads, and clipboard copying for quick and efficient processing.',
    keywords: 'Base64 encoder, Base64 decoder, binary to text, text to Base64, encode Base64, decode Base64, file to Base64, Base64 converter, Base64 tool, encode binary data',
};
  
export default function Base64EncoderDecoder() {
  return <Base64EncodeClient />;
}