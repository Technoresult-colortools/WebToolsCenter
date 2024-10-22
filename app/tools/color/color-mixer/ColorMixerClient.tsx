'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Shuffle, Info, BookOpen, Lightbulb, AlertCircle, Star, RotateCcw } from 'lucide-react';
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster, toast } from 'react-hot-toast';
import ToolLayout from '@/components/ToolLayout'

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

function hexToCmyk(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
}

export default function ColorMixer() {
  const [color1, setColor1] = useState("#4285F4");
  const [color2, setColor2] = useState("#34A853");
  const [steps, setSteps] = useState(5);
  const [mixedColors, setMixedColors] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [blendMode, setBlendMode] = useState<'linear' | 'radial'>('linear');

  const handleMixColors = useCallback(() => {
    setError('');
    if (!/^#[0-9A-Fa-f]{6}$/.test(color1) || !/^#[0-9A-Fa-f]{6}$/.test(color2)) {
      setError('Please enter valid hex color codes.');
      toast.error('Invalid hex color codes');
      return;
    }
    setMixedColors(generateShades(color1, color2, steps));
    toast.success('Colors mixed successfully!');
  }, [color1, color2, steps]);

  const handleReset = () => {
    setColor1("#4285F4");
    setColor2("#34A853");
    setSteps(5);
    setMixedColors([]);
    setError('');
    toast.success('Reset to default values');
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard`);
  };

  const handleRandomColors = () => {
    setColor1(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
    setColor2(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
    toast.success('Random colors generated');
  };

  const handlePopularMix = () => {
    setColor1("#4285F4"); // Google Blue
    setColor2("#34A853"); // Google Green
    toast.success('Popular color mix applied');
  };

  useEffect(() => {
    handleMixColors();
  }, [handleMixColors]);

  return (
    <ToolLayout
      title="Advanced Color Mixer"
      description="Mix colors, generate shades, and explore different color formats"
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 p-4 sm:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
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

          <div>
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
            max={20}
            step={1}
            value={steps}
            onChange={(value) => setSteps(value)}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Blend Mode:
          </label>
          <div className="flex space-x-4">
            <Button
              onClick={() => setBlendMode('linear')}
              className={`${blendMode === 'linear' ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700 text-white`}
            >
              Linear
            </Button>
            <Button
              onClick={() => setBlendMode('radial')}
              className={`${blendMode === 'radial' ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700 text-white`}
            >
              Radial
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white">
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
          <Button onClick={handleRandomColors} className="bg-green-600 hover:bg-green-700 text-white">
            <Shuffle className="h-5 w-5 mr-2" />
            Random
          </Button>
          <Button onClick={handlePopularMix} className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <Star className="h-5 w-5 mr-2" />
            Popular
          </Button>
          <Button onClick={handleMixColors} className="bg-blue-600 hover:bg-blue-700 text-white">
            Mix Colors
          </Button>
        </div>

        {error && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {mixedColors.length > 0 && (
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-8 mt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4">Mixed Colors</h2>
          <div 
            className={`w-full h-40 rounded-lg mb-6 ${blendMode === 'linear' ? 'bg-gradient-to-r' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]'}`}
            style={{
              backgroundImage: `${blendMode === 'linear' ? 'linear-gradient' : 'radial-gradient'}(${mixedColors.join(',')})`
            }}
          ></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                <div className="space-y-1 text-xs">
                  <p className="text-white">Hex: {color}</p>
                  <p className="text-white">RGB: {hexToRgb(color)}</p>
                  <p className="text-white">HSL: {hexToHsl(color)}</p>
                  <p className="text-white">CMYK: {hexToCmyk(color)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-8 mt-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Advanced Color Mixer
            </h2>
            <p className="text-white">
              The Advanced Color Mixer is a powerful tool for designers, artists, and color enthusiasts. It allows you to create beautiful color blends, generate custom palettes, and explore different color formats. 
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Advanced Color Mixer
            </h2>
            <ol className="list-decimal list-inside text-white space-y-2">
              <li>Choose your start and end colors using the color pickers or by entering hex values.</li>
              <li>Adjust the number of steps to control the granularity of your color blend.</li>
              <li>Select between linear and radial blending modes for different effects.</li>
              <li>Click "Mix Colors" to generate your custom color palette.</li>
              <li>Explore the resulting colors in various formats (HEX, RGB, HSL, CMYK).</li>
              <li>Copy any color to your clipboard for easy use in your projects.</li>
              <li>Use the "Random Colors" or "Popular Mix" features for inspiration.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-white space-y-2">
              <li>Dynamic color mixing with real-time updates.</li>
              <li>Linear and radial blending modes for versatile color combinations.</li>
              <li>Support for multiple color formats (HEX, RGB, HSL, CMYK).</li>
              <li>Adjustable number of steps for precise color control.</li>
              <li>Random color generation and popular color mix options.</li>
              <li>Easy color copying with toast notifications.</li>
              <li>Responsive design for use on various devices.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-white space-y-2">
              <li>Use complementary colors for striking contrasts in your designs.</li>
              <li>Experiment with different step counts to find the perfect gradient.</li>
              <li>Try both linear and radial blending for varied effects in your projects.</li>
              <li>Use the random color feature to discover unexpected color combinations.</li>
              <li>Start with the popular mix and adjust from there for professional-looking results.</li>
            </ul>
          </section>
        </div>
      </div>
    </ToolLayout>
  );
}