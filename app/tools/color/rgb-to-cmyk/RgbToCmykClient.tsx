'use client';

import React, { useState } from 'react';
import { AlertCircle, BookOpen, Info, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ToolLayout from '@/components/ToolLayout';
import { toast, Toaster } from 'react-hot-toast';  // Import toast and Toaster

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
      toast.error('Invalid RGB values! Please enter numbers between 0-255.');
      return;
    }

    // Convert RGB to CMYK
    const { c, m, y, k } = rgbToCmyk(r, g, b);
    setCmykValue(`C: ${c}%, M: ${m}%, Y: ${y}%, K: ${k}%`);
    toast.success('Conversion successful!');
  };

  return (
    <ToolLayout
      title="RGB to CMYK Converter"
      description="Convert RGB Color Codes to CMYK"
    >
      <Toaster position="top-right" />  {/* Add Toaster for displaying toasts */}

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

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About RGB to CMYK Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The RGB to CMYK Converter is a user-friendly tool designed to assist designers, artists, and printers in converting RGB color values to CMYK. This conversion is essential for ensuring accurate color reproduction in print media, where the CMYK color model is typically used.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use RGB to CMYK Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Input RGB values in the provided fields (each ranging from 0 to 255).</li>
          <li>Click the "Convert" button to generate the corresponding CMYK values.</li>
          <li>View the resulting CMYK values and a color preview based on the RGB input.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Simple and intuitive interface for quick color conversions.</li>
          <li>Real-time validation of RGB inputs to prevent errors.</li>
          <li>Displays the equivalent CMYK values along with a color preview.</li>
          <li>Helpful error alerts for invalid input values.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Ensure RGB values are within the valid range (0-255) for accurate conversions.</li>
          <li>Use the resulting CMYK values for print design projects to maintain color consistency.</li>
          <li>Experiment with different RGB values to see how they affect the CMYK output.</li>
        </ul>
      </div>
    </ToolLayout>
  );
}
