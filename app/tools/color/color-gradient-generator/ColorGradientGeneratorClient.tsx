'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import Slider from "@/components/ui/Slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Plus, Minus, RotateCcw, Shuffle, Info, BookOpen, Lightbulb } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ToolLayout from '@/components/ToolLayout'

type GradientType = 'linear' | 'radial' | 'conic';
type ColorStop = { color: string; position: number };

export default function GradientGeneratorPage() {
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#833ab4', position: 20 },
    { color: '#fd1d1d', position: 49 },
    { color: '#fcb045', position: 78 },
  ]);
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(45);
  const [repeating, setRepeating] = useState(false);
  const [cssCode, setCssCode] = useState('');
  const [activeTab, setActiveTab] = useState<'gradient' | 'css'>('gradient');

  const generateCssCode = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');

    let gradientString = '';
    if (gradientType === 'linear') {
      gradientString = `${repeating ? 'repeating-' : ''}linear-gradient(${angle}deg, ${stopsString})`;
    } else if (gradientType === 'radial') {
      gradientString = `${repeating ? 'repeating-' : ''}radial-gradient(circle, ${stopsString})`;
    } else if (gradientType === 'conic') {
      gradientString = `${repeating ? 'repeating-' : ''}conic-gradient(from ${angle}deg, ${stopsString})`;
    }

    setCssCode(`background: ${gradientString};`);
  }, [stops, gradientType, angle, repeating]);

  useEffect(() => {
    generateCssCode();
  }, [generateCssCode]);

  const addStop = () => {
    if (stops.length < 5) {
      const newColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
      setStops([...stops, { color: newColor, position: 50 }]);
    } else {
      toast.error('Maximum 5 color stops allowed');
    }
  };

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      setStops(stops.filter((_, i) => i !== index));
    } else {
      toast.error('Minimum 2 color stops required');
    }
  };

  const updateStop = (index: number, color: string, position: number) => {
    const newStops = [...stops];
    newStops[index] = { color, position };
    setStops(newStops);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success('CSS code copied to clipboard');
  };

  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let gradient: CanvasGradient | null = null;
      if (gradientType === 'linear') {
        gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
      } else if (gradientType === 'radial') {
        gradient = ctx.createRadialGradient(500, 500, 0, 500, 500, 500);
      } else {
        gradient = ctx.createConicGradient(angle * Math.PI / 180, 500, 500);
      }
      if (gradient) {
        stops.forEach(stop => gradient!.addColorStop(stop.position / 100, stop.color));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1000, 1000);
        
        const link = document.createElement('a');
        link.download = 'gradient.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const resetGradient = () => {
    setStops([
      { color: '#833ab4', position: 20 },
      { color: '#fd1d1d', position: 49 },
      { color: '#fcb045', position: 78 },
    ]);
    setGradientType('linear');
    setAngle(45);
    setRepeating(false);
  };

  const generateRandomGradient = () => {
    const randomStops = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => ({
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      position: Math.floor(Math.random() * 101),
    }));
    setStops(randomStops);
    setGradientType(['linear', 'radial', 'conic'][Math.floor(Math.random() * 3)] as GradientType);
    setAngle(Math.floor(Math.random() * 361));
    setRepeating(Math.random() > 0.5);
  };

  return (
    <ToolLayout
      title="Color Gradient Generator"
      description="Create custom CSS gradients with ease"
    >

      <Toaster position="top-right" />

          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-4 max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'gradient' | 'css')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="gradient">Gradient</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
              </TabsList>
              <TabsContent value="gradient">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-4">Gradient Preview</h2>
                    <div 
                      className="w-full h-64 rounded-lg mb-4"
                      style={{ background: cssCode ? cssCode.split(': ')[1]?.slice(0, -1) || '' : '' }}
                    />

                    <div className="space-y-4 ">
                      <div>
                        <div className='mb-2'><Label htmlFor="gradient-type" className="text-white">Gradient Type</Label></div>   
                        <Select onValueChange={(value: GradientType) => setGradientType(value)} value={gradientType}>
                          <SelectTrigger id="gradient-type" className="bg-gray-700 text-white border-gray-600">
                            <SelectValue placeholder="Select gradient type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 text-white border-gray-600">
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                            <SelectItem value="conic">Conic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {gradientType !== 'radial' && (
                        <div>
                          <div className='mb-2'><Label htmlFor="angle-slider" className="mb-2 text-white">Angle: {angle}°</Label></div>
                          <Slider
                            id="angle-slider"
                            min={0}
                            max={360}
                            step={1}
                            value={angle}
                            onChange={(value) => setAngle(value)}
                          />
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="repeating"
                          checked={repeating}
                          onCheckedChange={setRepeating}
                        />
                        <Label htmlFor="repeating" className="text-white">Repeating Gradient</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-4">Color Stops</h2>
                    {stops.map((stop, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-4">
                        <Input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateStop(index, e.target.value, stop.position)}
                          className="w-12 h-12 p-1 rounded"
                        />
                        <Input
                          type="text"
                          value={stop.color}
                          onChange={(e) => updateStop(index, e.target.value, stop.position)}
                          className="w-24 bg-gray-700 text-white"
                        />
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={stop.position}
                          onChange={(value) => updateStop(index, stop.color, value)}
                          className="w-full"
                        />
                        <Button onClick={() => removeStop(index)} size="sm" variant="destructive">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addStop} className="w-full mb-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Color Stop
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="css">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="css-code" className="text-white">CSS Code</Label>
                    <div className="flex items-center">
                      <Input
                        id="css-code"
                        value={cssCode}
                        readOnly
                        className="flex-grow bg-gray-700 text-white"
                      />
                      <Button onClick={handleCopyCode} className="ml-2" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
              <Button onClick={handleDownloadImage} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button onClick={resetGradient} variant="destructive" className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={generateRandomGradient} className="flex-1">
                <Shuffle className="h-4 w-4 mr-2" />
                Random
              </Button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Color Gradient Generator
            </h2>
            <p className="text-gray-300 mb-4">
              The Color Gradient Generator is a powerful tool that allows you to create custom CSS gradients with ease. Whether you're a web designer, developer, or just someone who loves playing with colors, this tool provides an intuitive interface to generate beautiful linear, radial, and conic gradients.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Choose a gradient type: linear, radial, or conic.</li>
              <li>Adjust the angle for linear and conic gradients using the slider.</li>
              <li>Toggle the "Repeating Gradient" switch for a repeating pattern.</li>
              <li>Add or remove color stops (minimum 2, maximum 5) using the "+" and "-" buttons.</li>
              <li>Adjust each color stop's color using the color picker or by entering a hex code.</li>
              <li>Fine-tune the position of each color stop using the sliders.</li>
              <li>Copy the generated CSS code or download the gradient as a PNG image.</li>
              <li>Use the Reset button to start over with default settings.</li>
              <li>Try the Random button to generate unexpected color combinations.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Support for linear, radial, and conic gradients.</li>
              <li>Up to 5 color stops for complex gradients.</li>
              <li>Angle adjustment for linear and conic gradients.</li>
              <li>Repeating gradient option.</li>
              <li>Real-time CSS code generation.</li>
              <li>One-click CSS code copying.</li>
              <li>PNG export functionality.</li>
              <li>Random gradient generation.</li>
              <li>Mobile-responsive design.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Experiment with different gradient types to achieve unique effects.</li>
              <li>Use the repeating gradient option to create patterns.</li>
              <li>Try combining multiple gradients in your CSS for more complex backgrounds.</li>
              <li>Use the random button for inspiration when you're stuck.</li>
              <li>Adjust color stop positions to create smooth or abrupt color transitions.</li>
              <li>For web design, copy the CSS code directly into your stylesheet.</li>
              <li>Download PNG images for use in graphic design projects or presentations.</li>
              <li>Use conic gradients for creating pie charts or circular progress indicators.</li>
              <li>Explore color theory to create harmonious color combinations.</li>
            </ul>
          </div>
  </ToolLayout>
  );
}