'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Sparkles, Star } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faTools, faLock, faCogs, faFileCode, faDatabase } from '@fortawesome/free-solid-svg-icons';

const codingTools = [
  { name: 'Code to Image Converter', href: '/tools/coding/code-to-image-converter', icon: faCode, description: 'Convert code snippets into visually appealing images.', gradient: 'from-blue-500 to-green-500' },
  { name: 'URL Slug Generator', href: '/tools/coding/url-slug-generator', icon: faTools, description: 'Generate SEO-friendly slugs for your URLs effortlessly.', gradient: 'from-purple-500 to-pink-500' },
  { name: 'React Native Shadow Generator', href: '/tools/coding/react-native-shadow-generator', icon: faCogs, description: 'Easily create custom shadow effects for React Native components.', gradient: 'from-yellow-500 to-orange-500' },
  { name: 'Base64 Encoder/Decoder', href: '/tools/coding/base64-encoder-decoder', icon: faCode, description: 'Encode and decode data to and from Base64 format.', gradient: 'from-green-500 to-teal-500' },
  { name: 'HTML Encoder/Decoder', href: '/tools/coding/html-encoder-decoder', icon: faFileCode, description: 'Encode and decode HTML entities for web use.', gradient: 'from-blue-500 to-indigo-500' },
  { name: 'URL Encoder/Decoder', href: '/tools/coding/url-encoder-decoder', icon: faTools, description: 'Transform URLs into safe formats and back.', gradient: 'from-purple-400 to-purple-600' },
  { name: 'HTML Minifier', href: '/tools/coding/html-minifier', icon: faCode, description: 'Reduce HTML file size by minifying the code.', gradient: 'from-red-500 to-yellow-500' },
  { name: 'CSS Minifier', href: '/tools/coding/css-minifier', icon: faCode, description: 'Minify CSS code for faster loading times.', gradient: 'from-teal-500 to-green-500' },
  { name: 'JavaScript Minifier', href: '/tools/coding/javascript-minifier', icon: faCode, description: 'Minify JavaScript code to improve performance.', gradient: 'from-indigo-500 to-purple-500' },
  { name: 'HTML Formatter', href: '/tools/coding/html-formatter', icon: faFileCode, description: 'Format and beautify HTML code for better readability.', gradient: 'from-orange-500 to-red-500' },
  { name: 'CSS Formatter', href: '/tools/coding/css-formatter', icon: faFileCode, description: 'Beautify your CSS code to enhance maintainability.', gradient: 'from-pink-500 to-red-500' },
  { name: 'JavaScript Formatter', href: '/tools/coding/javascript-formatter', icon: faFileCode, description: 'Clean up your JavaScript code for clarity and style.', gradient: 'from-green-500 to-teal-500' },
  { name: 'MD5 Generator and Verifier', href: '/tools/coding/md5-encrypt-verify', icon: faLock, description: 'Generate and verify MD5 hashes for data integrity.', gradient: 'from-blue-400 to-blue-600' },
  { name: 'SHA1 Encrypt and Verifier', href: '/tools/coding/sha1-encrypt-verify', icon: faLock, description: 'Encrypt and verify data with SHA1 hashing.', gradient: 'from-red-400 to-red-600' },
  { name: 'SHA224 Encrypt and Verifier', href: '/tools/coding/sha224-encrypt-verify', icon: faLock, description: 'Use SHA224 for secure hashing and verification.', gradient: 'from-purple-400 to-purple-600' },
  { name: 'SHA256 Encrypt and Verifier', href: '/tools/coding/sha256-encrypt-verify', icon: faLock, description: 'Securely hash and verify with SHA256 algorithm.', gradient: 'from-green-400 to-green-600' },
  { name: 'SHA384 Encrypt and Verifier', href: '/tools/coding/sha384-encrypt-verify', icon: faLock, description: 'Utilize SHA384 for advanced data security.', gradient: 'from-blue-500 to-purple-500' },
  { name: 'SHA512 Encrypt and Verifier', href: '/tools/coding/sha512-encrypt-verify', icon: faLock, description: 'Achieve robust security with SHA512 hashing.', gradient: 'from-orange-500 to-red-500' },
  { name: 'JWT Encoder/Decoder', href: '/tools/coding/jwt-encoder-decoder', icon: faLock, description: 'Encode and decode JSON Web Tokens for authentication.', gradient: 'from-teal-500 to-green-500' },
  { name: 'Advance JSON Tree Viewer', href: '/tools/coding/json-tree-viewer', icon: faDatabase, description: 'Visualize and navigate complex JSON structures easily.', gradient: 'from-purple-500 to-blue-500' },
];


export default function CategoriesPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10" />
        <div 
          className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Coding <span className="text-blue-400">Tools</span> Collection
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Handy coding tools for designers and developers alike.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {codingTools.map((tool, index) => (
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
                    {tool.description}
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
              Need a Custom Coding Tool?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Can't find the tool you're looking for? Let us know and we'll create it for you!
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
