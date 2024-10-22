'use client';

import React, { useState } from 'react';
import { AlertCircle, BookOpen, Info, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ToolLayout from '@/components/ToolLayout';
import { toast, Toaster } from 'react-hot-toast'; // Importing toast and Toaster

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

export default function HslToRgb() {
  const [hue, setHue] = useState<string>('');
  const [saturation, setSaturation] = useState<string>('');
  const [lightness, setLightness] = useState<string>('');
  const [rgbValue, setRgbValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleConvert = () => {
    setError('');

    // Validate HSL values
    const h = parseFloat(hue);
    const s = parseFloat(saturation);
    const l = parseFloat(lightness);

    if (isNaN(h) || h < 0 || h >= 360) {
      setError('Please enter a valid Hue value (0-359).');
      toast.error('Please enter a valid Hue value (0-359).'); // Error Toast
      return;
    }

    if (isNaN(s) || s < 0 || s > 100) {
      setError('Please enter a valid Saturation value (0-100).');
      toast.error('Please enter a valid Saturation value (0-100).'); // Error Toast
      return;
    }

    if (isNaN(l) || l < 0 || l > 100) {
      setError('Please enter a valid Lightness value (0-100).');
      toast.error('Please enter a valid Lightness value (0-100).'); // Error Toast
      return;
    }

    // Convert HSL to RGB
    const [r, g, b] = hslToRgb(h, s, l);
    setRgbValue(`rgb(${r}, ${g}, ${b})`);
    toast.success('Conversion Successful!'); // Success Toast
  };

  return (
    <ToolLayout
      title="HSL to RGB Converter"
      description="Convert HSL Color Codes to RGB"
    >
      <Toaster position="top-right" /> {/* Toaster to display notifications */}
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

        {rgbValue && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-white" id="rgb-value">RGB: {rgbValue}</p>
            </div>
            <div
              id="color-preview"
              className="mt-4 w-full h-20 rounded-lg"
              style={{ backgroundColor: rgbValue }}
            ></div>
          </div>
        )}
      </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2" />
                About HSL to RGB Converter
              </h2>
              <p className="text-gray-300 mb-4">
                The HSL to RGB Converter is a straightforward tool designed to help designers and artists convert HSL (Hue, Saturation, Lightness) color values into RGB (Red, Green, Blue) format. This conversion is crucial for digital design, as RGB is the standard color model used in screens and digital displays.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                How to Use HSL to RGB Converter?
              </h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Enter the HSL values in the respective fields, ensuring the correct ranges (Hue: 0-359, Saturation: 0-100, Lightness: 0-100).</li>
                <li>Click the "Convert" button to get the corresponding RGB values.</li>
                <li>View the resulting RGB values along with a color preview based on your input.</li>
              </ol>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Key Features
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>User-friendly interface for quick HSL to RGB conversions.</li>
                <li>Real-time validation of input values to ensure accurate conversions.</li>
                <li>Displays the RGB output along with a visual color preview.</li>
                <li>Helpful error alerts for any invalid input values.</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Tips and Tricks
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Ensure that Hue is within the range of 0 to 359 for valid input.</li>
                <li>Use the resulting RGB values in your digital design projects for consistent color representation.</li>
                <li>Experiment with different HSL values to see the variety of RGB outputs.</li>
              </ul>
            </div>
  </ToolLayout>          
  );
}