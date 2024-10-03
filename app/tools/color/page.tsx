import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
} from '@fortawesome/free-solid-svg-icons'

const colorTools = [
  { name: 'Image Color Picker', href: '/tools/color/image-color-picker', icon: faEyeDropper, description: 'Pick any color from an image with ease.' },
  { name: 'Image Color Extractor', href: '/tools/color/image-color-extractor', icon: faImage, description: 'Extract the most dominant colors from any image.' },
  { name: 'Hex to RGBA Converter', href: '/tools/color/hex-to-rgba', icon: faHashtag, description: 'Convert Hex color codes to RGBA format quickly.' },
  { name: 'RGBA to Hex Converter', href: '/tools/color/rgba-to-hex', icon: faHashtag, description: 'Convert RGBA values to Hex color codes effortlessly.' },
  { name: 'HSV to RGB Converter', href: '/tools/color/hsv-to-rgb', icon: faHashtag, description: 'Easily convert HSV color format to RGB.' },
  { name: 'RGB to HSV Converter', href: '/tools/color/rgb-to-hsv', icon: faSliders, description: 'Convert RGB colors to HSV format seamlessly.' },
  { name: 'CMYK to RGB Converter', href: '/tools/color/cmyk-to-rgb', icon: faPrint, description: 'Convert CMYK values to RGB format with precision.' },
  { name: 'Color Mixer', href: '/tools/color/color-mixer', icon: faDroplet, description: 'Mix multiple colors together and create new ones.' },
  { name: 'Color Shades Generator', href: '/tools/color/color-shades-generator', icon: faSun, description: 'Generate multiple shades of any color.' },
  { name: 'RGB to CMYK Converter', href: '/tools/color/rgb-to-cmyk', icon: faPrint, description: 'Easily convert RGB values to CMYK for printing needs.' },
  { name: 'HSL to RGB Converter', href: '/tools/color/hsl-to-rgb', icon: faSliders, description: 'Convert HSL colors to RGB format with ease.' },
  { name: 'HSL to HEX Converter', href: '/tools/color/hsl-to-hex', icon: faHashtag, description: 'Transform HSL colors into Hex color codes.' },
  { name: 'HSV to Hex Converter', href: '/tools/color/hsv-to-hex', icon: faHashtag, description: 'Convert HSV color format into Hex codes quickly.' },
  { name: 'RGB to HSL Converter', href: '/tools/color/rgb-to-hsl', icon: faHashtag, description: 'Convert RGB colors into HSL format effortlessly.' },
  { name: 'Color Name Generator', href: '/tools/color/color-name-generator', icon: faTag, description: 'Generate names for custom colors based on RGB or Hex values.' },
  { name: 'Color Palette Generator', href: '/tools/color/color-palette-generator', icon: faMicrochip, description: 'Create stunning color palettes for your designs.' },
  { name: 'Color Wheel', href: '/tools/color/color-wheel', icon: faPalette, description: 'Visualize colors and find perfect combinations using the color wheel.' },
  { name: 'Gradient Generator', href: '/tools/color/color-gradient-generator', icon: faPalette, description: 'Design beautiful gradients with custom colors and stops.' },
  { name: 'Tailwind CSS Color Palette', href: '/tools/color/tailwind-color-generator', icon: faPalette, description: 'Convert TailWind CSS to Hex, Generate TailWind Colors.' },
  { name: 'Color Converter', href: '/tools/color/color-converter', icon: faPalette, description: 'Convert color codes from Hex to RGBA, HSL, HSV, RGB and viceversa.' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Color Tools Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {colorTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <FontAwesomeIcon icon={tool.icon} className="text-2xl text-blue-400 mb-4" /> {/* Adjusted size */}
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
  )
}
