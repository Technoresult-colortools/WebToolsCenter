import { Metadata } from 'next';
import Sha1EncryptClient from './Sha1EncryptClient';

export const metadata: Metadata = {
    title: 'SHA-1 Encrypt Verifier | WebToolsCenter',
    description: 'Generate and verify SHA-1 hashes for text and files using the SHA-1 Encrypt Verifier. Supports multiple input formats, hash iterations, and clipboard integration for fast and easy hashing.',
    keywords: 'SHA-1 encrypt, SHA-1 hash, hash verifier, text to SHA-1, file hashing, SHA-1 tool, hash generator, hash comparison, SHA-1 encryption, hash iteration, case-sensitive hash',
};

  
export default function SHA1Tool() {
  return <Sha1EncryptClient />;
}