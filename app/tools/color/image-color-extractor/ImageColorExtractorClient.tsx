'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Copy, Info, BookOpen, Lightbulb,} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '@/components/sidebarTools';

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
}

interface ColorThief {
  getPalette: (img: HTMLImageElement, colorCount: number) => number[][];
}

declare global {
  interface Window {
    ColorThief: {
      new (): ColorThief;
    };
  }
}

export default function ColorExtractor() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [colorCount, setColorCount] = useState(6);
  const [activeTab, setActiveTab] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLLabelElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const extractColors = useCallback((imageSrc: string) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      if (window.ColorThief) {
        const colorThief = new window.ColorThief();
        const palette: number[][] = colorThief.getPalette(img, colorCount);
        setColors(palette.map(([r, g, b]) => {
          const hex = rgbToHex(r, g, b);
          const rgb = `rgb(${r}, ${g}, ${b})`;
          const hsl = rgbToHsl(r, g, b);
          return { hex, rgb, hsl };
        }));
      } else {
        console.error('ColorThief library not loaded');
      }
    };
    img.src = imageSrc;
  }, [colorCount]);
  
  useEffect(() => {
    if (image) {
      extractColors(image);
    }
  }, [extractColors, image]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add('border-blue-400');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('border-blue-400');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('border-blue-400');
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImage(e.target.files[0]);
    }
  };

  const handleImage = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a valid image file.');
    }
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; 
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }, () => {
      toast.error('Failed to copy');
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                Image Color Extractor
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Extract the most dominant colors from any image.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mb-8 mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Upload an Image</h2>
              {!image ? (
                <div
                  className="relative"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label
                    ref={dropZoneRef}
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center h-48 md:h-92 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300"
                  >
                    <Upload size={38} />
                    <span className="mt-2 text-base leading-normal text-center">Select a file or drag it here</span>
                  </label>
                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="relative" ref={imageContainerRef}>
                  <div className="w-full h-48 md:h-96 relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        <Image
                          src={image}
                          alt="Uploaded"
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 rounded-full p-2"
                    onClick={() => {
                      setImage(null);
                      setColors([]);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="mb-8">
              <Label htmlFor="color-count" className="text-white mb-2 block">Number of Colors</Label>
              <Select value={colorCount.toString()} onValueChange={(value) => setColorCount(parseInt(value, 10))}>
                <SelectTrigger id="color-count" className="w-full md:w-24 bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="21">21</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {colors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Extracted Colors</h2>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'hex' | 'rgb' | 'hsl')}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="hex">HEX</TabsTrigger>
                    <TabsTrigger value="rgb">RGB</TabsTrigger>
                    <TabsTrigger value="hsl">HSL</TabsTrigger>
                  </TabsList>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 rounded-lg shadow-lg p-4"
                      >
                        <div 
                          className="w-full h-24 rounded-lg shadow-lg mb-2"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm truncate">
                            {activeTab === 'hex' && color.hex}
                            {activeTab === 'rgb' && color.rgb}
                            {activeTab === 'hsl' && color.hsl}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(color[activeTab])}
                            className="text-white hover:text-blue-400"
                          >
                            <Copy size={16} />
                            <span className="sr-only">Copy color</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tabs>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Image Color Extractor
            </h2>
            <p className="text-gray-300 mb-4">
              The Image Color Extractor is a powerful tool designed to analyze images and extract their dominant colors. It's perfect for designers, artists, and anyone working with visual content who needs to quickly identify and use color palettes from images.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Image Color Extractor?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Upload an image by dragging and dropping it into the designated area or clicking to select a file.</li>
              <li>Choose the number of colors you want to extract using the dropdown menu.</li>
              <li>View the extracted colors displayed as color swatches with their corresponding values.</li>
              <li>Switch between HEX, RGB, and HSL color formats using the tabs.</li>
              <li>Click the copy icon next to each color to copy its value to your clipboard.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Extract up to 21 dominant colors from any image</li>
              <li>View colors in HEX, RGB, and HSL formats</li>
              <li>One-click color copying to clipboard</li>
              <li>Responsive design for use on various devices</li>
              <li>Real-time color extraction and display</li>
              <li>User-friendly interface with drag-and-drop functionality</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>For more accurate color extraction, use high-quality images with clear, distinct colors.</li>
              <li>Experiment with different numbers of colors to find the best palette for your needs.</li>
              <li>Use the HEX format for web design, RGB for digital graphics, and HSL for fine-tuning colors.</li>
              <li>Copy multiple colors to create a complete color scheme for your project.</li>
              <li>Try extracting colors from different sections of an image to get varied palettes.</li>
              <li>Use the tool to analyze competitors' websites or inspirational images for color ideas.</li>
            </ul>
          </div>

        </main>
        </div>
      <Footer />
    </div>
  );
}