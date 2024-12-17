import { Metadata } from 'next';
import Sha256EncryptClient from './Sha256EncryptClient';

export const metadata: Metadata = {
    title: 'SHA-256 Encrypt Verifier | WebToolsCenter',
    description: 'Generate and verify SHA-256 hashes for text and files using the SHA-256 Encrypt Verifier. Supports input encoding options, secure hashing, and clipboard integration for fast and easy verification.',
    keywords: 'SHA-256 encrypt, SHA-256 hash, hash verifier, text to SHA-256, file hashing, SHA-256 tool, hash generator, hash comparison, SHA-256 encryption, secure hash function',
    openGraph: {
        title: 'SHA-256 Encrypt Verifier | WebToolsCenter',
        description: 'Quickly generate and verify SHA-256 hashes for text and files with secure hashing and input encoding options.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/coding/sha256-encrypt-verify',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SHA-256 Encrypt Verifier | WebToolsCenter',
        description: 'Generate and verify SHA-256 hashes for secure data integrity and hashing needs.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/coding/sha256-encrypt-verify',
    },
};

export default function SHA256EncryptVerify() {
    return <Sha256EncryptClient />;
}
