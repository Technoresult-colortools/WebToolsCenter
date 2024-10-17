'use client';

import React, { useState } from 'react';
import { AlertCircle, BookOpen, Info, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import Sidebar from '@/components/sidebarTools';

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4))
  ];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export default function HslToHex() {
  const [hue, setHue] = useState<string>('');
  const [saturation, setSaturation] = useState<string>('');
  const [lightness, setLightness] = useState<string>('');
  const [hexValue, setHexValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleConvert = () => {
    setError('');

    // Validate HSL values
    const h = parseFloat(hue);
    const s = parseFloat(saturation);
    const l = parseFloat(lightness);

    if (isNaN(h) || h < 0 || h >= 360) {
      setError('Please enter a valid Hue value (0-359).');
      return;
    }

    if (isNaN(s) || s < 0 || s > 100) {
      setError('Please enter a valid Saturation value (0-100).');
      return;
    }

    if (isNaN(l) || l < 0 || l > 100) {
      setError('Please enter a valid Lightness value (0-100).');
      return;
    }

    // Convert HSL to RGB
    const [r, g, b] = hslToRgb(h, s, l);

    // Convert RGB to Hex
    const hex = rgbToHex(r, g, b);
    setHexValue(hex);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
          <main className="flex-grow container mx-auto px-4 py-12">
            <div className="mb-12 text-center px-4">
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                  HSL to Hex Converter
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                  Convert HSL Color Codes to Hex.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mb-8 mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="hue-input" className="block text-sm font-medium text-gray-300 mb-2">
                    Hue (0-359)
                  </label>
                  <Input
                    id="hue-input"
                    type="number"
                    min="0"
                    max="359"
                    value={hue}
                    onChange={(e) => setHue(e.target.value)}
                    className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="saturation-input" className="block text-sm font-medium text-gray-300 mb-2">
                    Saturation (0-100)
                  </label>
                  <Input
                    id="saturation-input"
                    type="number"
                    min="0"
                    max="100"
                    value={saturation}
                    onChange={(e) => setSaturation(e.target.value)}
                    className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lightness-input" className="block text-sm font-medium text-gray-300 mb-2">
                    Lightness (0-100)
                  </label>
                  <Input
                    id="lightness-input"
                    type="number"
                    min="0"
                    max="100"
                    value={lightness}
                    onChange={(e) => setLightness(e.target.value)}
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
                  </div>
                  <div
                    id="color-preview"
                    className="mt-4 w-full h-20 rounded-lg"
                    style={{ backgroundColor: hexValue }}
                  ></div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2" />
                About HSL to Hex Converter
              </h2>
              <p className="text-gray-300 mb-4">
                The HSL to Hex Converter is a user-friendly tool designed for artists, designers, and developers who need to convert HSL (Hue, Saturation, Lightness) color values into the Hexadecimal color format. This conversion is essential for web design and graphic applications, as Hex codes are widely used in CSS and HTML to define colors.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                How to Use HSL to Hex Converter?
              </h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Input your desired HSL values in the respective fields (Hue: 0-359, Saturation: 0-100, Lightness: 0-100).</li>
                <li>Click the "Convert" button to obtain the corresponding Hex value.</li>
                <li>View the resulting Hex color code along with a visual preview of the color.</li>
              </ol>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Key Features
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Easy-to-use interface for converting HSL values to Hex.</li>
                <li>Real-time validation of input values to prevent errors.</li>
                <li>Displays the Hex output alongside a color preview for visual confirmation.</li>
                <li>Error alerts for invalid input values, ensuring a smooth user experience.</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Tips and Tricks
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Ensure the Hue value is within the range of 0 to 359 for valid conversions.</li>
                <li>Use the Hex value in your web projects for precise color representation.</li>
                <li>Experiment with different HSL values to discover a wide range of Hex outputs.</li>
              </ul>
            </div>


          </main>
         </div> 
      <Footer />
    </div>
  );
}
