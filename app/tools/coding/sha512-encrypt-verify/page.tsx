import { Metadata } from 'next';
import Sha512EncryptClient from './Sha512EncryptClient';

export const metadata: Metadata = {
    title: 'SHA-512 Encrypt Verifier | WebToolsCenter',
    description: 'Generate and verify SHA-512 hashes for text and files using the SHA-512 Encrypt Verifier. Supports secure hashing, multiple input formats, and clipboard integration for fast and easy verification.',
    keywords: 'SHA-512 encrypt, SHA-512 hash, hash verifier, text to SHA-512, file hashing, SHA-512 tool, hash generator, hash comparison, SHA-512 encryption, secure hash function, SHA-2',
};

  
export default function SHA512EncryptVerify() {
  return <Sha512EncryptClient />;
}