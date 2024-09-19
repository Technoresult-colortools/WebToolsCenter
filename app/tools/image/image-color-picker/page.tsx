'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RefreshCw } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ImageColorPicker() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const magnifierRef = useRef<HTMLCanvasElement>(null);
  const [showColorDetails, setShowColorDetails] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageSrc && imageRef.current && canvasRef.current) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [imageSrc]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current && canvasRef.current && magnifierRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      setMagnifierPosition({ x, y });
  
      const magnifierSize = 100;
      const magnifier = magnifierRef.current;
      magnifier.style.left = `${x - magnifierSize / 2}px`;
      magnifier.style.top = `${y - magnifierSize / 2}px`;
  
      const canvas = canvasRef.current;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
  
      const magnifierCtx = magnifier.getContext('2d')!;
      magnifierCtx.drawImage(
        canvas,
        (x - magnifierSize / 4) * scaleX,
        (y - magnifierSize / 4) * scaleY,
        magnifierSize / 2 * scaleX,
        magnifierSize / 2 * scaleY,
        0,
        0,
        magnifierSize,
        magnifierSize
      );
    }
  };
  

  const handleColorPick = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      const rect = imageRef.current!.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = magnifierPosition.x * scaleX;
      const y = magnifierPosition.y * scaleY;
      
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      const color = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
      setSelectedColor(color);
      setShowColorDetails(true);
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s; 
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h! /= 6;
  }

  return {
    h: Math.round(h! * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};


  const resetSelection = () => {
    setSelectedColor(null);
    setShowColorDetails(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image Color Picker</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mb-2 mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Upload an Image</h2>
            {!imageSrc ? (
              <label className="flex flex-col items-center justify-center h-96 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
                <Upload size={48} />
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            ) : (
              <div className="relative">
                <div 
                  className="relative h-96 bg-gray-700 rounded-lg overflow-hidden cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onClick={handleColorPick}
                >
                  <img 
                    ref={imageRef}
                    src={imageSrc} 
                    alt="Uploaded" 
                    className="w-full h-full object-contain"
                  />
                  <canvas ref={canvasRef} className="hidden"></canvas>
                  <canvas 
                    ref={magnifierRef}
                    width="100"
                    height="100"
                    className="absolute pointer-events-none border-2 border-white rounded-full shadow-lg"
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      left: '-50px', 
                      top: '-50px',
                      display: magnifierPosition.x === 0 && magnifierPosition.y === 0 ? 'none' : 'block'
                    }}
                  ></canvas>
                </div>
                <button
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600 transition duration-300"
                  onClick={() => setImageSrc(null)}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {showColorDetails && selectedColor && (
            <div className="mt-8 bg-gray-700 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Selected Color</h2>
                <button
                  onClick={resetSelection}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Reset
                </button>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: selectedColor }}></div>
                <span className="text-white text-xl font-semibold">{selectedColor}</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-300">HEX: {selectedColor}</p>
                <p className="text-gray-300">
                  RGB: {hexToRgb(selectedColor)?.r}, {hexToRgb(selectedColor)?.g}, {hexToRgb(selectedColor)?.b}
                </p>
                <p className="text-gray-300">
                  {(() => {
                    const rgb = hexToRgb(selectedColor);
                    if (!rgb) return 'Invalid color'; // Handle the case where hexToRgb returns null

                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    return `HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
                  })()}
                </p>
              </div>
            </div>
          )}  
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="mt-8">
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">About Image Color Picker</h2>
                    <p className="text-white">
                      The Image Color Picker tool allows you to extract colors from an image with just a few clicks. 
                      When you click on a particular part of the image, the color picker tool identifies the color at that point 
                      and often provides the color&#39;s values in different formats (e.g., HEX, RGB, HSL).
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
                        After uploading your image, simply click on the image to pick the color. The color&#39;s Hex, RGB, and HSL values will be displayed below the image.
                        You can copy these values to use them in your design projects.
                    </p>
                </section>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}