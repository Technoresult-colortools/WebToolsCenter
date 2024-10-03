'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { Copy, Shuffle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function mixColors(color1: string, color2: string, weight: number = 0.5) {
  const w1 = weight;
  const w2 = 1 - w1;
  const rgb1 = parseInt(color1.slice(1), 16);
  const rgb2 = parseInt(color2.slice(1), 16);
  const r1 = (rgb1 >> 16) & 255;
  const g1 = (rgb1 >> 8) & 255;
  const b1 = rgb1 & 255;
  const r2 = (rgb2 >> 16) & 255;
  const g2 = (rgb2 >> 8) & 255;
  const b2 = rgb2 & 255;
  const r = Math.round(r1 * w1 + r2 * w2);
  const g = Math.round(g1 * w1 + g2 * w2);
  const b = Math.round(b1 * w1 + b2 * w2);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function generateShades(startColor: string, endColor: string, steps: number) {
  const shades = [];
  for (let i = 0; i < steps; i++) {
    const weight = i / (steps - 1);
    shades.push(mixColors(startColor, endColor, weight));
  }
  return shades;
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s; 
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorMixer() {
  const [color1, setColor1] = useState("#c04d4d");
  const [color2, setColor2] = useState("#54bb92");
  const [steps, setSteps] = useState(5);
  const [mixedColors, setMixedColors] = useState<string[]>([]);

  const handleMixColors = useCallback(() => {
    setMixedColors(generateShades(color1, color2, steps));
  }, [color1, color2, steps]);

  const handleReset = () => {
    setColor1("#c04d4d");
    setColor2("#54bb92");
    setSteps(5);
    setMixedColors([]);
  };


  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard`);
  };

  const handleRandomColors = () => {
    setColor1(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    setColor2(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  };

  useEffect(() => {
    handleMixColors();
  }, [handleMixColors]);  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Color Mixer</h1>

        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
          <div className="grid grid-cols gap-6 mb-6">
          <div className="mb-6">
              <label htmlFor="color-picker-1" className="block text-lg font-medium text-gray-200 mb-2">
                Start Color:
              </label>
              <div className="flex items-center">
                <Input
                  id="color-input-1"
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="flex-grow mr-2 bg-gray-700 text-white border-gray-600"
                />
                <input
                  id="color-picker-1"
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-10 h-10 p-1 rounded"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="color-picker-2" className="block text-lg font-medium text-gray-200 mb-2">
                End Color:
              </label>
              <div className="flex items-center">
                <Input
                  id="color-input-2"
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="flex-grow mr-2 bg-gray-700 text-white border-gray-600"
                />
                <input
                  id="color-picker-2"
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-10 h-10 p-1 rounded"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="steps" className="block text-sm font-medium text-gray-300 mb-2">
              Steps: {steps}
            </label>
            <Slider
              id="steps"
              min={2}
              max={10}
              step={1}
              value={steps}  // `steps` is a number
              onChange={(value) => setSteps(value)}  // `value` is passed as a number
              className="w-full"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white">
              Reset
            </Button>
            <Button onClick={handleRandomColors} className="bg-green-600 hover:bg-green-700 text-white">
              <Shuffle className="h-5 w-5 mr-2" />
              Random Colors
            </Button>
          </div>
        </div>

        {mixedColors.length > 0 && (
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 mt-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">Mixed Colors</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {mixedColors.map((color, index) => (
                <div key={index} className="bg-gray-700 shadow-md rounded-lg p-4">
                  <div
                    className="w-full h-20 rounded-lg mb-2 relative group"
                    style={{ backgroundColor: color }}
                  >
                    <Button
                      onClick={() => handleCopyColor(color)}
                      className="absolute top-1 right-1 bg-white/10 hover:bg-white/20 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-white">Hex: {color}</p>
                    <p className="text-white">RGB: {hexToRgb(color)}</p>
                    <p className="text-white">HSL: {hexToHsl(color)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          <div className="bg-gray-800 shadow-lg rounded-lg p-8 mt-4 max-w-4xl mx-auto">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-2">About Color Mixer</h2>
                <p className="text-white">
                  The Color Mixer is an interactive tool designed for artists, designers, and color enthusiasts to create beautiful color blends. By mixing two different colors, users can generate a palette of intermediate shades that can be used in various design projects, from graphic design to interior decor.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2">How to Use Color Mixer?</h2>
                <ol className="list-decimal list-inside text-white space-y-2">
                  <li>Select a starting color and an ending color using the color picker or by entering hex values.</li>
                  <li>Adjust the number of steps to define how many blended colors you want to generate.</li>
                  <li>Click "Mix Colors" to view the resulting shades.</li>
                  <li>Copy any of the generated colors to your clipboard for easy use in your projects.</li>
                  <li>Reset the selections or generate random colors for more mixing options.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2">Key Features</h2>
                <ul className="list-disc list-inside text-white space-y-2">
                  <li>Dynamic color mixing with real-time updates.</li>
                  <li>Easy-to-use interface with color picker and hex input.</li>
                  <li>Generate shades between two colors based on user-defined steps.</li>
                  <li>Option to copy colors directly to the clipboard.</li>
                  <li>Random color generation for creative inspiration.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2">Tips and Tricks</h2>
                <ul className="list-disc list-inside text-white space-y-2">
                  <li>Experiment with different color combinations to discover unique blends.</li>
                  <li>Use the color shades in web design or artwork for a cohesive look.</li>
                  <li>Mix complementary colors for striking contrasts in your designs.</li>
                </ul>
              </section>
            </div>
          </div>

      </main>
      <Footer />
    </div>
  );
}