'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Slider from "@/components/ui/Slider";
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import { Copy, Download } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const colorHarmonies = [
  { name: 'Complementary', angle: 180 },
  { name: 'Analogous', angle: 30 },
  { name: 'Triadic', angle: 120 },
  { name: 'Split-Complementary', angle: 150 },
  { name: 'Square', angle: 90 },
];

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s=0; 
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function generateHarmony(baseColor: string, harmony: { name: string; angle: number }): string[] {
  const [h, s, l] = hexToHsl(baseColor);
  const colors = [baseColor];

  switch (harmony.name) {
    case 'Complementary':
      colors.push(hslToHex((h + 180) % 360, s, l));
      break;
    case 'Analogous':
      colors.push(hslToHex((h + 30) % 360, s, l));
      colors.push(hslToHex((h - 30 + 360) % 360, s, l));
      break;
    case 'Triadic':
      colors.push(hslToHex((h + 120) % 360, s, l));
      colors.push(hslToHex((h + 240) % 360, s, l));
      break;
    case 'Split-Complementary':
      colors.push(hslToHex((h + 150) % 360, s, l));
      colors.push(hslToHex((h + 210) % 360, s, l));
      break;
    case 'Square':
      colors.push(hslToHex((h + 90) % 360, s, l));
      colors.push(hslToHex((h + 180) % 360, s, l));
      colors.push(hslToHex((h + 270) % 360, s, l));
      break;
  }

  return colors;
}

export default function ColorWheel() {
  const [baseColor, setBaseColor] = useState('#ff0000');
  const [selectedHarmony, setSelectedHarmony] = useState(colorHarmonies[0]);
  const [harmonyColors, setHarmonyColors] = useState<string[]>([]);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    setHarmonyColors(generateHarmony(baseColor, selectedHarmony));
  }, [baseColor, selectedHarmony]);

  useEffect(() => {
    setBaseColor(hslToHex(hue, saturation, lightness));
  }, [hue, saturation, lightness]);

  const handleColorSelection = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left - centerX;
      const y = clientY - rect.top - centerY;

      const angle = Math.atan2(y, x);
      const distance = Math.sqrt(x * x + y * y);
      const radius = rect.width / 2;

      const newHue = ((angle + Math.PI) / (2 * Math.PI)) * 360;
      const newSaturation = Math.min((distance / radius) * 100, 100);

      setHue(newHue);
      setSaturation(newSaturation);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    handleColorSelection(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      handleColorSelection(e);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleColorSelection(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleColorSelection(e);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      setBaseColor(newColor);
      const [h, s, l] = hexToHsl(newColor);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard`);
  };

  const handleDownloadPalette = () => {
    const paletteText = harmonyColors.join('\n');
    const blob = new Blob([paletteText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color_harmony_palette.txt';
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
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Color Wheel</h1>

        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-4">Color Wheel</h2>
              <div 
                ref={wheelRef}
                className="relative w-64 h-64 md:w-96 md:h-96 mx-auto cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="w-full h-full"
                    style={{
                      background: `conic-gradient(
                        hsl(0, 100%, 50%),
                        hsl(60, 100%, 50%),
                        hsl(120, 100%, 50%),
                        hsl(180, 100%, 50%),
                        hsl(240, 100%, 50%),
                        hsl(300, 100%, 50%),
                        hsl(360, 100%, 50%)
                      )`,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
                    }}
                  />
                </div>
                {harmonyColors.map((color, index) => {
                  const [h, s] = hexToHsl(color);
                  const angle = (h * Math.PI) / 180;
                  const distance = (s / 100) * 48;
                  const x = Math.cos(angle) * distance + 50;
                  const y = Math.sin(angle) * distance + 50;
                  return (
                    <div
                      key={index}
                      className={`absolute w-6 h-6 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 ${index === 0 ? 'cursor-move' : ''}`}
                      style={{
                        backgroundColor: color,
                        borderColor: index === 0 ? 'white' : 'rgba(255,255,255,0.5)',
                        top: `${y}%`,
                        left: `${x}%`,
                        zIndex: index === 0 ? 10 : 1,
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-4">Color Controls</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="hue-slider" className="block text-sm font-medium text-gray-300 mb-1">
                    Hue: {Math.round(hue)}°
                  </label>
                  <Slider
                    id="hue-slider"
                    min={0}
                    max={360}
                    step={1}
                    value={hue}
                    onChange={(value) => setHue(value)}
                  />
                </div>
                <div>
                  <label htmlFor="saturation-slider" className="block text-sm font-medium text-gray-300 mb-1">
                    Saturation: {Math.round(saturation)}%
                  </label>
                  <Slider
                    id="saturation-slider"
                    min={0}
                    max={100}
                    step={1}
                    value={saturation}
                    onChange={(value) => setSaturation(value)}
                  />
                </div>
                <div>
                  <label htmlFor="lightness-slider" className="block text-sm font-medium text-gray-300 mb-1">
                    Lightness: {Math.round(lightness)}%
                  </label>
                  <Slider
                    id="lightness-slider"
                    min={0}
                    max={100}
                    step={1}
                    value={lightness}
                    onChange={(value) => setLightness(value)}
                  />
                </div>
                <div>
                  <label htmlFor="hex-input" className="block text-sm font-medium text-gray-300 mb-1">
                    Hex Color
                  </label>
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-l-md border-r border-gray-600"
                      style={{ backgroundColor: baseColor }}
                    />
                    <Input
                      id="hex-input"
                      type="text"
                      value={baseColor}
                      onChange={handleHexChange}
                      className="rounded-l-none bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Color Harmony</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {colorHarmonies.map((harmony) => (
                <Button
                  key={harmony.name}
                  onClick={() => setSelectedHarmony(harmony)}
                  variant={selectedHarmony.name === harmony.name ? "default" : "secondary"}
                >
                  {harmony.name}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {harmonyColors.map((color, index) => (
                <div key={index} className="flex-1 min-w-[100px]">
                  <div
                    className="w-full h-20 rounded-lg mb-2 relative group"
                    style={{ backgroundColor: color }}
                  >
                    <Button
                      onClick={() => handleCopyColor(color)}
                      className="absolute top-1 right-1 bg-white/10 hover:bg-white/20 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      size="sm"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-white text-center">{color}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={handleDownloadPalette} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download Palette
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">About Color Wheel Theory</h2>
              <p className="text-white">
                Color Wheel Theory is a fundamental concept in color design that helps create harmonious color combinations. This tool allows you to explore different color harmonies based on a selected base color.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <p className="text-white">
                1. Click and drag the base color dot (larger, white border) on the wheel to select a color.<br />
                2. Use the sliders to fine-tune the hue, saturation, and lightness.<br />
                3. Choose a color harmony to see complementary colors.<br />
                4. Copy individual colors or download the entire palette.<br />
                5. Experiment with different combinations to find the perfect color scheme.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Color Harmonies</h2>
              <p className="text-white">
                - Complementary: Colors opposite each other on the color wheel.<br />
                - Analogous: Colors adjacent to each other on the color wheel.<br />
                - Triadic: Three colors evenly spaced around the color wheel.<br />
                - Split-Complementary: A base color and two colors adjacent to its complement.<br />
                - Square: Four colors evenly spaced around the color wheel.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}