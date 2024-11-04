'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, CogIcon, Star } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faTextWidth, faListOl, faTextHeight, faSpellCheck, faTrash, faFont, faSignature } from '@fortawesome/free-solid-svg-icons';

const textTools = [
  { 
    name: 'Case Converter', 
    href: '/tools/text/case-converter', 
    icon: faTextWidth,
    gradient: 'from-blue-500 to-indigo-500'
  },
  { 
    name: 'Letter Counter', 
    href: '/tools/text/letter-counter', 
    icon: faListOl,
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'Lorem Ipsum Generator', 
    href: '/tools/text/lorem-ipsum-generator', 
    icon: faFileAlt,
    gradient: 'from-green-500 to-teal-500'
  },
  { 
    name: 'Words Counter', 
    href: '/tools/text/words-counter', 
    icon: faTextHeight,
    gradient: 'from-yellow-500 to-orange-500'
  },
  { 
    name: 'Whitespace Remover', 
    href: '/tools/text/whitespace-remover', 
    icon: faTrash,
    gradient: 'from-red-500 to-pink-500'
  },
  { 
    name: 'Google Fonts Pair Finder', 
    href: '/tools/text/google-fonts-pair-finder', 
    icon: faFont,
    gradient: 'from-blue-500 to-purple-500'
  },
  { 
    name: 'Text Reverser', 
    href: '/tools/text/text-reverser', 
    icon: faSpellCheck,
    gradient: 'from-indigo-500 to-blue-500'
  },
  { 
    name: 'Character Frequency Counter', 
    href: '/tools/text/character-frequency-counter', 
    icon: faListOl,
    gradient: 'from-purple-500 to-indigo-500'
  },
  { 
    name: 'Text to ASCII/Hex/Binary', 
    href: '/tools/text/text-to-ascii-hex-binary', 
    icon: faTextWidth,
    gradient: 'from-green-500 to-blue-500'
  },
  { 
    name: 'Title Case Converter', 
    href: '/tools/text/title-case-converter', 
    icon: faTextHeight,
    gradient: 'from-yellow-500 to-red-500'
  },
  { 
    name: 'Duplicate Line Remover', 
    href: '/tools/text/duplicate-line-remover', 
    icon: faTrash,
    gradient: 'from-blue-500 to-teal-500'
  },
  { 
    name: 'HTML Encoder/Decoder', 
    href: '/tools/text/html-encoder-decoder', 
    icon: faFileAlt,
    gradient: 'from-purple-500 to-orange-500'
  },
  { 
    name: 'Markdown to HTML', 
    href: '/tools/text/markdown-to-html', 
    icon: faFileAlt,
    gradient: 'from-indigo-500 to-pink-500'
  },
  { 
    name: 'Word Scrambler', 
    href: '/tools/text/word-scrambler', 
    icon: faSpellCheck,
    gradient: 'from-blue-500 to-purple-500'
  },
  { 
    name: 'Text to Handwriting Converter', 
    href: '/tools/text/text-to-handwriting', 
    icon: faSignature,
    gradient: 'from-yellow-500 to-red-500'
  },
];

export default function TextToolsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div 
          className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Text<span className="text-blue-400">Tools</span>Collection
            <span className="inline-block ml-3">
              <CogIcon className="w-10 h-10 text-blue-400 animate-spin-slow" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Powerful text manipulation tools to enhance your content creation workflow.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {textTools.map((tool, index) => (
            <Link
              key={tool.name}
              href={tool.href}
              className={`group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={tool.icon} className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Use the {tool.name.toLowerCase()} tool to simplify your text workflow.
                  </p>
                </div>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300">
                    Try it now
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center">
              <Star className="mr-3 text-yellow-400" />
              Need a Custom Text Tool?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Can't find the text manipulation tool you're looking for? Let us know and we'll build it!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity duration-300"
            >
              Request a Tool
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}