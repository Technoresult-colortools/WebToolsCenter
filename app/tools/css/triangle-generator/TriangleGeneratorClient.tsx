'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import Slider from "@/components/ui/Slider";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, Download, Info, Lightbulb, BookOpen } from 'lucide-react';
import Sidebar from '@/components/sidebarTools';

const TriangleGenerator = () => {
  const [direction, setDirection] = useState('top');
  const [color, setColor] = useState('#3498db');
  const [size, setSize] = useState(100);
  const [rotate, setRotate] = useState(0);
  const [generatedCSS, setGeneratedCSS] = useState('');

  const generateCSS = () => {
    let css = `
.triangle {
  width: 0;
  height: 0;
  border-style: solid;
`;

    switch (direction) {
      case 'top':
        css += `  border-width: 0 ${size / 2}px ${size}px ${size / 2}px;
  border-color: transparent transparent ${color} transparent;`;
        break;
      case 'right':
        css += `  border-width: ${size / 2}px 0 ${size / 2}px ${size}px;
  border-color: transparent transparent transparent ${color};`;
        break;
      case 'bottom':
        css += `  border-width: ${size}px ${size / 2}px 0 ${size / 2}px;
  border-color: ${color} transparent transparent transparent;`;
        break;
      case 'left':
        css += `  border-width: ${size / 2}px ${size}px ${size / 2}px 0;
  border-color: transparent ${color} transparent transparent;`;
        break;
    }

    css += `
  transform: rotate(${rotate}deg);
}`;

    setGeneratedCSS(css);
  };

  useEffect(() => {
    generateCSS();
  }, [direction, color, size, rotate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCSS);
    toast.success('CSS copied to clipboard!');
  };

  const handleReset = () => {
    setDirection('top');
    setColor('#3498db');
    setSize(100);
    setRotate(0);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedCSS], {type: 'text/css'});
    element.href = URL.createObjectURL(file);
    element.download = 'triangle.css';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                CSS Triangle Generator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Create customizable CSS triangles without using images.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <div
                  className="triangle"
                  style={{
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: direction === 'top' ? `0 ${size / 2}px ${size}px ${size / 2}px` :
                                direction === 'right' ? `${size / 2}px 0 ${size / 2}px ${size}px` :
                                direction === 'bottom' ? `${size}px ${size / 2}px 0 ${size / 2}px` :
                                `${size / 2}px ${size}px ${size / 2}px 0`,
                    borderColor: direction === 'top' ? `transparent transparent ${color} transparent` :
                                direction === 'right' ? `transparent transparent transparent ${color}` :
                                direction === 'bottom' ? `${color} transparent transparent transparent` :
                                `transparent ${color} transparent transparent`,
                    transform: `rotate(${rotate}deg)`,
                  }}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Triangle Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="direction" className="text-white mb-2 block">Direction</Label>
                    <Select value={direction} onValueChange={setDirection}>
                      <SelectTrigger id="direction" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color" className="text-white mb-2 block">Triangle Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="size" className="text-white mb-2 block">Size: {size}px</Label>
                    <Slider
                      id="size"
                      min={20}
                      max={300}
                      step={1}
                      value={size}
                      onChange={(value) => setSize(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rotate" className="text-white mb-2 block">Rotate: {rotate}°</Label>
                    <Slider
                      id="rotate"
                      min={0}
                      max={360}
                      step={1}
                      value={rotate}
                      onChange={(value) => setRotate(value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <code className="text-white whitespace-pre-wrap break-all">
                  {generatedCSS}
                </code>
              </div>
              <div className="mt-4 flex flex-wrap justify-end space-x-2 space-y-2 sm:space-y-0">
                <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy CSS
                </Button>
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download CSS
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the CSS Triangle Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The CSS Triangle Generator is a powerful tool for creating customizable CSS triangles without using images. It offers a range of options to adjust the triangle's appearance, including direction, size, color, opacity, and rotation. This tool is perfect for web designers and developers looking to add decorative elements or create unique layouts using pure CSS.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the CSS Triangle Generator
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Choose a triangle direction from the dropdown menu.</li>
              <li>Set the triangle's color using the color picker or by entering a hex value.</li>
              <li>Adjust the width and height using the number inputs or increment/decrement buttons.</li>
              <li>Use the border radius slider to round the corners of your triangle (if desired).</li>
              <li>Adjust the opacity of the triangle using the opacity slider.</li>
              <li>Rotate the triangle using the rotation slider.</li>
              <li>For large triangles, use the preview scale slider to fit the triangle in the preview window.</li>
              <li>Preview your triangle in real-time in the preview area.</li>
              <li>Copy the generated CSS code or download it as a CSS file.</li>
              <li>Use the Reset button to return to default settings if needed.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Eight different triangle directions for versatile design options</li>
              <li>Custom color selection with color picker and hex input</li>
              <li>Precise width and height control with number inputs and increment/decrement buttons</li>
              <li>Border radius option for creating rounded triangles</li>
              <li>Opacity control for transparent triangles</li>
              <li>Rotation feature for angled triangles</li>
              <li>Preview scaling for large triangles</li>
              <li>Real-time preview of the triangle as you adjust settings</li>
              <li>Generated CSS code with one-click copy functionality</li>
              <li>Option to download the CSS as a file</li>
              <li>Reset feature to quickly return to default settings</li>
              <li>Responsive design for use on various devices, including mobile</li>
              <li>User-friendly interface with intuitive controls</li>
            </ul>
          </div>
        </main>
       </div> 
      <Footer />
    </div>
  )
}

export default TriangleGenerator