'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { Copy, RefreshCw, Download, Shuffle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function generateRandomColor(): string {
  return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
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

function generateHarmony(baseColor: string, harmonyType: string): string[] {
  const hue = parseInt(hexToHsl(baseColor).split(',')[0].split('(')[1]);
  const harmony: string[] = [baseColor];

  switch (harmonyType) {
    case 'complementary':
      harmony.push(`hsl(${(hue + 180) % 360}, 100%, 50%)`);
      break;
    case 'analogous':
      harmony.push(`hsl(${(hue + 30) % 360}, 100%, 50%)`);
      harmony.push(`hsl(${(hue - 30 + 360) % 360}, 100%, 50%)`);
      break;
    case 'triadic':
      harmony.push(`hsl(${(hue + 120) % 360}, 100%, 50%)`);
      harmony.push(`hsl(${(hue + 240) % 360}, 100%, 50%)`);
      break;
    case 'tetradic':
      harmony.push(`hsl(${(hue + 90) % 360}, 100%, 50%)`);
      harmony.push(`hsl(${(hue + 180) % 360}, 100%, 50%)`);
      harmony.push(`hsl(${(hue + 270) % 360}, 100%, 50%)`);
      break;
  }

  return harmony.map(color => {
    if (color.startsWith('hsl')) {
      const [h, s, l] = color.match(/\d+/g)!.map(Number);
      return `#${Math.floor(hslToRgb(h/360, s/100, l/100)).toString(16).padStart(6, '0')}`;
    }
    return color;
  });
}

function hslToRgb(h: number, s: number, l: number): number {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return (Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255);
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#000000');
  const [colorCount, setColorCount] = useState(5);
  const [palette, setPalette] = useState<string[]>([]);
  const [harmonyType, setHarmonyType] = useState('complementary');

  useEffect(() => {
    generatePalette();
  }, [baseColor, colorCount, harmonyType]);

  const generatePalette = () => {
    let newPalette: string[];
    if (harmonyType === 'random') {
      newPalette = Array(colorCount).fill(null).map(() => generateRandomColor());
    } else {
      newPalette = generateHarmony(baseColor, harmonyType);
      while (newPalette.length < colorCount) {
        newPalette.push(generateRandomColor());
      }
    }
    setPalette(newPalette.slice(0, colorCount));
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard`);
  };

  const handleDownloadPalette = () => {
    const paletteText = palette.join('\n');
    const blob = new Blob([paletteText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color_palette.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Palette downloaded successfully');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Color Palette Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <label htmlFor="base-color" className="block text-lg font-medium text-gray-200 mb-2">
              Base Color:
            </label>
            <div className="flex items-center">
              <Input
                id="base-color"
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-12 h-12 p-1 mr-4"
              />
              <Input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="harmony-type" className="block text-lg font-medium text-gray-200 mb-2">
              Harmony Type:
            </label>
            <select
              id="harmony-type"
              value={harmonyType}
              onChange={(e) => setHarmonyType(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
            >
              <option value="complementary">Complementary</option>
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="tetradic">Tetradic</option>
              <option value="random">Random</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="color-count" className="block text-lg font-medium text-gray-200 mb-2">
              Number of colors: {colorCount}
            </label>
            <Slider
              id="color-count"
              min={2}
              max={10}
              step={1}
              value={colorCount}
              onChange={(value) => setColorCount(value)}
              className="w-full"
            />
          </div>

          <Button
            onClick={generatePalette}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <Shuffle className="h-5 w-5 mr-2" />
            Generate Palette
          </Button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Generated Palette</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {palette.map((color, index) => (
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
          <div className="mt-6 flex justify-center space-x-4">
            <Button onClick={generatePalette} className="bg-green-600 hover:bg-green-700 text-white">
              <RefreshCw className="h-5 w-5 mr-2" />
              Regenerate
            </Button>
            <Button onClick={handleDownloadPalette} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download Palette
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Preview</h2>
          <div className="space-y-4">
            <div className="p-4 rounded" style={{ background: `linear-gradient(to right, ${palette.join(', ')})` }}>
              <h3 className="text-xl font-bold" style={{ color: palette[0] }}>Gradient Background</h3>
              <p className="text-lg" style={{ color: palette[1] }}>This is how your palette looks as a gradient.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded" style={{ backgroundColor: palette[0] }}>
                <h3 className="text-xl font-bold" style={{ color: palette[1] }}>Color Combination 1</h3>
                <p className="text-lg" style={{ color: palette[2] }}>Text example with different colors.</p>
              </div>
              <div className="p-4 rounded" style={{ backgroundColor: palette[3] }}>
                <h3 className="text-xl font-bold" style={{ color: palette[4] }}>Color Combination 2</h3>
                <p className="text-lg" style={{ color: palette[0] }}>Another text example with different colors.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">About Color Palette Generator</h2>
              <p className="text-white">
                This tool helps you create harmonious color palettes for your design projects. You can generate palettes based on color theory or create completely random combinations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <ul className="text-white list-disc list-inside">
                <li>Choose a base color using the color picker.</li>
                <li>Select a harmony type (complementary, analogous, etc.).</li>
                <li>Adjust the number of colors in your palette.</li>
                <li>Click "Generate Palette" to create your color scheme.</li>
                <li>Use the preview section to see how your colors work together.</li>
                <li>Copy individual colors or download the entire palette.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Tips</h2>
              <ul className="text-white list-disc list-inside">
                <li>Experiment with different harmony types to find the perfect combination.</li>
                <li>Use the preview section to see how your colors look in a real design context.</li>
                <li>Try adjusting the base color slightly to fine-tune your palette.</li>
                <li>Don't be afraid to regenerate – sometimes it takes a few tries to find the perfect palette!</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}