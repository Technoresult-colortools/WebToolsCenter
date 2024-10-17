'use client';

import React, { useState } from 'react';
import { AlertCircle, BookOpen, Info, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button"; 
import Sidebar from '@/components/sidebarTools';

export default function RgbaToHex() {
    const [red, setRed] = useState<string>('');
    const [green, setGreen] = useState<string>('');
    const [blue, setBlue] = useState<string>('');
    const [alpha, setAlpha] = useState<string>('1');
    const [hexValue, setHexValue] = useState<string>('');
    const [hexAlpha, setHexAlpha] = useState<string>('');
    const [error, setError] = useState<string>('');
  
    const rgbaToHex = (r: number, g: number, b: number, a: number) => {
      const toHex = (value: number) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
  
      const colorHex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
      return { colorHex, alphaHex };
    };
  
    const handleConvert = () => {
      setError('');
  
      // Validate RGB values
      const r = parseInt(red);
      const g = parseInt(green);
      const b = parseInt(blue);
      const a = parseFloat(alpha);
  
      if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        setError('Please enter valid RGB values (0-255).');
        return;
      }
  
      // Validate alpha value
      if (isNaN(a) || a < 0 || a > 1) {
        setError('Please enter a valid alpha value between 0 and 1.');
        return;
      }
  
      // Convert RGBA to Hex
      const { colorHex, alphaHex } = rgbaToHex(r, g, b, a);
      setHexValue(colorHex);
      setHexAlpha(alphaHex);
    };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-900">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                RGBA to Hex Converter
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Convert RGBA Color Codes to Hex.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mb-8 mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="red-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Red (0-255)
                </label>
                <Input
                  id="red-input"
                  type="number"
                  min="0"
                  max="255"
                  value={red}
                  onChange={(e) => setRed(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="green-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Green (0-255)
                </label>
                <Input
                  id="green-input"
                  type="number"
                  min="0"
                  max="255"
                  value={green}
                  onChange={(e) => setGreen(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="blue-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Blue (0-255)
                </label>
                <Input
                  id="blue-input"
                  type="number"
                  min="0"
                  max="255"
                  value={blue}
                  onChange={(e) => setBlue(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="alpha-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Alpha (0-1)
                </label>
                <Input
                  id="alpha-input"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={alpha}
                  onChange={(e) => setAlpha(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <Button onClick={handleConvert} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Convert
            </Button>

            {error && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {hexValue && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-white" id="hex-value">Hex: {hexValue}</p>
                  <p className="text-white" id="hex-alpha">Hex Alpha: {hexAlpha}</p>
                  <p className="text-white" id="full-hex">Full Hex: {hexValue + hexAlpha}</p>
                </div>
                <div
                  id="color-palette"
                  className="mt-4 w-full h-20 rounded-lg"
                  style={{ backgroundColor: `${hexValue}${hexAlpha}` }}
                ></div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About RGBA to Hex Converter
            </h2>
            <p className="text-gray-300 mb-4">
              The RGBA to Hex Converter is a useful tool designed to transform RGBA (Red, Green, Blue, Alpha) color values into their Hex equivalent. This conversion is essential for web development and design, where Hex color codes are commonly used to specify colors with precision and clarity.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use RGBA to Hex Converter?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter valid RGB values (0-255) for Red, Green, and Blue.</li>
              <li>Specify an alpha value between 0 (fully transparent) and 1 (fully opaque).</li>
              <li>Click the "Convert" button to see the Hex equivalent along with a color preview.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>RGB values must range from 0 to 255, indicating the intensity of each color component.</li>
              <li>The alpha value defines the color's opacity; 0 represents full transparency while 1 indicates full opacity.</li>
              <li>The generated Hex code includes the alpha value as the last two characters, enabling transparency in contexts that support it.</li>
            </ul>
          </div>

        </main>
       </div> 
      <Footer />
    </div>
  );
}