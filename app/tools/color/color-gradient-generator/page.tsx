'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {Button} from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {Label} from "@/components/ui/label";
import Slider from "@/components/ui/Slider";
import {Switch} from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Copy, Download, Plus, Minus, RotateCcw } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

type GradientType = 'linear' | 'radial' | 'conic';

export default function GradientGeneratorPage() {
  const [stops, setStops] = useState([
    { color: '#ff0000', position: 0 },
    { color: '#0000ff', position: 100 },
  ]);
  const [gradientType, setGradientType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const [repeating, setRepeating] = useState(false);
  const [cssCode, setCssCode] = useState('');

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
      const newColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
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
      const gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
      stops.forEach(stop => gradient.addColorStop(stop.position / 100, stop.color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1000, 1000);
      
      const link = document.createElement('a');
      link.download = 'gradient.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const resetGradient = () => {
    setStops([
      { color: '#ff0000', position: 0 },
      { color: '#0000ff', position: 100 },
    ]);
    setGradientType('linear');
    setAngle(90);
    setRepeating(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Gradient Generator</h1>

        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-4">Gradient Preview</h2>
              <div 
                className="w-full h-64 rounded-lg mb-4"
                style={{ background: cssCode ? cssCode.split(': ')[1]?.slice(0, -1) || '' : '' }}
              />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="gradient-type" className="text-white">Gradient Type</Label>
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
                    <Label htmlFor="angle-slider" className="text-white">Angle: {angle}°</Label>
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
                <div className="flex space-x-2">
                  <Button onClick={handleDownloadImage} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button onClick={resetGradient} variant="outline" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">About Gradient Generator</h2>
          <p className="text-white mb-4">
            This tool allows you to create custom CSS gradients easily. You can generate linear, radial, or conic gradients with multiple color stops.
          </p>
          <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
          <ol className="list-decimal list-inside text-white space-y-2">
            <li>Choose a gradient type: linear, radial, or conic.</li>
            <li>Adjust the angle for linear and conic gradients.</li>
            <li>Toggle the &quot;Repeating Gradient&quot; switch for a repeating pattern.</li>
            <li>Add or remove color stops (minimum 2, maximum 5).</li>
            <li>Adjust each color stop&apos;s color and position.</li>
            <li>Copy the generated CSS code or download the gradient as a PNG.</li>
            <li>Use the Reset button to start over with default settings.</li>
          </ol>
        </div>
      </main>
      <Toaster position="bottom-right" />
      <Footer />
    </div>
  );
}