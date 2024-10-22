'use client';

import React, { useState } from 'react';
import { AlertCircle, BookOpen, Info, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ToolLayout from '@/components/ToolLayout';
import { Toaster, toast } from 'react-hot-toast';

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

    const r = parseInt(red);
    const g = parseInt(green);
    const b = parseInt(blue);

    if (isNaN(r) || r < 0 || r > 255) {
      setError('Please enter a valid Red value (0-255).');
      toast.error('Invalid Red value. It must be between 0-255.');
      return;
    }
    if (isNaN(g) || g < 0 || g > 255) {
      setError('Please enter a valid Green value (0-255).');
      toast.error('Invalid Green value. It must be between 0-255.');
      return;
    }
    if (isNaN(b) || b < 0 || b > 255) {
      setError('Please enter a valid Blue value (0-255).');
      toast.error('Invalid Blue value. It must be between 0-255.');
      return;
    }

    const [h, s, l] = rgbToHsl(r, g, b);
    setHslValue(`hsl(${h}, ${s}%, ${l}%)`);
    toast.success('RGB to HSL conversion successful!');
  };

  return (
    <ToolLayout
      title="RGB to HSL Converter"
      description="Convert RGB Color Codes to HSL"
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

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About RGB to HSL Converter
            </h2>
            <p className="text-gray-300 mb-4">
              The RGB to HSL Converter is a tool designed to convert RGB color values into their HSL (Hue, Saturation, Lightness) equivalents. This tool is useful for designers, developers, and artists who want to convert color values for various purposes such as web design, graphics, or UI development.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use RGB to HSL Converter?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter the Red, Green, and Blue values (0-255) in their respective input fields.</li>
              <li>Click the "Convert" button to get the corresponding HSL values.</li>
              <li>See the generated HSL value displayed along with a preview of the color.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Easy input for RGB values (0-255).</li>
              <li>Real-time conversion from RGB to HSL.</li>
              <li>Displays HSL value with a color preview.</li>
              <li>Error handling for invalid input ranges.</li>
              <li>Responsive design for ease of use on various devices.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Ensure RGB values are within the 0-255 range for accurate conversion.</li>
              <li>Use this tool to convert RGB colors into HSL for web design or CSS styling.</li>
              <li>Experiment with different RGB values to explore a range of colors in the HSL format.</li>
              <li>Use the preview section to see how the color will appear in your design.</li>
            </ul>
          </div>
  </ToolLayout>
  );
}
