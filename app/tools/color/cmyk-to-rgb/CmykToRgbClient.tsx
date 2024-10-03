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

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">About CMYK to RGB Converter</h2>
              <p className="text-white">
                The CMYK to RGB Converter is a powerful tool designed for graphic designers, artists, and anyone working with digital colors. This tool converts CMYK (Cyan, Magenta, Yellow, Key/Black) color values to RGB (Red, Green, Blue) format, enabling seamless color adjustments and manipulations for digital projects.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">How to Use CMYK to RGB Converter?</h2>
              <ol className="list-decimal list-inside text-white space-y-2">
                <li>Input the CMYK values in the provided fields (Cyan, Magenta, Yellow, Key/Black) ranging from 0 to 100.</li>
                <li>Click the "Convert" button to obtain the corresponding RGB values.</li>
                <li>Review the output RGB color code and view a color preview for visual reference.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">Key Features</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Simple interface for quick CMYK to RGB conversions.</li>
                <li>Real-time validation of input values to ensure accuracy.</li>
                <li>Instant display of the resulting RGB color along with a visual preview.</li>
                <li>Error alerts for invalid input, providing a smooth user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">Tips and Tricks</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Ensure each CMYK value is within the range of 0 to 100 for accurate conversions.</li>
                <li>Use the RGB output to create vibrant digital designs and graphics.</li>
                <li>Experiment with different CMYK values to see how they translate into RGB colors.</li>
              </ul>
            </section>
          </div>
        </div>

      </main>
      <Footer />

    </div>
  );
}