import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faTools, faLock, faCogs, faFileCode, faDatabase } from '@fortawesome/free-solid-svg-icons';

const codingTools = [
  { name: 'Code to Image Converter', href: '/tools/coding/code-to-image-converter', icon: faCode },
  { name: 'URL Slug Generator', href: '/tools/coding/url-slug-generator', icon: faTools },
  { name: 'React Native Shadow Generator', href: '/tools/coding/react-native-shadow-generator', icon: faCogs },
  { name: 'Base64 Encoder/Decoder', href: '/tools/coding/base64-encoder-decoder', icon: faCode },
  { name: 'HTML Encoder/Decoder', href: '/tools/coding/html-encoder-decoder', icon: faFileCode },
  { name: 'URL Encoder/Decoder', href: '/tools/coding/url-encoder-decoder', icon: faTools },
  { name: 'HTML Minifier', href: '/tools/coding/html-minifier', icon: faCode },
  { name: 'CSS Minifier', href: '/tools/coding/css-minifier', icon: faCode },
  { name: 'JavaScript Minifier', href: '/tools/coding/javascript-minifier', icon: faCode },
  { name: 'HTML Formatter', href: '/tools/coding/html-formatter', icon: faFileCode },
  { name: 'CSS Formatter', href: '/tools/coding/css-formatter', icon: faFileCode },
  { name: 'JavaScript Formatter', href: '/tools/coding/javascript-formatter', icon: faFileCode },
  { name: 'MD5 Generator and Verifier', href: '/tools/coding/md5-encrypt-verify', icon: faLock },
  { name: 'SHA1 Encrypt and Verifier', href: '/tools/coding/sha1-encrypt-verify', icon: faLock },
  { name: 'SHA224 Encrypt and Verifier', href: '/tools/coding/sha224-encrypt-verify', icon: faLock },
  { name: 'SHA256 Encrypt and Verifier', href: '/tools/coding/sha256-encrypt-verify', icon: faLock },
  { name: 'SHA384 Encrypt and Verifier', href: '/tools/coding/sha384-encrypt-verify', icon: faLock },
  { name: 'SHA512 Encrypt and Verifier', href: '/tools/coding/sha512-encrypt-verify', icon: faLock },
  { name: 'JWT Encoder/Decoder', href: '/tools/coding/jwt-encoder-decoder', icon: faLock },
  { name: 'Advance JSON Tree Viewer', href: '/tools/coding/json-tree-viewer', icon: faDatabase },
];

export default function CodingToolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Coding Tools Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {codingTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <FontAwesomeIcon icon={tool.icon} className="text-2xl text-blue-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
                <p className="text-gray-400 mb-4">Use the {tool.name.toLowerCase()} tool to enhance your coding workflow.</p>
              </div>
              <span className="text-blue-400 font-semibold hover:text-blue-300 inline-flex items-center mt-2">
                Try it now
                <ChevronRight size={20} className="ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
