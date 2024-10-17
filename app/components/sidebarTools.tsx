'use client'

import React, { useState } from 'react';
import { FileText, Image, Palette, SprayCan, Code, SquareKanban, FacebookIcon, Sparkles, ChevronUp, ChevronDown } from 'lucide-react'; // Replace with actual icons
type SubCategory = {
    name: string;
    href: string;
  };
  
  type Category = {
    name: string;
    icon: React.ElementType;
    gradient: string;
    subCategories: SubCategory[];
  };
  

const categories = [
  {
    name: 'Text Tools',
    icon: FileText,
    gradient: 'from-blue-500 to-indigo-500',
    subCategories: [
      { name: 'Case Converter', href: '/tools/text/case-converter' },
      { name: 'Letter Counter', href: '/tools/text/letter-counter' },
      { name: 'Lorem Ipsum Generator', href: '/tools/text/lorem-ipsum-generator' },
      { name: 'Words Counter', href: '/tools/text/words-counter' },
      { name: 'Whitespace Remover', href: '/tools/text/whitespace-remover' },
      { name: 'Google Fonts Pair Finder', href: '/tools/text/google-fonts-pair-finder' },
      { name: 'Text Reverser', href: '/tools/text/text-reverser' },
      { name: 'Character Frequency Counter', href: '/tools/text/character-frequency-counter' },
      { name: 'Text to ASCII/Hex/Binary Converter', href: '/tools/text/text-to-ascii-hex-binary' },
      { name: 'Title Case Converter', href: '/tools/text/title-case-converter' },
      { name: 'Duplicate Line Remover', href: '/tools/text/duplicate-line-remover' },
      { name: 'HTML Encoder/Decoder', href: '/tools/text/html-encoder-decoder' },
      { name: 'Markdown to HTML Converter', href: '/tools/text/markdown-to-html' },
      { name: 'Word Scrambler', href: '/tools/text/word-scrambler' }
    ]
  },
  { 
    name: 'Image Tools', 
    icon: Image, 
    gradient: 'from-purple-500 to-pink-500',
    subCategories: [
      { name: 'Image Cropper', href: '/tools/image/image-cropper' },
      { name: 'Image Filters', href: '/tools/image/image-filters' },
      { name: 'Image Resizer', href: '/tools/image/image-resizer' },
      { name: 'Image Average Color Finder', href: '/tools/image/image-average-color-finder' },
      { name: 'Image Color Extractor', href: '/tools/image/image-color-extractor' },
      { name: 'Image Color Picker', href: '/tools/image/image-color-picker' },
      { name: 'SVG Blob Generator', href: '/tools/image/svg-blob-generator' },
      { name: 'SVG Pattern Generator', href: '/tools/image/svg-pattern-generator' },
      { name: 'Photo Censor', href: '/tools/image/photo-censor' },
      { name: 'SVG to PNG Converter', href: '/tools/image/svg-to-png-converter' },
      { name: 'Image to Base64 Converter', href: '/tools/image/image-to-base64-converter' }
    ]
  },
  { 
    name: 'CSS Tools', 
    icon: Palette, 
    gradient: 'from-green-500 to-teal-500',
    subCategories: [
      { name: 'CSS Clip Path Generator', href: '/tools/css/clip-path-generator' },
      { name: 'CSS Loader Generator', href: '/tools/css/loader-generator' },
      { name: 'CSS Background Pattern Generator', href: '/tools/css/background-pattern-generator' },
      { name: 'CSS Cubic Bezier Generator', href: '/tools/css/cubic-bezier-generator' },
      { name: 'CSS Glassmorphism Generator', href: '/tools/css/glassmorphism-generator' },
      { name: 'CSS Text Glitch Effect Generator', href: '/tools/css/text-glitch-effect-generator' },
      { name: 'CSS Gradient Generator', href: '/tools/css/gradient-generator' },
      { name: 'CSS Triangle Generator', href: '/tools/css/triangle-generator' },
      { name: 'CSS Box Shadow Generator', href: '/tools/css/box-shadow-generator' },
      { name: 'CSS Border Radius Generator', href: '/tools/css/border-radius-generator' },
      { name: 'CSS FlexBox Generator', href: '/tools/css/flexbox-generator' }
    ]
  },
  { 
    name: 'Color Tools', 
    icon: SprayCan, 
    gradient: 'from-yellow-500 to-orange-500',
    subCategories: [
      { name: 'Image Color Picker', href: '/tools/color/image-color-picker' },
      { name: 'Image Color Extractor', href: '/tools/color/image-color-extractor' },
      { name: 'Hex to RGBA Converter', href: '/tools/color/hex-to-rgba' },
      { name: 'RGBA to Hex Converter', href: '/tools/color/rgba-to-hex' },
      { name: 'HSV to RGB Converter', href: '/tools/color/hsv-to-rgb' },
      { name: 'RGB to HSV Converter', href: '/tools/color/rgb-to-hsv' },
      { name: 'CMYK to RGB Converter', href: '/tools/color/cmyk-to-rgb' },
      { name: 'Color Mixer', href: '/tools/color/color-mixer' },
      { name: 'Color Shades Generator', href: '/tools/color/color-shades-generator' },
      { name: 'RGB to CMYK Converter', href: '/tools/color/rgb-to-cmyk' },
      { name: 'HSL to RGB Converter', href: '/tools/color/hsl-to-rgb' },
      { name: 'HSL to HEX Converter', href: '/tools/color/hsl-to-hex' },
      { name: 'HSV to Hex Converter', href: '/tools/color/hsv-to-hex' },
      { name: 'RGB to HSL Converter', href: '/tools/color/rgb-to-hsl' },
      { name: 'Color Name Generator', href: '/tools/color/color-name-generator' },
      { name: 'Color Palette Generator', href: '/tools/color/color-palette-generator' },
      { name: 'Color Wheel', href: '/tools/color/color-wheel' },
      { name: 'Gradient Generator', href: '/tools/color/color-gradient-generator' },
      { name: 'Tailwind CSS Color Palette', href: '/tools/color/tailwind-color-generator' }
    ]
  },
  { 
    name: 'Coding Tools', 
    icon: Code, 
    gradient: 'from-red-500 to-pink-500',
    subCategories: [
      { name: 'Code to Image Converter', href: '/tools/coding/code-to-image-converter' },
      { name: 'URL Slug Generator', href: '/tools/coding/url-slug-generator' },
      { name: 'React Native Shadow Generator', href: '/tools/coding/react-native-shadow-generator' },
      { name: 'Base64 Encoder/Decoder', href: '/tools/coding/base64-encoder-decoder' },
      { name: 'HTML Encoder/Decoder', href: '/tools/coding/html-encoder-decoder' },
      { name: 'URL Encoder/Decoder', href: '/tools/coding/url-encoder-decoder' },
      { name: 'HTML Minifier', href: '/tools/coding/html-minifier' },
      { name: 'CSS Minifier', href: '/tools/coding/css-minifier' },
      { name: 'JavaScript Minifier', href: '/tools/coding/javascript-minifier' },
      { name: 'HTML Formatter', href: '/tools/coding/html-formatter' },
      { name: 'CSS Formatter', href: '/tools/coding/css-formatter' },
      { name: 'JavaScript Formatter', href: '/tools/coding/javascript-formatter' },
      { name: 'MD5 Generator and Verifier', href: '/tools/coding/md5-encrypt-verify' },
      { name: 'SHA1 Encrypt and Verifier', href: '/tools/coding/sha1-encrypt-verify' },
      { name: 'SHA224 Encrypt and Verifier', href: '/tools/coding/sha224-encrypt-verify' },
      { name: 'SHA256 Encrypt and Verifier', href: '/tools/coding/sha256-encrypt-verify' },
      { name: 'SHA384 Encrypt and Verifier', href: '/tools/coding/sha384-encrypt-verify' },
      { name: 'SHA512 Encrypt and Verifier', href: '/tools/coding/sha512-encrypt-verify' },
      { name: 'JWT Encoder/Decoder', href: '/tools/coding/jwt-encoder-decoder' },
      { name: 'Advance JSON Tree Viewer', href: '/tools/coding/json-tree-viewer' }
    ]
  },
  { 
    name: 'Miscellaneous Tools', 
    icon: SquareKanban, 
    gradient: 'from-indigo-500 to-blue-500',
    subCategories: [
      { name: 'Advance Password Generator', href: '/tools/misc/advance-password-generator' },
      { name: 'List Randomizer', href: '/tools/misc/list-randomizer' },
      { name: 'QR Code Generator', href: '/tools/misc/qr-code-generator' },
      { name: 'BarCode Generator', href: '/tools/misc/barcode-generator' },
      { name: 'Unit Converter', href: '/tools/misc/unit-converter' }
    ]
  },
  { 
    name: 'Social Media Tools', 
    icon: FacebookIcon, 
    gradient: 'from-blue-500 to-purple-500',
    subCategories: [
      { name: 'Instagram Filters', href: '/tools/social-media/instagram-filters' },
      { name: 'Instagram Post Generator', href: '/tools/social-media/instagram-post-generator' },
      { name: 'Instagram Photo Downloader', href: '/tools/social-media/instagram-photo-downloader' },
      { name: 'Tweet Generator', href: '/tools/social-media/tweet-generator' },
      { name: 'Tweet to Image Converter', href: '/tools/social-media/tweet-to-image-converter' },
      { name: 'YouTube Thumbnail Downloader', href: '/tools/social-media/youtube-thumbnail-downloader' }
    ]
  },
];

const Sidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  return (
    <aside className="sticky left-0 top-16 h-screen w-0 md:w-16 lg:w-72 xl:w-80 bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col">
      <div className="p-6 hidden lg:block flex-shrink-0">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          Explore Tools
          <Sparkles className="w-5 h-5 ml-2 text-yellow-400" />
        </h2>
      </div>
      <nav className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="px-4 pb-6 space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="mb-2">
              <button
                className={`flex items-center justify-between w-full p-3 rounded-lg text-left text-gray-200 hover:bg-gray-800 transition-all duration-300 ${
                  activeCategory === category.name ? 'bg-gray-800' : ''
                }`}
                onClick={() => toggleCategory(category.name)}
              >
                <span className="flex items-center">
                  <div className={`w-8 h-8 rounded-md mr-3 flex items-center justify-center bg-gradient-to-br ${category.gradient}`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="hidden lg:inline">{category.name}</span>
                </span>
                <ChevronDown className={`w-5 h-5 hidden lg:block transition-transform duration-300 ${activeCategory === category.name ? 'rotate-180' : ''}`} />
              </button>
              {activeCategory === category.name && (
                <ul className="mt-2 ml-11 space-y-1 hidden lg:block">
                  {category.subCategories.map((subCategory) => (
                    <li key={subCategory.name}>
                      <a
                        href={subCategory.href}
                        className="block py-2 px-3 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-colors duration-300"
                      >
                        {subCategory.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;