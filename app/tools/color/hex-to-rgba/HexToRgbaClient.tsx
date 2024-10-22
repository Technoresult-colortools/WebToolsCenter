'use client';

import React, { useState } from 'react';
import { AlertCircle, BookOpen, Info, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ToolLayout from '@/components/ToolLayout'
import { Toaster, toast } from 'react-hot-toast';

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
      toast.error('Invalid Hex color code');
      return;
    }

    // Validate alpha value
    const alphaValue = parseFloat(alpha);
    if (isNaN(alphaValue) || alphaValue < 0 || alphaValue > 1) {
      setError('Please enter a valid alpha value between 0 and 1.');
      toast.error('Invalid alpha value');
      return;
    }

    // Convert the Hex to RGBA
    const rgbaObject = hexToRgba(hex, alphaValue);
    const rgbaString = `rgba(${rgbaObject.r}, ${rgbaObject.g}, ${rgbaObject.b}, ${rgbaObject.a})`;
    setRgbaValue(rgbaString);
    toast.success('Conversion successful!');
  };

  return (
    <ToolLayout
      title="Hex to RGBA Converter"
      description="Convert Hex Color Codes to RGBA(Red, Green, Blue, Alpha)"
    >
      <Toaster position="top-right" />

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

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About Hex to RGBA Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The Hex to RGBA Converter is a handy tool that enables users to transform Hex color codes into their RGBA (Red, Green, Blue, Alpha) equivalents. This converter is essential for designers and developers who require precise color specifications with transparency, making it easier to create visually appealing designs.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use Hex to RGBA Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter a valid 6-character Hex color code (with or without the # symbol).</li>
          <li>Specify an alpha value ranging from 0 (fully transparent) to 1 (fully opaque).</li>
          <li>Click the "Convert" button to view the RGBA equivalent along with a color preview.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Converts Hex color codes to RGBA format quickly.</li>
          <li>Real-time color preview for immediate feedback.</li>
          <li>Easy input and user-friendly interface.</li>
          <li>Alpha value adjustment for transparency effects.</li>
          <li>Compatible with various design applications and CSS.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Ensure your Hex color code is correctly formatted for accurate conversion.</li>
          <li>Experiment with different alpha values to see how transparency impacts your design.</li>
          <li>Utilize the RGBA format in CSS for elements that require a transparent color.</li>
          <li>Consider using the RGBA output in combination with other design tools to enhance visual effects.</li>
          <li>Keep the Hex and RGBA formats handy for various design applications and needs.</li>
        </ul>
      </div>
    </ToolLayout>
  );
}