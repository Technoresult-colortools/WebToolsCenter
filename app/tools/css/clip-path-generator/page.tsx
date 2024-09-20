'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Shape = 'circle' | 'ellipse' | 'inset' | 'polygon' | 'custom';

const shapes: Record<Shape, (width: number, height: number) => string> = {
  circle: (width, height) => `circle(${Math.min(width, height) / 2}px at 50% 50%)`,
  ellipse: (width, height) => `ellipse(${width / 2}px ${height / 2}px at 50% 50%)`,
  inset: () => `inset(10% 20% 30% 40% round 10px)`,
  polygon: () => `polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)`,
  custom: () => `polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)`,
};

const sampleImages = [
  '/placeholder.svg?height=400&width=600',
  '/placeholder.svg?height=400&width=600&text=Sample+2',
  '/placeholder.svg?height=400&width=600&text=Sample+3',
  '/placeholder.svg?height=400&width=600&text=Sample+4',
];

export default function ClipPathGenerator() {
  const [shape, setShape] = useState<Shape>('polygon');
  const [width, setWidth] = useState(575);
  const [height, setHeight] = useState(400);
  const [clipPath, setClipPath] = useState(shapes.polygon(width, height));
  const [customClipPath, setCustomClipPath] = useState('');
  const [imageUrl, setImageUrl] = useState(sampleImages[0]);
  const [showOutside, setShowOutside] = useState(true);
  const [hideGuides, setHideGuides] = useState(false);
  const [useCustomBackground, setUseCustomBackground] = useState(false);
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState('');
  const [outsideOpacity, setOutsideOpacity] = useState(50);

  useEffect(() => {
    if (shape === 'custom') {
      setClipPath(customClipPath);
    } else {
      setClipPath(shapes[shape](width, height));
    }
  }, [shape, width, height, customClipPath]);

  const handleShuffleImage = () => {
    const randomIndex = Math.floor(Math.random() * sampleImages.length);
    setImageUrl(sampleImages[randomIndex]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`clip-path: ${clipPath};`);
    toast.success('CSS copied to clipboard!');
  };

  const handleReset = () => {
    setShape('polygon');
    setWidth(575);
    setHeight(400);
    setClipPath(shapes.polygon(575, 400));
    setCustomClipPath('');
    setImageUrl(sampleImages[0]);
    setShowOutside(true);
    setHideGuides(false);
    setUseCustomBackground(false);
    setCustomBackgroundUrl('');
    setOutsideOpacity(50);
  };

  const handleCustomBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBackgroundUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const svgString = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="clipPath">
            <path d="${clipPath.replace(/clip-path:\s*/, '')}" />
          </clipPath>
        </defs>
        <image width="100%" height="100%" preserveAspectRatio="xMidYMid slice" 
               xlink:href="${imageUrl}" clip-path="url(#clipPath)"/>
      </svg>
    `;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clipped-image.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CSS Clip Path Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          {/* Fixed Preview Window */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Preview</h2>
            <div 
              className="relative bg-gray-700 rounded-lg overflow-hidden mx-auto"
              style={{ width: '600px', height: '400px' }}
            >
              <img 
                src={useCustomBackground && customBackgroundUrl ? customBackgroundUrl : imageUrl} 
                alt="Clipped image"
                className="w-full h-full object-cover"
                style={{ 
                  clipPath: clipPath,
                  WebkitClipPath: clipPath,
                }}
              />
              {!hideGuides && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full border-2 border-dashed border-blue-500 opacity-50"></div>
                  <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-blue-500 opacity-50"></div>
                  <div className="absolute top-0 left-1/2 h-full border-l-2 border-dashed border-blue-500 opacity-50"></div>
                </div>
              )}
              {showOutside && (
                <div 
                  className="absolute inset-0 bg-gray-800"
                  style={{ 
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                    WebkitClipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                    opacity: outsideOpacity / 100,
                  }}
                ></div>
              )}
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              <Button onClick={handleShuffleImage} className="bg-purple-600 hover:bg-purple-700 text-white">
                <RefreshCw className="h-5 w-5 mr-2" />
                Shuffle Image
              </Button>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-5 w-5 mr-2" />
                Export SVG
              </Button>
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Shape Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shape" className="text-white mb-2 block">Clip Path Shape</Label>
                  <Select value={shape} onValueChange={(value: Shape) => setShape(value)}>
                    <SelectTrigger id="shape" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="ellipse">Ellipse</SelectItem>
                      <SelectItem value="inset">Inset</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="width" className="text-white mb-2 block">Width: {width}px</Label>
                  <Slider
                    id="width"
                    min={100}
                    max={600}
                    step={1}
                    value={width}
                    onChange={(value) => setWidth(value)}
                  />
                </div>

                <div>
                  <Label htmlFor="height" className="text-white mb-2 block">Height: {height}px</Label>
                  <Slider
                    id="height"
                    min={100}
                    max={400}
                    step={1}
                    value={height}
                    onChange={(value) => setHeight(value)}
                  />
                </div>

                {shape === 'custom' && (
                  <div>
                    <Label htmlFor="custom-clip-path" className="text-white mb-2 block">Custom Clip Path</Label>
                    <Input
                      id="custom-clip-path"
                      value={customClipPath}
                      onChange={(e) => setCustomClipPath(e.target.value)}
                      placeholder="e.g., polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)"
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Display Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-outside" className="text-white">Show Outside</Label>
                  <Switch
                    id="show-outside"
                    checked={showOutside}
                    onCheckedChange={setShowOutside}
                  />
                </div>

                <div>
                  <Label htmlFor="outside-opacity" className="text-white mb-2 block">Outside Opacity: {outsideOpacity}%</Label>
                  <Slider
                    id="outside-opacity"
                    min={0}
                    max={100}
                    step={1}
                    value={outsideOpacity}
                    onChange={(value) => setOutsideOpacity(value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-guides" className="text-white">Hide Guides</Label>
                  <Switch
                    id="hide-guides"
                    checked={hideGuides}
                    onCheckedChange={setHideGuides}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="use-custom-background" className="text-white">Use Custom Background</Label>
                  <Switch
                    id="use-custom-background"
                    checked={useCustomBackground}
                    onCheckedChange={setUseCustomBackground}
                  />
                </div>

                {useCustomBackground && (
                  <div>
                    <Label htmlFor="custom-background" className="text-white mb-2 block">Custom Background Image</Label>
                    <Input
                      id="custom-background"
                      type="file"
                      accept="image/*"
                      onChange={handleCustomBackgroundUpload}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generated CSS */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <code className="text-white whitespace-pre-wrap break-all">
                clip-path: {clipPath};
              </code>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                Reset
              </Button>
              <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Copy className="h-5 w-5 mr-2" />
                Copy CSS
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Select a clip-path shape from the dropdown menu.</li>
            <li>Adjust the width and height of the preview area using the sliders.</li>
            <li>For custom shapes, enter the clip-path value in the "Custom Clip Path" input.</li>
            <li>Toggle "Show Outside" to highlight the clipped area.</li>
            <li>Use "Hide Guides" to remove the guide lines from the preview.</li>
            <li>Click "Shuffle Image" to change the preview image.</li>
            <li>Enable "Use Custom Background" to upload your own image.</li>
            <li>Copy the generated CSS or export the clipped image as an SVG.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Multiple pre-defined clip-path shapes (circle, ellipse, inset, polygon)</li>
            <li>Custom clip-path input for advanced shapes</li>
            <li>Adjustable preview size with width and height sliders</li>
            <li>Real-time preview of the clipped image</li>
            <li>Option to show/hide the area outside the clip-path</li>
            <li>Toggleable guide lines for precise positioning</li>
            <li>Image shuffling for quick visualization with different images</li>
            <li>Custom background image upload</li>
            <li>Generated CSS code with one-click copy functionality</li>
            <li>Export clipped image as SVG</li>
            <li>Responsive design for use on various devices</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}