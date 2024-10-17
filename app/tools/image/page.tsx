'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Sparkles, Star } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCropAlt,
  faFilter,
  faExpandArrowsAlt,
  faEyeDropper,
  faPalette,
  faTint,
  faShapes,
  faProjectDiagram,
  faSlash,
  faFileImage,
  faCode,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';

const imageTools = [
  { 
    name: 'Image Cropper', 
    href: '/tools/image/image-cropper', 
    icon: faCropAlt, 
    description: 'Easily crop and adjust image dimensions.', 
    gradient: 'from-red-500 to-yellow-500' 
  },
  { 
    name: 'Image Filters', 
    href: '/tools/image/image-filters', 
    icon: faFilter, 
    description: 'Apply filters to enhance your images.', 
    gradient: 'from-blue-500 to-purple-500' 
  },
  { 
    name: 'Image Resizer', 
    href: '/tools/image/image-resizer', 
    icon: faExpandArrowsAlt, 
    description: 'Resize images to fit any size requirement.', 
    gradient: 'from-green-500 to-teal-500' 
  },
  { 
    name: 'Image Average Color Finder', 
    href: '/tools/image/image-average-color-finder', 
    icon: faEyeDropper, 
    description: 'Find the average color of an image.', 
    gradient: 'from-purple-500 to-pink-500' 
  },
  { 
    name: 'Image Color Extractor', 
    href: '/tools/image/image-color-extractor', 
    icon: faPalette, 
    description: 'Extract dominant colors from an image.', 
    gradient: 'from-yellow-500 to-orange-500' 
  },
  { 
    name: 'Image Color Picker', 
    href: '/tools/image/image-color-picker', 
    icon: faTint, 
    description: 'Pick colors directly from an image.', 
    gradient: 'from-indigo-500 to-blue-500' 
  },
  { 
    name: 'SVG Blob Generator', 
    href: '/tools/image/svg-blob-generator', 
    icon: faShapes, 
    description: 'Generate unique SVG blobs for your design projects.', 
    gradient: 'from-blue-500 to-teal-500' 
  },
  { 
    name: 'SVG Pattern Generator', 
    href: '/tools/image/svg-pattern-generator', 
    icon: faProjectDiagram, 
    description: 'Create seamless SVG patterns effortlessly.', 
    gradient: 'from-pink-500 to-purple-500' 
  },
  { 
    name: 'Photo Censor', 
    href: '/tools/image/photo-censor', 
    icon: faSlash, 
    description: 'Censor parts of an image with a blur or pixelate effect.', 
    gradient: 'from-red-500 to-purple-500' 
  },
  { 
    name: 'SVG to PNG Converter', 
    href: '/tools/image/svg-to-png-converter', 
    icon: faFileImage, 
    description: 'Convert SVG files to PNG format.', 
    gradient: 'from-teal-500 to-green-500' 
  },
  { 
    name: 'Image to Base64 Converter', 
    href: '/tools/image/image-to-base64-converter', 
    icon: faCode, 
    description: 'Convert images to Base64 format for embedding.', 
    gradient: 'from-blue-500 to-indigo-500' 
  },
  { 
    name: 'Image Caption Generator', 
    href: '/tools/image/image-caption-generator', 
    icon: faCommentDots, 
    description: 'Generate captions for your images using AI.', 
    gradient: 'from-purple-500 to-pink-500' 
  },
  { 
    name: 'PNG to SVG Converter', 
    href: '/tools/image/png-to-svg-converter', 
    icon: faFileImage, 
    description: 'Convert PNG files to SVG format.', 
    gradient: 'from-indigo-500 to-blue-500' 
  },
];

export default function ImageToolsPage() {
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
            Image <span className="text-blue-400">Tools</span> Collection
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Versatile image tools for all your design needs.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {imageTools.map((tool, index) => (
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
              Need a Custom Image Tool?
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
