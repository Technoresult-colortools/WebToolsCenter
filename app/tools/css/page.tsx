'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Sparkles, Star } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faPaintBrush, faShapes, faBox, faBorderAll } from '@fortawesome/free-solid-svg-icons';

const cssTools = [
  { 
    name: 'CSS Clip Path Generator', 
    href: '/tools/css/clip-path-generator', 
    icon: faShapes, 
    description: 'Create complex shapes with CSS clip-path property.', 
    gradient: 'from-red-500 to-yellow-500' 
  },
  { 
    name: 'CSS Loader Generator', 
    href: '/tools/css/loader-generator', 
    icon: faCode, 
    description: 'Generate CSS spinners and loaders for your website.', 
    gradient: 'from-blue-500 to-purple-500' 
  },
  { 
    name: 'CSS Background Pattern Generator', 
    href: '/tools/css/background-pattern-generator', 
    icon: faPaintBrush, 
    description: 'Create stunning background patterns for your web pages.', 
    gradient: 'from-green-500 to-teal-500' 
  },
  { 
    name: 'CSS Cubic Bezier Generator', 
    href: '/tools/css/cubic-bezier-generator', 
    icon: faCode, 
    description: 'Generate custom cubic-bezier transitions with ease.', 
    gradient: 'from-purple-500 to-pink-500' 
  },
  { 
    name: 'CSS Glassmorphism Generator', 
    href: '/tools/css/glassmorphism-generator', 
    icon: faBox, 
    description: 'Create glass-like UI elements with this tool.', 
    gradient: 'from-yellow-500 to-orange-500' 
  },
  { 
    name: 'CSS Text Glitch Effect Generator', 
    href: '/tools/css/text-glitch-effect-generator', 
    icon: faBorderAll, 
    description: 'Add a glitch effect to text for modern designs.', 
    gradient: 'from-indigo-500 to-blue-500' 
  },
  { 
    name: 'CSS Gradient Generator', 
    href: '/tools/css/gradient-generator', 
    icon: faPaintBrush, 
    description: 'Create smooth and visually appealing gradients.', 
    gradient: 'from-blue-500 to-teal-500' 
  },
  { 
    name: 'CSS Triangle Generator', 
    href: '/tools/css/triangle-generator', 
    icon: faShapes, 
    description: 'Easily generate triangles with CSS.', 
    gradient: 'from-pink-500 to-purple-500' 
  },
  { 
    name: 'CSS Box Shadow Generator', 
    href: '/tools/css/box-shadow-generator', 
    icon: faCode, 
    description: 'Create custom box shadow effects for your elements.', 
    gradient: 'from-red-500 to-purple-500' 
  },
  { 
    name: 'CSS Border Radius Generator', 
    href: '/tools/css/border-radius-generator', 
    icon: faBox, 
    description: 'Generate custom border-radius values for smooth corners.', 
    gradient: 'from-teal-500 to-green-500' 
  },
  { 
    name: 'CSS FlexBox Generator', 
    href: '/tools/css/flexbox-generator', 
    icon: faBox, 
    description: 'Easily create layouts using CSS Flexbox.', 
    gradient: 'from-indigo-500 to-blue-500' 
  },
];

export default function CSSToolsPage() {
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
            CSS <span className="text-blue-400">Tools</span> Collection
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Handy CSS generators for better styling and layouts.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cssTools.map((tool, index) => (
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
              Need a Custom CSS Tool?
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
