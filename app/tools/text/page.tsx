import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faTextWidth, faListOl, faTextHeight, faSpellCheck, faTrash, faFont } from '@fortawesome/free-solid-svg-icons';

const textTools = [
  { name: 'Case Converter', href: '/tools/text/case-converter', icon: faTextWidth },
  { name: 'Letter Counter', href: '/tools/text/letter-counter', icon: faListOl },
  { name: 'Lorem Ipsum Generator', href: '/tools/text/lorem-ipsum-generator', icon: faFileAlt },
  { name: 'Words Counter', href: '/tools/text/words-counter', icon: faTextHeight },
  { name: 'Whitespace Remover', href: '/tools/text/whitespace-remover', icon: faTrash },
  { name: 'Google Fonts Pair Finder', href: '/tools/text/google-fonts-pair-finder', icon: faFont },
  { name: 'Text Reverser', href: '/tools/text/text-reverser', icon: faSpellCheck },
  { name: 'Character Frequency Counter', href: '/tools/text/character-frequency-counter', icon: faListOl },
  { name: 'Text to ASCII/Hex/Binary Converter', href: '/tools/text/text-to-ascii-hex-binary', icon: faTextWidth },
  { name: 'Title Case Converter', href: '/tools/text/title-case-converter', icon: faTextHeight },
  { name: 'Duplicate Line Remover', href: '/tools/text/duplicate-line-remover', icon: faTrash },
  { name: 'HTML Encoder/Decoder', href: '/tools/text/html-encoder-decoder', icon: faFileAlt },
  { name: 'Markdown to HTML Converter', href: '/tools/text/markdown-to-html', icon: faFileAlt },
  { name: 'Word Scrambler', href: '/tools/text/word-scrambler', icon: faSpellCheck },
];

export default function TextToolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Text Tools Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {textTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <FontAwesomeIcon icon={tool.icon} className="text-2xl text-blue-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
                <p className="text-gray-400 mb-4">Use the {tool.name.toLowerCase()} tool to simplify your text workflow.</p>
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
