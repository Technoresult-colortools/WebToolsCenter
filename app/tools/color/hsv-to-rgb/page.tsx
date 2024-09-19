'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Input from "@/components/ui/Input"; // Custom Input component
import {Button} from "@/components/ui/Button"; // Custom Button component

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
      return;
    }

    if (isNaN(s) || s < 0 || s > 100) {
      setError('Please enter a valid Saturation value (0-100).');
      return;
    }

    if (isNaN(v) || v < 0 || v > 100) {
      setError('Please enter a valid Value/Brightness value (0-100).');
      return;
    }

    // Convert HSV to RGB
    const { red, green, blue } = hsvToRgb(h, s, v);
    setRgbValue(`rgb(${red}, ${green}, ${blue})`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">HSV to RGB Converter</h1>

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

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About HSV to RGB Converter</h2>
              <p className="text-white">
                This tool allows you to convert HSV (Hue, Saturation, Value) color values to their RGB (Red, Green, Blue) equivalent.
                HSV is an alternative representation of the RGB color model, designed to more closely align with the way human vision perceives color-making attributes.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <p className="text-white">
                1. Enter a Hue value between 0 and 359 (represents the color).<br />
                2. Enter a Saturation value between 0 and 100 (represents the intensity of the color).<br />
                3. Enter a Value/Brightness value between 0 and 100 (represents the brightness of the color).<br />
                4. Click the &quot;Convert&quot; button to see the RGB equivalent and a color preview.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Tips</h2>
              <p className="text-white">
                - Hue is represented as a degree on the color wheel from 0 to 360. 0 is red, 120 is green, 240 is blue.<br />
                - Saturation is the intensity of the color from 0% (gray) to 100% (full color).<br />
                - Value/Brightness represents the brightness of the color from 0% (black) to 100% (full brightness).<br />
                - The resulting RGB values are in the range of 0-255 for each component.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}