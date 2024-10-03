import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
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
  { name: 'Image Cropper', href: '/tools/image/image-cropper', icon: faCropAlt, description: 'Easily crop and adjust image dimensions.' },
  { name: 'Image Filters', href: '/tools/image/image-filters', icon: faFilter, description: 'Apply filters to enhance your images.' },
  { name: 'Image Resizer', href: '/tools/image/image-resizer', icon: faExpandArrowsAlt, description: 'Resize images to fit any size requirement.' },
  { name: 'Image Average Color Finder', href: '/tools/image/image-average-color-finder', icon: faEyeDropper, description: 'Find the average color of an image.' },
  { name: 'Image Color Extractor', href: '/tools/image/image-color-extractor', icon: faPalette, description: 'Extract dominant colors from an image.' },
  { name: 'Image Color Picker', href: '/tools/image/image-color-picker', icon: faTint, description: 'Pick colors directly from an image.' },
  { name: 'SVG Blob Generator', href: '/tools/image/svg-blob-generator', icon: faShapes, description: 'Generate unique SVG blobs for your design projects.' },
  { name: 'SVG Pattern Generator', href: '/tools/image/svg-pattern-generator', icon: faProjectDiagram, description: 'Create seamless SVG patterns effortlessly.' },
  { name: 'Photo Censor', href: '/tools/image/photo-censor', icon: faSlash, description: 'Censor parts of an image with a blur or pixelate effect.' },
  { name: 'SVG to PNG Converter', href: '/tools/image/svg-to-png-converter', icon: faFileImage, description: 'Convert SVG files to PNG format.' },
  { name: 'Image to Base64 Converter', href: '/tools/image/image-to-base64-converter', icon: faCode, description: 'Convert images to Base64 format for embedding.' },
  { name: 'Image Caption Generator', href: '/tools/image/image-caption-generator', icon: faCommentDots, description: 'Generate captions for your images using AI.' },
];

export default function ImageToolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image Tools Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {imageTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <FontAwesomeIcon icon={tool.icon} className="text-2xl text-blue-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
                <p className="text-gray-400 mb-4">{tool.description}</p>
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
