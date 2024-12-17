import { Metadata } from 'next';
import Md5EncryptClient from './Md5EncryptClient';

export const metadata: Metadata = {
    title: 'MD5 Hash Generator | WebToolsCenter',
    description: 'Generate and verify MD5 hashes with the MD5 Hash Generator. Quickly create hashes from text or files, compare them, and ensure data integrity with this easy-to-use tool.',
    keywords: 'MD5 hash generator, MD5 tool, MD5 verification, generate MD5 hash, MD5 file hash, hash comparison, text to MD5, verify hash integrity, MD5 checksum tool',
    openGraph: {
        title: 'MD5 Hash Generator | Generate and Verify Hashes | WebToolsCenter',
        description: 'Quickly generate or verify MD5 hashes from text or files with our easy-to-use MD5 Hash Generator. Ensure data integrity and security effortlessly.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/coding/md5-encrypt-verify',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MD5 Hash Generator | Secure and Verify',
        description: 'Easily generate and verify MD5 hashes from text or files. Ensure data integrity with our MD5 Hash Generator tool.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/coding/md5-encrypt-verify',
    },
};

export default function MD5Tool() {
    return <Md5EncryptClient />;
}
