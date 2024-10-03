import { Metadata } from 'next';
import UrlEncoderClient from './UrlEncoderClient';

export const metadata: Metadata = {
    title: 'URL Encoder/Decoder | WebToolsCenter',
    description: 'Effortlessly encode or decode URLs with the URL Encoder/Decoder tool. Supports bulk processing, file uploads, and offers customizable encoding modes for secure and valid URL management.',
    keywords: 'URL encoder, URL decoder, encode URL, decode URL, bulk URL processing, file upload URL encode, file upload URL decode, URL validation, encode special characters, URL optimization tool',
};

  
export default function URLEncoderDecoder() {
  return <UrlEncoderClient />;
}