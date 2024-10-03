'use client'

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const apiUrl = 'https://www.thecolorapi.com/id?';

export default function ColorNameGenerator() {
  const [colorValue, setColorValue] = useState('');
  const [colorName, setColorName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [error, setError] = useState('');

  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return rgbToHex(r, g, b);
  };

  const fetchColorName = async (hex: string) => {
    try {
      const response = await fetch(`${apiUrl}hex=${hex}`);
      const data = await response.json();
      return data.name.value;
    } catch (error) {
      console.error('Error fetching color name:', error);
      return 'Error fetching color name';
    }
  };

  const handleGenerateColorName = async () => {
    setError('');
    let hex = '';

    if (/^#([0-9A-F]{3}){1,2}$/i.test(colorValue)) {
      hex = colorValue.replace('#', '');
      setBackgroundColor(hexToRgb(colorValue));
    } else if (/^rgb$$\d{1,3},\s*\d{1,3},\s*\d{1,3}$$$/i.test(colorValue)) {
      const rgbValues = colorValue.match(/\d+/g)!.map(Number);
      hex = rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]).replace('#', '');
      setBackgroundColor(colorValue);
    } else if (/^hsl$$\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%$$$/i.test(colorValue)) {
      const hslValues = colorValue.match(/\d+/g)!.map(Number);
      hex = hslToHex(hslValues[0], hslValues[1], hslValues[2]).replace('#', '');
      setBackgroundColor(hslToHex(hslValues[0], hslValues[1], hslValues[2]));
    } else {
      setError('Please enter a valid color value in HEX, RGB, or HSL format.');
      return;
    }

    const name = await fetchColorName(hex);
    setColorName(name);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Color Name Generator</h1>
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Enter the Color Values in Hex, RGB, or HSL:</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                className="flex-grow px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#FFFFFF or rgb(255,255,255) or hsl(0,100%,100%)"
              />
              <button
                onClick={handleGenerateColorName}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                Generate
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {colorName && (
            <div className="bg-gray-700 rounded-lg p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Color Name:</h4>
                <span className="text-xl font-bold text-blue-400">{colorName}</span>
              </div>
              <div
                className="w-full h-24 rounded-md shadow-md"
                style={{ backgroundColor: backgroundColor }}
              ></div>
            </div>
          )}
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 mt-4 max-w-4xl mx-auto">
          <div className="space-y-6">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">About Color Name Generator</h2>
              <p className="text-white">
                The Color Name Generator is a versatile tool that allows users to input color values in HEX, RGB, or HSL formats and obtain the corresponding color name. This tool is especially useful for designers, developers, and artists looking to identify and use specific colors in their projects.
              </p>
            </section>

            {/* How to Use Section */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">How to Use</h2>
              <ol className="list-decimal list-inside text-white space-y-2">
                <li>Enter a valid color value in HEX, RGB, or HSL format in the input field.</li>
                <li>Click the "Generate" button to retrieve the name of the color.</li>
                <li>View the color name and the color preview displayed on the screen.</li>
              </ol>
            </section>

            {/* Key Features Section */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">Key Features</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Supports color inputs in HEX, RGB, and HSL formats.</li>
                <li>Real-time color name retrieval based on the input value.</li>
                <li>Displays color preview based on the inputted value.</li>
                <li>Interactive interface with easy-to-use input fields.</li>
                <li>Error handling for invalid color values.</li>
              </ul>
            </section>

            {/* Tips and Tricks Section */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">Tips and Tricks</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Ensure the color values are in a valid format (e.g., #FFFFFF for HEX, rgb(255, 255, 255) for RGB, and hsl(0, 100%, 100%) for HSL).</li>
                <li>Use this tool to quickly identify color names for use in your design projects.</li>
                <li>Experiment with different color formats to see how the same color can be represented in multiple ways.</li>
                <li>Save color names and values for later use in web design or digital art projects.</li>
              </ul>
            </section>

          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}