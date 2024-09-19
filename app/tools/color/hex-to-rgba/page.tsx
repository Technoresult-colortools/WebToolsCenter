'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input"; // Custom Input component
import {Button} from "@/components/ui/Button"; // Custom Button component

export default function HexToRgba() {
  const [hex, setHex] = useState<string>('');
  const [alpha, setAlpha] = useState<string>('1');
  const [rgbaValue, setRgbaValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const hexToRgba = (hex: string, alpha: number) => {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b, a: alpha };
  };

  const handleConvert = () => {
    setError('');

    // Validate Hex code
    const isValidHex = /^#?[0-9A-F]{6}$/i.test(hex);
    if (!isValidHex) {
      setError('Please enter a valid 6-character Hex color code.');
      return;
    }

    // Validate alpha value
    const alphaValue = parseFloat(alpha);
    if (isNaN(alphaValue) || alphaValue < 0 || alphaValue > 1) {
      setError('Please enter a valid alpha value between 0 and 1.');
      return;
    }

    // Convert the Hex to RGBA
    const rgbaObject = hexToRgba(hex, alphaValue);
    const rgbaString = `rgba(${rgbaObject.r}, ${rgbaObject.g}, ${rgbaObject.b}, ${rgbaObject.a})`;
    setRgbaValue(rgbaString);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Hex to RGBA Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mb-8 mx-auto">
          <div className="mb-6">
            <label htmlFor="hex-input" className="block text-sm font-medium text-gray-300 mb-2">
              Hex Color Code
            </label>
            <Input
              id="hex-input"
              type="text"
              placeholder="#000000"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="alpha-input" className="block text-sm font-medium text-gray-300 mb-2">
              Alpha Value (0-1)
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

          {rgbaValue && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white" id="rgba-value">RGBA: {rgbaValue}</p>
              </div>
              <div
                id="color-palette"
                className="mt-4 w-full h-20 rounded-lg"
                style={{ backgroundColor: rgbaValue }}
              ></div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About Hex to RGBA Converter</h2>
              <p className="text-white">
                This tool allows you to convert a Hex color code to its RGBA (Red, Green, Blue, Alpha) equivalent.
                RGBA colors are useful when you need to specify transparency in your designs.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <p className="text-white">
                1. Enter a valid 6-character Hex color code (with or without the # symbol).<br />
                2. Specify an alpha value between 0 (fully transparent) and 1 (fully opaque).<br />
                3. Click the &quot;Convert&quot; button to see the RGBA equivalent and a color preview.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Tips</h2>
              <p className="text-white">
                - Hex color codes consist of 6 characters, representing Red, Green, and Blue values.<br />
                - The alpha value determines the opacity of the color. 0 is fully transparent, 1 is fully opaque.<br />
                - You can use the resulting RGBA value in your CSS for elements that require transparency.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
