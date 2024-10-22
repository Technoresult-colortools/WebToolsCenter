'use client'

import React, { useState } from 'react';
import { RefreshCw, Copy, Info, BookOpen, Lightbulb, AlertCircle } from 'lucide-react';
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToolLayout from '@/components/ToolLayout'

const apiUrl = 'https://www.thecolorapi.com/id?';

export default function ColorNameGenerator() {
  const [colorValue, setColorValue] = useState('');
  const [colorName, setColorName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [error, setError] = useState('');
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return rgbToHex(r, g, b);
  };

  const fetchColorName = async (hex: string) => {
    try {
      const response = await fetch(`${apiUrl}hex=${hex}`);
      const data = await response.json();
      return data.name.value;
    } catch (error) {
      console.error('Error fetching color name:', error);
      return 'Error fetching color name';
    }
  };

  const handleGenerateColorName = async () => {
    setError('');
    let hex = '';

    if (colorFormat === 'hex' && /^#([0-9A-F]{3}){1,2}$/i.test(colorValue)) {
      hex = colorValue.replace('#', '');
      setBackgroundColor(hexToRgb(colorValue));
    } else if (colorFormat === 'rgb' && /^rgb$$\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}\s*$$$/i.test(colorValue)) {
      const rgbValues = colorValue.match(/\d+/g)!.map(Number);
      hex = rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]).replace('#', '');
      setBackgroundColor(colorValue);
    } else if (colorFormat === 'hsl' && /^hsl$$\s*\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\s*$$$/i.test(colorValue)) {
      const hslValues = colorValue.match(/\d+/g)!.map(Number);
      hex = hslToHex(hslValues[0], hslValues[1], hslValues[2]).replace('#', '');
      setBackgroundColor(hslToHex(hslValues[0], hslValues[1], hslValues[2]));
    } else {
      setError(`Please enter a valid ${colorFormat.toUpperCase()} color value.`);
      return;
    }

    const name = await fetchColorName(hex);
    setColorName(name);
  };

  const handleCopyColor = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied ${value} to clipboard`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const getPlaceholder = () => {
    switch (colorFormat) {
      case 'hex':
        return '#FFFFFF';
      case 'rgb':
        return 'rgb(255, 255, 255)';
      case 'hsl':
        return 'hsl(0, 100%, 100%)';
    }
  };

  return (
    <ToolLayout
      title="Color Name Generator"
      description="Discover the names of colors using HEX, RGB, or HSL values"
    >
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <Tabs value={colorFormat} onValueChange={(value) => setColorFormat(value as 'hex' | 'rgb' | 'hsl')}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="hex">HEX</TabsTrigger>
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
              </TabsList>
              <TabsContent value="hex">
                <Input
                  type="text"
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  className="mb-4 w-full text-gray-600"
                  placeholder={getPlaceholder()}
                />
              </TabsContent>
              <TabsContent value="rgb">
                <Input
                  type="text-grey"
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  className="mb-4 w-full text-gray-600"
                  placeholder={getPlaceholder()}
                />
              </TabsContent>
              <TabsContent value="hsl">
                <Input
                  type="text"
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  className="mb-4 w-full text-gray-600"
                  placeholder={getPlaceholder()}
                />
              </TabsContent>
            </Tabs>

            <Button onClick={handleGenerateColorName} className="w-full mb-4">
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Color Name
            </Button>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {colorName && (
              <div className="bg-gray-700 rounded-lg p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Color Name:</h4>
                  <span className="text-xl font-bold text-blue-400">{colorName}</span>
                </div>
                <div
                  className="w-full h-24 rounded-md shadow-md mb-4"
                  style={{ backgroundColor: backgroundColor }}
                ></div>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => handleCopyColor(colorValue)} variant="default" className="w-full">
                    <Copy className="mr-2 h-4 w-4" /> Copy {colorFormat.toUpperCase()}
                  </Button>
                  <Button onClick={() => handleCopyColor(colorName)} variant="default" className="w-full">
                    <Copy className="mr-2 h-4 w-4" /> Copy Name
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 shadow-lg rounded-lg p-8 mt-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                  <Info className="w-6 h-6 mr-2" />
                  About Color Name Generator
                </h2>
                <p className="text-white">
                  The Color Name Generator is a versatile tool that allows users to input color values in HEX, RGB, or HSL formats and obtain the corresponding color name. This tool is especially useful for designers, developers, and artists looking to identify and use specific colors in their projects.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  How to Use Color Name Generator
                </h2>
                <ol className="list-decimal list-inside text-white space-y-2">
                  <li>Select the color format (HEX, RGB, or HSL) using the tabs.</li>
                  <li>Enter a valid color value in the selected format.</li>
                  <li>Click the "Generate Color Name" button to retrieve the name of the color.</li>
                  <li>View the color name, preview, and use the copy buttons for easy access to the values.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2" />
                  Key Features
                </h2>
                <ul className="list-disc list-inside text-white space-y-2">
                  <li>Support for HEX, RGB, and HSL color formats.</li>
                  <li>Real-time color name retrieval using an external API.</li>
                  <li>Color preview based on the input value.</li>
                  <li>Easy-to-use copy functionality for color values and names.</li>
                  <li>Responsive design for use on various devices.</li>
                  <li>Error handling and user-friendly notifications.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2" />
                  Tips and Tricks
                </h2>
                <ul className="list-disc list-inside text-white space-y-2">
                  <li>Use the tabs to switch between different color formats for input.</li>
                  <li>Experiment with slight variations in color values to discover new color names.</li>
                  <li>Copy color names and values directly to your clipboard for use in design software or code.</li>
                  <li>Use this tool in combination with other color tools for a comprehensive color workflow.</li>
                </ul>
              </section>
            </div>
          </div>
      <ToastContainer />
    </ToolLayout>
  

  );
}