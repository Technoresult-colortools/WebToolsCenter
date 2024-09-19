'use client';

import React, { useState} from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";

function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  const k = Math.min(c, m, y);

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

export default function RgbToCmyk() {
  const [red, setRed] = useState<string>('');
  const [green, setGreen] = useState<string>('');
  const [blue, setBlue] = useState<string>('');
  const [cmykValue, setCmykValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleConvert = () => {
    setError('');

    // Validate RGB values
    const r = parseInt(red);
    const g = parseInt(green);
    const b = parseInt(blue);

    if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      setError('Please enter valid RGB values (0-255).');
      return;
    }

    // Convert RGB to CMYK
    const { c, m, y, k } = rgbToCmyk(r, g, b);
    setCmykValue(`C: ${c}%, M: ${m}%, Y: ${y}%, K: ${k}%`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">RGB to CMYK Converter</h1>

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

          {cmykValue && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white" id="cmyk-value">CMYK: {cmykValue}</p>
              </div>
              <div
                id="color-preview"
                className="mt-4 w-full h-20 rounded-lg"
                style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
              ></div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About RGB to CMYK Converter</h2>
              <p className="text-white">
                This tool allows you to convert RGB (Red, Green, Blue) color values to their CMYK (Cyan, Magenta, Yellow, Key/Black) equivalent.
                RGB is commonly used for digital displays, while CMYK is the standard for print production.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <p className="text-white">
                1. Enter Red, Green, and Blue values between 0 and 255.<br />
                2. Click the &quot;Convert&quot; button to see the CMYK equivalent and a color preview.<br />
                3. The result will show the CMYK values as percentages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Tips</h2>
              <p className="text-white">
                - RGB values range from 0 to 255, representing the intensity of each color component.<br />
                - CMYK values are represented as percentages from 0% to 100%.<br />
                - The conversion from RGB to CMYK is an approximation, as RGB has a wider color gamut than CMYK.<br />
                - For precise color matching in print production, professional color management tools may be necessary.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}