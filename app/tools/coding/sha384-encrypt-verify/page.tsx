import { Metadata } from 'next';
import Sha384EncryptClient from './Sha384EncryptClient';

export const metadata: Metadata = {
    title: 'SHA-384 Encrypt Verifier | WebToolsCenter',
    description: 'Generate and verify SHA-384 hashes for text and files using the SHA-384 Encrypt Verifier. Supports secure hashing, multiple input formats, and clipboard integration for fast and easy verification.',
    keywords: 'SHA-384 encrypt, SHA-384 hash, hash verifier, text to SHA-384, file hashing, SHA-384 tool, hash generator, hash comparison, SHA-384 encryption, secure hash function, SHA-2',
};

  
export default function SHA384EncryptVerify() {
  return <Sha384EncryptClient />;
}