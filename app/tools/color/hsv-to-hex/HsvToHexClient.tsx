'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";

function hsvToRgb(h: number, s: number, v: number) {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let [r, g, b] = [0, 0, 0];

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (h >= 300 && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function HsvToHex() {
  const [hue, setHue] = useState<string>('');
  const [saturation, setSaturation] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [hexValue, setHexValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleConvert = () => {
    setError('');

    const h = parseFloat(hue);
    const s = parseFloat(saturation);
    const v = parseFloat(value);

    if (isNaN(h) || h < 0 || h >= 360) {
      setError('Please enter a valid Hue value (0-359).');
      return;
    }

    if (isNaN(s) || s < 0 || s > 100) {
      setError('Please enter a valid Saturation value (0-100).');
      return;
    }

    if (isNaN(v) || v < 0 || v > 100) {
      setError('Please enter a valid Value value (0-100).');
      return;
    }

    const [r, g, b] = hsvToRgb(h, s, v);
    setHexValue(rgbToHex(r, g, b));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">HSV to Hex Converter</h1>

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
              <label htmlFor="value-input" className="block text-sm font-medium text-gray-300 mb-2">
                Value (0-100)
              </label>
              <Input
                id="value-input"
                type="number"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
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

          {hexValue && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white" id="hex-value">Hex: {hexValue}</p>
              </div>
              <div
                id="color-preview"
                className="mt-4 w-full h-20 rounded-lg"
                style={{ backgroundColor: hexValue }}
              ></div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">About HSV to Hex Converter</h2>
              <p className="text-white">
                The HSV to Hex Converter is a simple and effective tool that allows users to convert HSV (Hue, Saturation, Value) color values into their corresponding Hexadecimal codes. It’s particularly useful for designers and developers working on projects where color consistency and accuracy are key, such as web design, UI/UX development, and graphic design.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">How to Use HSV to Hex Converter?</h2>
              <ol className="list-decimal list-inside text-white space-y-2">
                <li>Enter the Hue value (0-359), representing the color angle.</li>
                <li>Enter the Saturation value (0-100) and the Value (brightness) (0-100).</li>
                <li>Click "Convert" to instantly receive the Hex code and a preview of the color.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">Key Features</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Accurate conversion of HSV values to Hexadecimal format.</li>
                <li>Clear and easy-to-use interface with input validation.</li>
                <li>Instant preview of the converted color for better visualization.</li>
                <li>Responsive and accessible design, compatible with various devices.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">Tips and Tricks</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Ensure that Hue is within the 0-359 range and Saturation/Value are between 0-100 for accurate conversions.</li>
                <li>Use this tool for quick color conversions when building web applications or working with color palettes.</li>
                <li>The Hex color format is essential for defining colors in HTML and CSS, making this tool ideal for web development.</li>
              </ul>
            </section>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
