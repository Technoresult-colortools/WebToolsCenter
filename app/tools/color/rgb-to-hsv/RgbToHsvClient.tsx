'use client';

import React, { useState } from 'react';
import { AlertCircle, BookOpen, Info, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input"; 
import { Button } from "@/components/ui/Button"; 
import ToolLayout from '@/components/ToolLayout'
import { Toaster, toast } from 'react-hot-toast';

export default function RgbToHsv() {
  const [red, setRed] = useState<string>('');
  const [green, setGreen] = useState<string>('');
  const [blue, setBlue] = useState<string>('');
  const [hsvValue, setHsvValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    let h = 0;
    const s = max === 0 ? 0 : diff / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / diff + 2;
          break;
        case b:
          h = (r - g) / diff + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const handleConvert = () => {
    setError('');

    // Validate RGB values
    const r = parseInt(red);
    const g = parseInt(green);
    const b = parseInt(blue);

    if (isNaN(r) || r < 0 || r > 255 || isNaN(g) || g < 0 || g > 255 || isNaN(b) || b < 0 || b > 255) {
      setError('Please enter valid RGB values (0-255).');
      toast.error('Invalid RGB values');
      return;
    }

    // Convert RGB to HSV
    const { h, s, v } = rgbToHsv(r, g, b);
    setHsvValue(`hsv(${h}°, ${s}%, ${v}%)`);
    toast.success('Conversion successful!');
  };

  return (
    <ToolLayout
      title="RGB to HSV Converter"
      description="Convert RGB Color Codes to HSV"
    >
      <Toaster position="top-right" />

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

        {hsvValue && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-white" id="hsv-value">HSV: {hsvValue}</p>
            </div>
            <div
              id="color-palette"
              className="mt-4 w-full h-20 rounded-lg"
              style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
            ></div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About RGB to HSV Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The RGB to HSV Converter is a versatile tool designed to help artists, designers, and developers convert RGB (Red, Green, Blue) color values into HSV (Hue, Saturation, Value) format. This conversion is essential for understanding color relationships, designing color palettes, and manipulating colors in various digital applications.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use RGB to HSV Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter the RGB values in the respective fields (Red: 0-255, Green: 0-255, Blue: 0-255).</li>
          <li>Click the "Convert" button to obtain the corresponding HSV values.</li>
          <li>View the resulting HSV color code along with a visual preview of the RGB color.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>User-friendly interface for converting RGB values to HSV.</li>
          <li>Real-time validation of input values to prevent errors.</li>
          <li>Displays the HSV output alongside a color preview for visual confirmation.</li>
          <li>Error alerts for invalid input values, ensuring a smooth user experience.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Ensure each RGB value is within the range of 0 to 255 for accurate conversions.</li>
          <li>Use the HSV values to create harmonious color schemes for your designs.</li>
          <li>Experiment with different RGB values to explore a wide range of HSV outputs.</li>
        </ul>
      </div>
    </ToolLayout>
  );
}