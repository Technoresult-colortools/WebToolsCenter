'use client';

import React, { useState } from 'react';
import { AlertCircle, BookOpen, Info, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input"; 
import { Button } from "@/components/ui/Button"; 
import ToolLayout from '@/components/ToolLayout'
import { Toaster, toast } from 'react-hot-toast';

export default function HsvToRgb() {
  const [hue, setHue] = useState<string>('');
  const [saturation, setSaturation] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [rgbValue, setRgbValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const hsvToRgb = (h: number, s: number, v: number) => {
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    
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

    const red = Math.round((r + m) * 255);
    const green = Math.round((g + m) * 255);
    const blue = Math.round((b + m) * 255);

    return { red, green, blue };
  };

  const handleConvert = () => {
    setError('');

    // Validate HSV values
    const h = parseFloat(hue);
    const s = parseFloat(saturation);
    const v = parseFloat(value);

    if (isNaN(h) || h < 0 || h >= 360) {
      setError('Please enter a valid Hue value (0-359).');
      toast.error('Invalid Hue value');
      return;
    }

    if (isNaN(s) || s < 0 || s > 100) {
      setError('Please enter a valid Saturation value (0-100).');
      toast.error('Invalid Saturation value');
      return;
    }

    if (isNaN(v) || v < 0 || v > 100) {
      setError('Please enter a valid Value/Brightness value (0-100).');
      toast.error('Invalid Value/Brightness');
      return;
    }

    // Convert HSV to RGB
    const { red, green, blue } = hsvToRgb(h, s, v);
    setRgbValue(`rgb(${red}, ${green}, ${blue})`);
    toast.success('Conversion successful!');
  };

  return (
    <ToolLayout
      title="HSV to RGB Converter"
      description="Convert HSV Color Codes to RGB"
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mb-8 mx-auto">
        <div className="grid grid-cols-1 gap-4 mb-6">
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
              Value/Brightness (0-100)
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

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About HSV to RGB Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The HSV to RGB Converter is a powerful tool designed for artists, designers, and developers looking to convert HSV (Hue, Saturation, Value) color values into RGB (Red, Green, Blue) format. This conversion is essential in various applications, including digital art, web design, and graphic design, as RGB values are the standard for representing colors in most digital media.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use HSV to RGB Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Input your desired HSV values in the respective fields (Hue: 0-359, Saturation: 0-100, Value: 0-100).</li>
          <li>Click the "Convert" button to obtain the corresponding RGB values.</li>
          <li>View the resulting RGB color code along with a visual preview of the color.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>User-friendly interface for converting HSV values to RGB.</li>
          <li>Real-time validation of input values to prevent errors.</li>
          <li>Displays the RGB output alongside a color preview for visual confirmation.</li>
          <li>Error alerts for invalid input values, ensuring a smooth user experience.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Ensure the Hue value is within the range of 0 to 359 for valid conversions.</li>
          <li>Use the RGB values in your web projects for precise color representation.</li>
          <li>Experiment with different HSV values to discover a wide range of RGB outputs.</li>
        </ul>
      </div>
    </ToolLayout>
  );
}