'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ColorExtractor() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<Array<{hex: string, rgb: string, hsl: string}>>([]);
  const [colorCount, setColorCount] = useState(6);
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

  useEffect(() => {
    if (image) {
      extractColors(image);
    }
  }, [colorCount, image]);

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
      alert('Please upload a valid image file.');
    }
  };

  const extractColors = React.useCallback((imageSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const colorThief = (window as any).ColorThief ? new (window as any).ColorThief() : null;
      if (colorThief) {
        const palette = colorThief.getPalette(img, colorCount);
        setColors(palette.map((color: number[]) => {
          const hex = rgbToHex(color[0], color[1], color[2]);
          const rgb = `RGB: ${color[0]}, ${color[1]}, ${color[2]}`;
          const hsl = rgbToHsl(color[0], color[1], color[2]);
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

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s; 
    const l = (max + min) / 2;
    
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return `HSL: ${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image Color Extractor</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mb-8 mx-auto">
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
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center h-96 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300"
              >
                <Upload size={38} />
                <span className="mt-2 text-base leading-normal">Select a file or drag it here</span>
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
              <img
                src={image}
                alt="Uploaded"
                className="max-w-full h-auto rounded-lg mx-auto"
              />
              <button
                className="absolute top-0 right-0 m-2 text-white bg-red-500 hover:bg-red-700 rounded-full p-2"
                onClick={() => {
                  setImage(null);
                  setColors([]);
                }}
              >
                <X size={24} />
              </button>
            </div>
          )}
        </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Select Number of Colors</h2>
            <select
              value={colorCount}
              onChange={(e) => setColorCount(parseInt(e.target.value))}
              className="w-24 bg-gray-700 text-white border-gray-600 rounded"
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="21">21</option>
            </select>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Extracted Colors</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg shadow-lg p-4"
                >
                  <div 
                    className="w-full h-24 rounded-lg shadow-lg mb-2"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <p className="text-center text-white">{color.hex}</p>
                  <p className="text-center text-white text-sm">{color.rgb}</p>
                  <p className="text-center text-white text-sm">{color.hsl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="mt-8">
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">About Image Color Extractor</h2>
                    <p className="text-white">
                      The Image Color Extractor tool allows you to extract all the colors present in an image with just a few clicks. You can use it to identify the exact color codes in various formats like Hex, RGB, and HSL, as well as see a list of all the extracted colors.
                    </p>          
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">How to Upload the Image?</h2>
                    <p className="text-white">
                        To upload an image, drag and drop your image file into the designated area, or click on the area to browse and select your image from your device.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
                    <p className="text-white">
                       After uploading your image, the tool will automatically extract all the colors present in the image. The extracted colors, along with their Hex, RGB, and HSL values, will be displayed below the image. You can copy these values to use them in your design projects.
                    </p>
                </section>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}