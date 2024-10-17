'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RefreshCw, Info, BookOpen, Lightbulb, } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from 'react-hot-toast';
import CompactShare from '@/components/CompactShare';
import CommentsSection from '@/components/CommentsSection';
import Sidebar from '@/components/sidebarTools';


type ColorFormat = 'hex' | 'rgb' | 'hsl';

export default function ImageColorPicker() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const magnifierRef = useRef<HTMLCanvasElement>(null);
  const [showColorDetails, setShowColorDetails] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [colorHistory, setColorHistory] = useState<string[]>([]);

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

      // Draw crosshair
      magnifierCtx.strokeStyle = 'white';
      magnifierCtx.lineWidth = 2;
      magnifierCtx.beginPath();
      magnifierCtx.moveTo(magnifierSize / 2, 0);
      magnifierCtx.lineTo(magnifierSize / 2, magnifierSize);
      magnifierCtx.moveTo(0, magnifierSize / 2);
      magnifierCtx.lineTo(magnifierSize, magnifierSize / 2);
      magnifierCtx.stroke();
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
      
      const color = getAverageColor(ctx, x, y, 3);

      setSelectedColor(color);
      setShowColorDetails(true);
      setColorHistory(prevHistory => [color, ...prevHistory.slice(0, 9)]);
    }
  };

  const getAverageColor = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number): string => {
    const halfSize = Math.floor(size / 2);
    const imageData = ctx.getImageData(x - halfSize, y - halfSize, size, size);
    let r = 0, g = 0, b = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
    }

    const pixelCount = size * size;
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);

    return rgbToHex(r, g, b);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }, () => {
      toast.error('Failed to copy');
    });
  };

  const getColorString = (color: string | null) => {
    if (!color) return '';
    const rgb = hexToRgb(color);
    if (!rgb) return '';
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    switch (colorFormat) {
      case 'hex':
        return color;
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hsl':
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
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
              Image Color Picker
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Effortlessly extract and capture colors from any image, perfect for enhancing your design projects with precision and ease.
          </p>
      </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mb-8 mx-auto">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Upload an Image</h2>
            {!imageSrc ? (
              <label className="flex flex-col items-center justify-center h-48 md:h-96 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
                <Upload size={32} />
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            ) : (
              <div className="relative">
                <div 
                  className="relative h-48 md:h-96 bg-gray-700 rounded-lg overflow-hidden cursor-crosshair"
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
            <div className="mt-6 bg-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Selected Color</h2>
                <Button onClick={resetSelection} variant="outline" className="bg-gray-600 text-white hover:bg-gray-500">
                  <RefreshCw size={16} className="mr-2" />
                  Reset
                </Button>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: selectedColor }}></div>
                <span className="text-white text-lg md:text-xl font-semibold">{getColorString(selectedColor)}</span>
                <Button onClick={() => copyToClipboard(getColorString(selectedColor))} variant="outline" size="sm" className="bg-gray-600 text-white hover:bg-gray-500">
                  Copy
                </Button>
              </div>
              <Tabs defaultValue="hex" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-600">
                  <TabsTrigger value="hex" onClick={() => setColorFormat('hex')} className="data-[state=active]:bg-gray-500">HEX</TabsTrigger>
                  <TabsTrigger value="rgb" onClick={() => setColorFormat('rgb')} className="data-[state=active]:bg-gray-500">RGB</TabsTrigger>
                  <TabsTrigger value="hsl" onClick={() => setColorFormat('hsl')} className="data-[state=active]:bg-gray-500">HSL</TabsTrigger>
                </TabsList>
                <TabsContent value="hex" className="text-white">
                  HEX: {selectedColor}
                </TabsContent>
                <TabsContent value="rgb" className="text-white">
                  RGB: {hexToRgb(selectedColor)?.r}, {hexToRgb(selectedColor)?.g}, {hexToRgb(selectedColor)?.b}
                </TabsContent>
                <TabsContent value="hsl" className="text-white">
                  {(() => {
                    const rgb = hexToRgb(selectedColor);
                    if (!rgb) return 'Invalid color';
                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    return `HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
                  })()}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {colorHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">Color History</h3>
              <div className="flex flex-wrap gap-2">
                {colorHistory.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                    title={`Click to copy: ${color}`}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
    
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Image Color Picker
          </h2>
          <p className="text-gray-300 mb-4">
              The Image Color Picker is a user-friendly tool that allows you to extract colors from any uploaded image. It provides a simple and effective way to identify and capture colors for your design projects.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Image Color Picker?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Upload an image by clicking on the upload area or dragging and dropping a file.</li>
              <li>Move your cursor over the image to see a magnified view.</li>
              <li>Click on the image to select a color.</li>
              <li>View the selected color details in HEX, RGB, and HSL formats.</li>
              <li>Copy the color values to your clipboard by clicking the "Copy" button.</li>
              <li>Use the color history to quickly access previously selected colors.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Simple and intuitive color picker.</li>
              <li>Real-time magnifier for precise color selection.</li>
              <li>Color format switching between HEX, RGB, and HSL.</li>
              <li>Color history for quick access to previously selected colors.</li>
              <li>One-click color copying to clipboard.</li>
              <li>Responsive design for use on various devices.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use the magnifier to ensure you're selecting the exact color you want.</li>
              <li>The color picker uses a small average area to provide more accurate color selection, especially in images with noise or texture.</li>
              <li>Utilize the color history to compare different colors from your image.</li>
              <li>For web design, use the HEX format for easy integration with CSS.</li>
              <li>When working with print designs, RGB values might be more useful.</li>
              <li>HSL format can be helpful for understanding and adjusting color properties like hue and saturation.</li>
              <li>Experiment with different parts of your image to find the perfect color for your project.</li>
          </ul>
      </div>

      </main>
      
      </div>
      <Footer />
    </div>
  );
}