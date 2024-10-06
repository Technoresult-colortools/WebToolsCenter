import { Metadata } from 'next';
import Sha224EncryptClient from './Sha224EncryptClient';

export const metadata: Metadata = {
    title: 'SHA-224 Encrypt Verifier | WebToolsCenter',
    description: 'Generate and verify SHA-224 hashes for text and files using the SHA-224 Encrypt Verifier. Supports multiple input formats, clipboard integration, and easy hash verification.',
    keywords: 'SHA-224 encrypt, SHA-224 hash, hash verifier, text to SHA-224, file hashing, SHA-224 tool, hash generator, hash verification, cryptography, data integrity',
};

  
export default function SHA224EncryptVerify() {
  return <Sha224EncryptClient />;
}