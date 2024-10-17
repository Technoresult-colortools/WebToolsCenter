'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import Slider from "@/components/ui/Slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from 'react-hot-toast';
import { Download, RefreshCw, Copy, Upload, Maximize2, X, Settings, Sliders, Palette, Image, Info, BookOpen, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/sidebarTools';

type PatternType =
  | 'circles'
  | 'squares'
  | 'triangles'
  | 'hexagons'
  | 'zigzag'
  | 'polkaDots'
  | 'stripes'
  | 'chevron'
  | 'modernCircles'
  | 'concentricCircles'
  | 'nestedSquares'
  | 'triangleGrid'
  | 'waves'
  | 'dots3D'
  | 'crosshatch'
  | 'spiral'
  | 'flowerOfLife'
  | 'customImage';

type ExportFormat = 'svg' | 'png';

type ExportSize = 'facebookCover' | 'youtubeCover' | 'youtubeThumbnail' | 'ogImage' | 'instagramSquare' | 'instagramLandscape' | 'instagramPortrait' | 'instagramStory' | 'custom';

const exportSizes: Record<ExportSize, { width: number; height: number }> = {
  facebookCover: { width: 820, height: 312 },
  youtubeCover: { width: 2560, height: 1440 },
  youtubeThumbnail: { width: 1280, height: 720 },
  ogImage: { width: 1200, height: 630 },
  instagramSquare: { width: 1080, height: 1080 },
  instagramLandscape: { width: 1080, height: 566 },
  instagramPortrait: { width: 1080, height: 1350 },
  instagramStory: { width: 1080, height: 1920 },
  custom: { width: 800, height: 600 },
};

export default function Component() {
  const [patternType, setPatternType] = useState<PatternType>('modernCircles');
  const [patternColor, setPatternColor] = useState('#3498db');
  const [secondaryColor, setSecondaryColor] = useState('#2980b9');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [size, setSize] = useState(20);
  const [spacing, setSpacing] = useState(5);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [complexity, setComplexity] = useState(50);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [svgCode, setSvgCode] = useState('');
  const [exportSize, setExportSize] = useState<ExportSize>('facebookCover');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('svg');
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generatePattern = useCallback(() => {
    let pattern = '';
    const svgSize = size + spacing;
    const complexityFactor = complexity / 100;

    const generatePath = (type: PatternType) => {
      switch (type) {
        case 'modernCircles':
          return `
            <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/2}" fill="${patternColor}" />
            <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/3}" fill="${secondaryColor}" />
            <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/4}" fill="${backgroundColor}" />
          `;
        case 'concentricCircles':
          return Array.from({ length: Math.floor(4 * complexityFactor) })
            .map((_, i) => {
              const radius = (size/2) * (1 - i/(4 * complexityFactor));
              return `<circle cx="${svgSize/2}" cy="${svgSize/2}" r="${radius}" 
                fill="none" stroke="${i % 2 ? patternColor : secondaryColor}" 
                stroke-width="${strokeWidth}" />`;
            })
            .join('');
        case 'nestedSquares':
          return Array.from({ length: Math.floor(3 * complexityFactor) })
            .map((_, i) => {
              const sizeReduction = (i * size) / (3 * complexityFactor);
              return `<rect x="${sizeReduction/2}" y="${sizeReduction/2}" 
                width="${size - sizeReduction}" height="${size - sizeReduction}"
                fill="none" stroke="${i % 2 ? patternColor : secondaryColor}"
                stroke-width="${strokeWidth}" />`;
            })
            .join('');
        case 'triangleGrid':
          return `
            <path d="M0,0 L${size},0 L${size/2},${size*Math.sqrt(3)/2} Z" 
              fill="${patternColor}" />
            <path d="M0,${size*Math.sqrt(3)/2} L${size},${size*Math.sqrt(3)/2} 
              L${size/2},0 Z" fill="${secondaryColor}" />
          `;
        case 'waves':
          const wavePoints = Array.from({ length: 10 })
            .map((_, i) => {
              const x = (i * size) / 10;
              const y = (size/2) + Math.sin(i * Math.PI / 5) * (size/4);
              return `${x},${y}`;
            })
            .join(' ');
          return `<polyline points="${wavePoints}" 
            stroke="${patternColor}" fill="none" 
            stroke-width="${strokeWidth}" />`;
        case 'dots3D':
          return `
            <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/3}"
              fill="${patternColor}">
              <animate attributeName="r" values="${size/3};${size/4};${size/3}"
                dur="2s" repeatCount="indefinite" />
            </circle>
            <ellipse cx="${svgSize/2}" cy="${svgSize/2 + size/4}" rx="${size/3}" 
              ry="${size/6}" fill="${secondaryColor}" opacity="0.3" />
          `;
        case 'crosshatch':
          return `
            <path d="M0,0 L${size},${size}" stroke="${patternColor}" 
              stroke-width="${strokeWidth}" />
            <path d="M0,${size} L${size},0" stroke="${secondaryColor}" 
              stroke-width="${strokeWidth}" />
          `;
        case 'circles':
          return `<circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${size / 2}" fill="${patternColor}" />`;
        case 'squares':
          return `<rect x="0" y="0" width="${size}" height="${size}" fill="${patternColor}" />`;
        case 'triangles':
          return `<polygon points="0,${size} ${size / 2},0 ${size},${size}" fill="${patternColor}" />`;
        case 'hexagons':
          const hexPoints = [
            [size / 2, 0],
            [size, size / 4],
            [size, size * 3 / 4],
            [size / 2, size],
            [0, size * 3 / 4],
            [0, size / 4],
          ].map(([x, y]) => `${x},${y}`).join(' ');
          return `<polygon points="${hexPoints}" fill="${patternColor}" />`;
        case 'zigzag':
          return `<polyline points="0,0 ${size / 2},${size} ${size},0 ${size * 1.5},${size} ${size * 2},0" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />`;
        case 'polkaDots':
          return `
            <circle cx="${svgSize / 4}" cy="${svgSize / 4}" r="${size / 8}" fill="${patternColor}" />
            <circle cx="${svgSize * 3 / 4}" cy="${svgSize * 3 / 4}" r="${size / 8}" fill="${patternColor}" />
          `;
        case 'stripes':
          return `
            <line x1="0" y1="0" x2="${svgSize}" y2="0" stroke="${patternColor}" stroke-width="${size / 2}" />
            <line x1="0" y1="${svgSize}" x2="${svgSize}" y2="${svgSize}" stroke="${patternColor}" stroke-width="${size / 2}" />
          `;
        case 'chevron':
          return `
            <polyline points="0,${size} ${size / 2},0 ${size},${size}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />
            <polyline points="0,${size * 2} ${size / 2},${size} ${size},${size * 2}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />
          `;
        case 'spiral':
          const spiralPoints = Array.from({ length: 100 })
            .map((_, i) => {
              const angle = 0.1 * i;
              const x = svgSize / 2 + (angle * Math.cos(angle) * size) / (2 * Math.PI);
              const y = svgSize / 2 + (angle * Math.sin(angle) * size) / (2 * Math.PI);
              return `${x},${y}`;
            })
            .join(' ');
          return `<polyline points="${spiralPoints}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />`;
        case 'flowerOfLife':
          const circles = [];
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const cx = svgSize / 2 + (size / 2) * Math.cos(angle);
            const cy = svgSize / 2 + (size / 2) * Math.sin(angle);
            circles.push(`<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />`);
          }
          return `
            <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${size / 2}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />
            ${circles.join('')}
          `;
        case 'customImage':
          if (customImage) {
            return `<image href="${customImage}" x="0" y="0" width="${size}" height="${size}" />`;
          }
          return '';
        default:
          return `<circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/2}" fill="${patternColor}" />`;
      }
    };

    pattern = generatePath(patternType);

    const { width, height } = exportSize === 'custom' 
      ? { width: customWidth, height: customHeight }
      : exportSizes[exportSize];

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"
        style="background-color: ${backgroundColor}">
        <defs>
          <pattern id="pattern" x="0" y="0" width="${svgSize}" height="${svgSize}" 
            patternUnits="userSpaceOnUse">
            <g transform="rotate(${rotation}, ${svgSize/2}, ${svgSize/2})" 
              opacity="${opacity/100}">
              ${pattern}
            </g>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
      </svg>
    `;

    setSvgCode(svg);
  }, [patternType, patternColor, secondaryColor, backgroundColor, size, spacing,
    rotation, opacity, complexity, strokeWidth, exportSize, customWidth, customHeight, customImage]);

  useEffect(() => {
    generatePattern();
  }, [generatePattern]);

  const handleRandomize = () => {
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const patternTypes: PatternType[] = ['circles', 'squares', 'triangles', 'hexagons', 'zigzag', 'polkaDots', 'stripes', 'chevron', 'modernCircles', 'concentricCircles', 'nestedSquares', 'triangleGrid', 'waves', 'dots3D', 'crosshatch', 'spiral', 'flowerOfLife'];
    
    setPatternType(patternTypes[Math.floor(Math.random() * patternTypes.length)]);
    setPatternColor(randomColor());
    setSecondaryColor(randomColor());
    setBackgroundColor(randomColor());
    setSize(Math.floor(Math.random() * 40) + 10);
    setSpacing(Math.floor(Math.random() * 20));
    setRotation(Math.floor(Math.random() * 360));
    setOpacity(Math.floor(Math.random() * 100) + 1);
    setComplexity(Math.floor(Math.random() * 100) + 1);
    setStrokeWidth(Math.floor(Math.random() * 5) + 1);
  };

  const handleDownload = async () => {
    const { width, height } = exportSize === 'custom' 
      ? { width: customWidth, height: customHeight }
      : exportSizes[exportSize];
  
    if (exportFormat === 'svg') {
      const blob = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pattern_${width}x${height}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('SVG pattern downloaded successfully!');
    } else {
      const svg = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svg);
      const img = new window.Image();  // Use the native Image constructor
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toast.error('Unable to create canvas context');
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            toast.error('Unable to create PNG');
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `pattern_${width}x${height}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success('PNG pattern downloaded successfully!');
        }, 'image/png');
      };
      
      img.onerror = () => {
        toast.error('Error loading SVG for PNG conversion');
      };
      
      img.src = url;
    }
  };
  

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(svgCode).then(() => {
      toast.success('SVG code copied to clipboard!');
    }, () => {
      toast.error('Failed to copy SVG code.');
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string);
        setPatternType('customImage');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderCodePreview = () => (
    <div className="bg-white rounded-lg overflow-hidden" style={{ height: '300px', width: '98.5%'}}>
      <div dangerouslySetInnerHTML={{ __html: svgCode }} style={{ width: '100%', height: '100%' }} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-12">
         <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                Enhanced SVG Pattern Generator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Unlock your creativity by crafting intricate vector patterns that elevate your designs, all while enjoying seamless customization and instant feedback.
            </p>
         </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Pattern Preview</h2>
              {renderCodePreview()}
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download {exportFormat.toUpperCase()}
                </Button>
                <Button onClick={handleCopyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy SVG Code
                </Button>
                <Button onClick={handleRandomize} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Randomize
                </Button>
                <Button onClick={toggleFullscreen} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Maximize2 className="h-5 w-5 mr-2" />
                  Full Screen Preview
                </Button>
              </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4 gap-2 mb-4">
                <TabsTrigger value="basic" className="flex items-center justify-center">
                  <Settings className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Basic</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center justify-center">
                  <Sliders className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
                <TabsTrigger value="colors" className="flex items-center justify-center">
                  <Palette className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Colors</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center justify-center">
                  <Image className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pattern-type" className="text-white mb-2 block">Pattern Type</Label>
                    <Select value={patternType} onValueChange={(value: PatternType) => setPatternType(value)}>
                      <SelectTrigger id="pattern-type" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select pattern type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600 max-h-60 overflow-y-auto">
                        <SelectItem value="circles">Circles</SelectItem>
                        <SelectItem value="squares">Squares</SelectItem>
                        <SelectItem value="triangles">Triangles</SelectItem>
                        <SelectItem value="hexagons">Hexagons</SelectItem>
                        <SelectItem value="zigzag">Zigzag</SelectItem>
                        <SelectItem value="polkaDots">Polka Dots</SelectItem>
                        <SelectItem value="stripes">Stripes</SelectItem>
                        <SelectItem value="chevron">Chevron</SelectItem>
                        <SelectItem value="modernCircles">Modern Circles</SelectItem>
                        <SelectItem value="concentricCircles">Concentric Circles</SelectItem>
                        <SelectItem value="nestedSquares">Nested Squares</SelectItem>
                        <SelectItem value="triangleGrid">Triangle Grid</SelectItem>
                        <SelectItem value="waves">Waves</SelectItem>
                        <SelectItem value="dots3D">3D Dots</SelectItem>
                        <SelectItem value="crosshatch">Crosshatch</SelectItem>
                        <SelectItem value="spiral">Spiral</SelectItem>
                        <SelectItem value="flowerOfLife">Flower of Life</SelectItem>
                        <SelectItem value="customImage">Custom Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="size-slider" className="text-white mb-2 block">Size: {size}px</Label>
                    <Slider
                      id="size-slider"
                      min={5}
                      max={100}
                      step={1}
                      value={size}
                      onChange={(value) => setSize(value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="spacing-slider" className="text-white mb-2 block">Spacing: {spacing}px</Label>
                    <Slider
                      id="spacing-slider"
                      min={0}
                      max={50}
                      step={1}
                      value={spacing}
                      onChange={(value) => setSpacing(value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rotation-slider" className="text-white mb-2 block">Rotation: {rotation}°</Label>
                    <Slider
                      id="rotation-slider"
                      min={0}
                      max={360}
                      step={1}
                      value={rotation}
                      onChange={(value) => setRotation(value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="opacity-slider" className="text-white mb-2 block">Opacity: {opacity}%</Label>
                    <Slider
                      id="opacity-slider"
                      min={0}
                      max={100}
                      step={1}
                      value={opacity}
                      onChange={(value) => setOpacity(value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="complexity-slider" className="text-white mb-2 block">Complexity: {complexity}%</Label>
                    <Slider
                      id="complexity-slider"
                      min={0}
                      max={100}
                      step={1}
                      value={complexity}
                      onChange={(value) => setComplexity(value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stroke-width-slider" className="text-white mb-2 block">Stroke Width: {strokeWidth}px</Label>
                    <Slider
                      id="stroke-width-slider"
                      min={1}
                      max={10}
                      step={0.5}
                      value={strokeWidth}
                      onChange={(value) => setStrokeWidth(value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="colors">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pattern-color" className="text-white mb-2 block">Pattern Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="pattern-color"
                        type="color"
                        value={patternColor}
                        onChange={(e) => setPatternColor(e.target.value)}
                        className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={patternColor}
                        onChange={(e) => setPatternColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary-color" className="text-white mb-2 block">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="background-color" className="text-white mb-2 block">Background Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="background-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="export">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="export-size" className="text-white mb-2 block">Export Size</Label>
                    <Select value={exportSize} onValueChange={(value: ExportSize) => setExportSize(value)}>
                      <SelectTrigger id="export-size" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select export size" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="facebookCover">Facebook Cover</SelectItem>
                        <SelectItem value="youtubeCover">YouTube Cover</SelectItem>
                        <SelectItem value="youtubeThumbnail">YouTube Thumbnail</SelectItem>
                        <SelectItem value="ogImage">OG Image</SelectItem>
                        <SelectItem value="instagramSquare">Instagram Square</SelectItem>
                        <SelectItem value="instagramLandscape">Instagram Landscape</SelectItem>
                        <SelectItem value="instagramPortrait">Instagram Portrait</SelectItem>
                        <SelectItem value="instagramStory">Instagram Story</SelectItem>
                        <SelectItem value="custom">Custom Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {exportSize === 'custom' && (
                    <div className="flex space-x-2">
                      <div>
                        <Label htmlFor="custom-width" className="text-white mb-2 block">Width (px)</Label>
                        <Input
                          id="custom-width"
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(Number(e.target.value))}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="custom-height" className="text-white mb-2 block">Height (px)</Label>
                        <Input
                          id="custom-height"
                          type="number"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(Number(e.target.value))}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="export-format" className="text-white mb-2 block">Export Format</Label>
                    <Select value={exportFormat} onValueChange={(value: ExportFormat) => setExportFormat(value)}>
                      <SelectTrigger id="export-format" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="svg">SVG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {patternType === 'customImage' && (
                    <div>
                      <Label htmlFor="image-upload" className="text-white mb-2 block">Upload Image (Max 5MB)</Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Fullscreen Preview Popup */}
          {isFullscreen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="relative w-full max-w-4xl">
                <Button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
                {renderCodePreview()}
              </div>
            </div>
          )}
              

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the SVG Pattern Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The SVG Pattern Generator is a versatile and powerful tool designed for creating customizable vector patterns and textures. It enables designers, developers, and creative professionals to generate unique, scalable patterns for various applications such as web design, print materials, and digital art. With a wide range of pattern types and customization options, this tool offers endless possibilities for creating visually appealing and functional designs.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the SVG Pattern Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Select a pattern type from the dropdown menu or upload a custom image.</li>
              <li>Adjust the pattern colors using the color pickers (primary, secondary, and background).</li>
              <li>Use the sliders to fine-tune size, spacing, rotation, opacity, complexity, and stroke width.</li>
              <li>Choose an export size from presets or enter custom dimensions.</li>
              <li>Select SVG or PNG as your export format.</li>
              <li>Preview your pattern in real-time as you make adjustments.</li>
              <li>Use the "Full Screen Preview" for a detailed view of your pattern.</li>
              <li>Click "Download" to save your pattern or "Copy SVG Code" to use it directly in web projects.</li>
              <li>Experiment with the "Randomize" button to generate new pattern ideas quickly.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Palette className="w-6 h-6 mr-2" />
              Available Pattern Types
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Basic Shapes: Circles, Squares, Triangles, Hexagons</li>
              <li>Linear Patterns: Stripes, Zigzag, Chevron</li>
              <li>Dot Patterns: Polka Dots, 3D Dots</li>
              <li>Complex Shapes: Modern Circles, Concentric Circles, Nested Squares, Triangle Grid</li>
              <li>Organic Patterns: Waves, Crosshatch</li>
              <li>Advanced Designs: Spiral, Flower of Life</li>
              <li>Custom Image: Upload your own image to create a unique pattern</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Real-time pattern preview with adjustable parameters</li>
              <li>Full-screen preview option for detailed inspection</li>
              <li>Customizable colors for primary pattern, secondary elements, and background</li>
              <li>Adjustable size, spacing, rotation, opacity, complexity, and stroke width</li>
              <li>Export as SVG or PNG in various preset sizes or custom dimensions</li>
              <li>One-click randomize function for quick pattern generation</li>
              <li>Copy SVG code directly to clipboard for easy integration into web projects</li>
              <li>Custom image upload feature (max 5MB) for personalized patterns</li>
              <li>Mobile-responsive design for on-the-go pattern creation</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Download className="w-6 h-6 mr-2" />
              Export Options
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>SVG: Scalable Vector Graphics format for high-quality, resolution-independent graphics</li>
              <li>PNG: Raster image format for use in various applications and platforms</li>
              <li>Preset Sizes: Facebook Cover, YouTube Cover, YouTube Thumbnail, OG Image, Instagram Square, Instagram Landscape, Instagram Portrait, Instagram Story</li>
              <li>Custom Size: Specify your own width and height for the exported pattern</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Copy className="w-6 h-6 mr-2" />
              Integration Options
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Copy SVG Code: Easily integrate the generated pattern into your web projects</li>
              <li>Download Files: Save the pattern as an SVG or PNG file for use in design software or other applications</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Maximize2 className="w-6 h-6 mr-2" />
              Preview and Visualization
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Real-time Preview: See your pattern update instantly as you adjust parameters</li>
              <li>Full-screen Preview: Examine your pattern in detail with an expanded view</li>
              <li>Responsive Design: Preview how your pattern looks on different screen sizes</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Upload className="w-6 h-6 mr-2" />
              Custom Image Upload
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Upload your own images (up to 5MB) to create unique, personalized patterns</li>
              <li>Combine custom images with built-in pattern types for creative designs</li>
              <li>Ideal for creating branded patterns or textures based on your own artwork</li>
            </ul>
          </div>
        </main>
       </div> 
      <Footer />
    </div>
  );
}