'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input"; // Custom Input component
import {Button} from "@/components/ui/Button"; // Custom Button component

export default function CmykToRgb() {
  const [cyan, setCyan] = useState<string>('');
  const [magenta, setMagenta] = useState<string>('');
  const [yellow, setYellow] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [rgbValue, setRgbValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
    const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
    const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
    const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
    return { r, g, b };
  };

  const handleConvert = () => {
    setError('');

    // Validate CMYK values
    const c = parseFloat(cyan);
    const m = parseFloat(magenta);
    const y = parseFloat(yellow);
    const k = parseFloat(key);

    if ([c, m, y, k].some(isNaN) || [c, m, y, k].some(v => v < 0 || v > 100)) {
      setError('Please enter valid CMYK values (0-100).');
      return;
    }

    // Convert CMYK to RGB
    const { r, g, b } = cmykToRgb(c, m, y, k);
    setRgbValue(`rgb(${r}, ${g}, ${b})`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CMYK to RGB Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mb-8 mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="cyan-input" className="block text-sm font-medium text-gray-300 mb-2">
                Cyan (0-100)
              </label>
              <Input
                id="cyan-input"
                type="number"
                min="0"
                max="100"
                value={cyan}
                onChange={(e) => setCyan(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="magenta-input" className="block text-sm font-medium text-gray-300 mb-2">
                Magenta (0-100)
              </label>
              <Input
                id="magenta-input"
                type="number"
                min="0"
                max="100"
                value={magenta}
                onChange={(e) => setMagenta(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="yellow-input" className="block text-sm font-medium text-gray-300 mb-2">
                Yellow (0-100)
              </label>
              <Input
                id="yellow-input"
                type="number"
                min="0"
                max="100"
                value={yellow}
                onChange={(e) => setYellow(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="key-input" className="block text-sm font-medium text-gray-300 mb-2">
                Key (Black) (0-100)
              </label>
              <Input
                id="key-input"
                type="number"
                min="0"
                max="100"
                value={key}
                onChange={(e) => setKey(e.target.value)}
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

          {rgbValue && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white" id="rgb-value">RGB: {rgbValue}</p>
              </div>
              <div
                id="color-palette"
                className="mt-4 w-full h-20 rounded-lg"
                style={{ backgroundColor: rgbValue }}
              ></div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About CMYK to RGB Converter</h2>
              <p className="text-white">
                This tool allows you to convert CMYK (Cyan, Magenta, Yellow, Key/Black) color values to their RGB (Red, Green, Blue) equivalent.
                CMYK is primarily used in printing, while RGB is used for digital displays.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <p className="text-white">
                1. Enter Cyan, Magenta, Yellow, and Key (Black) values between 0 and 100.<br />
                2. Click the &quot;Convert&quot; button to see the RGB equivalent and a color preview.<br />
                3. The result will show the RGB values (0-255 for each component).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Tips</h2>
              <p className="text-white">
                - CMYK values range from 0 to 100, representing the percentage of each ink color.<br />
                - The Key (K) value represents black ink and helps create deeper blacks and reduce ink usage.<br />
                - RGB values range from 0 to 255 for each component (Red, Green, Blue).<br />
                - The conversion from CMYK to RGB is an approximation, as CMYK has a smaller color gamut than RGB.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />

    </div>
  );
}