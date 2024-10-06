import { Metadata } from 'next';
import Sha256EncryptClient from './Sha256EncryptClient';

export const metadata: Metadata = {
    title: 'SHA-256 Encrypt Verifier | WebToolsCenter',
    description: 'Generate and verify SHA-256 hashes for text and files using the SHA-256 Encrypt Verifier. Supports input encoding options, secure hashing, and clipboard integration for fast and easy verification.',
    keywords: 'SHA-256 encrypt, SHA-256 hash, hash verifier, text to SHA-256, file hashing, SHA-256 tool, hash generator, hash comparison, SHA-256 encryption, secure hash function',
};

  
export default function SHA256EncryptVerify() {
  return <Sha256EncryptClient />;
}