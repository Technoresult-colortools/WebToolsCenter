import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faPaintBrush, faShapes, faBox, faBorderAll } from '@fortawesome/free-solid-svg-icons';

const cssTools = [
  { name: 'CSS Clip Path Generator', href: '/tools/css/clip-path-generator', icon: faShapes },
  { name: 'CSS Loader Generator', href: '/tools/css/loader-generator', icon: faCode },
  { name: 'CSS Background Pattern Generator', href: '/tools/css/background-pattern-generator', icon: faPaintBrush },
  { name: 'CSS Cubic Bezier Generator', href: '/tools/css/cubic-bezier-generator', icon: faCode },
  { name: 'CSS Glassmorphism Generator', href: '/tools/css/glassmorphism-generator', icon: faBox },
  { name: 'CSS Text Glitch Effect Generator', href: '/tools/css/text-glitch-effect-generator', icon: faBorderAll },
  { name: 'CSS Gradient Generator', href: '/tools/css/gradient-generator', icon: faPaintBrush },
  { name: 'CSS Triangle Generator', href: '/tools/css/triangle-generator', icon: faShapes },
  { name: 'CSS Box Shadow Generator', href: '/tools/css/box-shadow-generator', icon: faCode },
  { name: 'CSS Border Radius Generator', href: '/tools/css/border-radius-generator', icon: faBox },
  { name: 'CSS FlexBox Generator', href: '/tools/css/flexbox-generator', icon: faBox },
];

export default function CSSToolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CSS Tools Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cssTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <FontAwesomeIcon icon={tool.icon} className="text-2xl text-blue-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
                <p className="text-gray-400 mb-4">Use the {tool.name.toLowerCase()} tool to enhance your CSS styling.</p>
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
