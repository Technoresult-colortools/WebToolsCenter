import { Metadata } from 'next';
import Md5EncryptClient from './Md5EncryptClient';

export const metadata: Metadata = {
    title: 'MD5 Hash Generator | WebToolsCenter',
    description: 'Generate and verify MD5 hashes with the MD5 Hash Generator. Quickly create hashes from text or files, compare them, and ensure data integrity with this easy-to-use tool.',
    keywords: 'MD5 hash generator, MD5 tool, MD5 verification, generate MD5 hash, MD5 file hash, hash comparison, text to MD5, verify hash integrity, MD5 checksum tool',
};
  
export default function MD5Tool() {
  return <Md5EncryptClient />;
}