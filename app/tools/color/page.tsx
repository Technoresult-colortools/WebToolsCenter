'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, CogIcon, Star } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEyeDropper,
  faTag,
  faImage,
  faHashtag,
  faPalette,
  faSliders,
  faPrint,
  faDroplet,
  faSun,
  faMicrochip,
} from '@fortawesome/free-solid-svg-icons';

const colorTools = [
  { name: 'Image Color Picker', href: '/tools/color/image-color-picker', icon: faEyeDropper, description: 'Pick any color from an image with ease.', gradient: 'from-red-500 to-yellow-500' },
  { name: 'Image Color Extractor', href: '/tools/color/image-color-extractor', icon: faImage, description: 'Extract the most dominant colors from any image.', gradient: 'from-blue-500 to-purple-500' },
  { name: 'Hex to RGBA Converter', href: '/tools/color/hex-to-rgba', icon: faHashtag, description: 'Convert Hex color codes to RGBA format quickly.', gradient: 'from-green-500 to-teal-500' },
  { name: 'RGBA to Hex Converter', href: '/tools/color/rgba-to-hex', icon: faHashtag, description: 'Convert RGBA values to Hex color codes effortlessly.', gradient: 'from-purple-500 to-pink-500' },
  { name: 'HSV to RGB Converter', href: '/tools/color/hsv-to-rgb', icon: faHashtag, description: 'Easily convert HSV color format to RGB.', gradient: 'from-yellow-500 to-orange-500' },
  { name: 'RGB to HSV Converter', href: '/tools/color/rgb-to-hsv', icon: faSliders, description: 'Convert RGB colors to HSV format seamlessly.', gradient: 'from-indigo-500 to-blue-500' },
  { name: 'CMYK to RGB Converter', href: '/tools/color/cmyk-to-rgb', icon: faPrint, description: 'Convert CMYK values to RGB format with precision.', gradient: 'from-teal-500 to-green-500' },
  { name: 'Color Mixer', href: '/tools/color/color-mixer', icon: faDroplet, description: 'Mix multiple colors together and create new ones.', gradient: 'from-red-500 to-purple-500' },
  { name: 'Color Shades Generator', href: '/tools/color/color-shades-generator', icon: faSun, description: 'Generate multiple shades of any color.', gradient: 'from-blue-500 to-teal-500' },
  { name: 'RGB to CMYK Converter', href: '/tools/color/rgb-to-cmyk', icon: faPrint, description: 'Easily convert RGB values to CMYK for printing needs.', gradient: 'from-indigo-500 to-blue-500' },
  { name: 'HSL to RGB Converter', href: '/tools/color/hsl-to-rgb', icon: faSliders, description: 'Convert HSL colors to RGB format with ease.', gradient: 'from-purple-500 to-pink-500' },
  { name: 'HSL to HEX Converter', href: '/tools/color/hsl-to-hex', icon: faHashtag, description: 'Transform HSL colors into Hex color codes.', gradient: 'from-yellow-500 to-orange-500' },
  { name: 'HSV to Hex Converter', href: '/tools/color/hsv-to-hex', icon: faHashtag, description: 'Convert HSV color format into Hex codes quickly.', gradient: 'from-green-500 to-teal-500' },
  { name: 'RGB to HSL Converter', href: '/tools/color/rgb-to-hsl', icon: faHashtag, description: 'Convert RGB colors into HSL format effortlessly.', gradient: 'from-blue-500 to-purple-500' },
  { name: 'Color Name Generator', href: '/tools/color/color-name-generator', icon: faTag, description: 'Generate names for custom colors based on RGB or Hex values.', gradient: 'from-red-500 to-yellow-500' },
  { name: 'Color Palette Generator', href: '/tools/color/color-palette-generator', icon: faMicrochip, description: 'Create stunning color palettes for your designs.', gradient: 'from-green-500 to-teal-500' },
  { name: 'Color Wheel', href: '/tools/color/color-wheel', icon: faPalette, description: 'Visualize colors and find perfect combinations using the color wheel.', gradient: 'from-purple-500 to-pink-500' },
  { name: 'Gradient Generator', href: '/tools/color/color-gradient-generator', icon: faPalette, description: 'Design beautiful gradients with custom colors and stops.', gradient: 'from-yellow-500 to-orange-500' },
  { name: 'Tailwind CSS Color Palette', href: '/tools/color/tailwind-color-generator', icon: faPalette, description: 'Convert TailWind CSS to Hex, Generate TailWind Colors.', gradient: 'from-teal-500 to-green-500' },
  { name: 'Color Converter', href: '/tools/color/color-converter', icon: faPalette, description: 'Convert color codes from Hex to RGBA, HSL, HSV, RGB and vice versa.', gradient: 'from-indigo-500 to-blue-500' },
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
            Color <span className="text-blue-400">Tools</span> Collection
            <span className="inline-block ml-3">
             <CogIcon className="w-10 h-10 text-blue-400 animate-spin-slow" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Handy color tools for designers and developers alike.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {colorTools.map((tool, index) => (
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
              Need a Custom Color Tool?
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
