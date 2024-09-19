'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";

// Function to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return [h, s, l];
}

export default function RgbToHsl() {
  const [red, setRed] = useState<string>('');
  const [green, setGreen] = useState<string>('');
  const [blue, setBlue] = useState<string>('');
  const [hslValue, setHslValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleConvert = () => {
    setError('');

    // Validate RGB values
    const r = parseInt(red);
    const g = parseInt(green);
    const b = parseInt(blue);

    if (isNaN(r) || r < 0 || r > 255) {
      setError('Please enter a valid Red value (0-255).');
      return;
    }
    if (isNaN(g) || g < 0 || g > 255) {
      setError('Please enter a valid Green value (0-255).');
      return;
    }
    if (isNaN(b) || b < 0 || b > 255) {
      setError('Please enter a valid Blue value (0-255).');
      return;
    }

    // Convert RGB to HSL
    const [h, s, l] = rgbToHsl(r, g, b);
    setHslValue(`hsl(${h}, ${s}%, ${l}%)`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">RGB to HSL Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mb-8 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

          {hslValue && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white" id="hsl-value">HSL: {hslValue}</p>
              </div>

              <div
                id="color-preview"
                className="mt-4 w-full h-20 rounded-lg"
                style={{ backgroundColor: hslValue }}
              ></div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About RGB to HSL Converter</h2>
              <p className="text-white">
                This tool allows you to convert RGB (Red, Green, Blue) color values to their HSL (Hue, Saturation, Lightness) equivalent.
                RGB represents the color based on red, green, and blue components, while HSL is designed to be more intuitive and user-friendly.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <p className="text-white">
                1. Enter the Red, Green, and Blue values between 0 and 255.<br />
                2. Click the &quot;Convert&quot; button to see the HSL equivalent of the color.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Tips</h2>
              <p className="text-white">
                - Hue is represented in degrees (0-360).<br />
                - Saturation is a percentage (0-100%).<br />
                - Lightness represents the brightness of the color (0-100%).
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
