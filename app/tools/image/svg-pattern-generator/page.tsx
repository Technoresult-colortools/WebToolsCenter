'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import Slider from "@/components/ui/Slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Download, RefreshCw, Copy } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type PatternType =
  | 'circles'
  | 'squares'
  | 'triangles'
  | 'hexagons'
  | 'zigzag'
  | 'polkaDots'
  | 'stripes'
  | 'chevron'
  | 'rightTriangle'
  | 'halfCircle'
  | 'doubleHalfCircle'
  | 'pie'
  | 'pacman'
  | 'drop'
  | 'dots'
  | 'fungi'
  | 'leaf'
  | 'flower'
  | 'ring'
  | 'donut'
  | 'signal'
  | 'nestedTriangle'
  | 'plus'
  | 'minus'
  | 'multiply'
  | 'rhombus'
  | 'mandala'
  | 'parquet'
  | 'layers'
  | 'cloudLine'
  | 'cloudSolid'
  | 'flashSolid'
  | 'flashLine'
  | 'gearSolid'
  | 'gearLine'
  | 'paperPlaneSolid'
  | 'paperPlaneLine'
  | 'chatSolid'
  | 'chatLine';
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

export default function SvgPatternGenerator() {
  const [patternType, setPatternType] = useState<PatternType>('circles');
  const [patternColor, setPatternColor] = useState('#3498db');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [size, setSize] = useState(20);
  const [spacing, setSpacing] = useState(5);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [svgCode, setSvgCode] = useState('');
  const [exportSize, setExportSize] = useState<ExportSize>('facebookCover');
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);

  const generatePattern = useCallback(() => {
    let pattern = '';
    const svgSize = size + spacing;

    switch (patternType) {
      case 'circles':
        pattern = `<circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${size / 2}" fill="${patternColor}" />`;
        break;
      case 'squares':
        pattern = `<rect x="0" y="0" width="${size}" height="${size}" fill="${patternColor}" />`;
        break;
      case 'triangles':
        pattern = `<polygon points="0,${size} ${size / 2},0 ${size},${size}" fill="${patternColor}" />`;
        break;
      case 'hexagons':
        const hexPoints = [
          [size / 2, 0],
          [size, size / 4],
          [size, size * 3 / 4],
          [size / 2, size],
          [0, size * 3 / 4],
          [0, size / 4],
        ].map(([x, y]) => `${x},${y}`).join(' ');
        pattern = `<polygon points="${hexPoints}" fill="${patternColor}" />`;
        break;
      case 'zigzag':
        pattern = `<polyline points="0,0 ${size / 2},${size} ${size},0 ${size * 1.5},${size} ${size * 2},0" fill="none" stroke="${patternColor}" stroke-width="2" />`;
        break;
      case 'polkaDots':
        pattern = `
          <circle cx="${svgSize / 4}" cy="${svgSize / 4}" r="${size / 8}" fill="${patternColor}" />
          <circle cx="${svgSize * 3 / 4}" cy="${svgSize * 3 / 4}" r="${size / 8}" fill="${patternColor}" />
        `;
        break;
      case 'stripes':
        pattern = `
          <line x1="0" y1="0" x2="${svgSize}" y2="0" stroke="${patternColor}" stroke-width="${size / 2}" />
          <line x1="0" y1="${svgSize}" x2="${svgSize}" y2="${svgSize}" stroke="${patternColor}" stroke-width="${size / 2}" />
        `;
        break;
      case 'chevron':
        pattern = `
          <polyline points="0,${size} ${size / 2},0 ${size},${size}" fill="none" stroke="${patternColor}" stroke-width="2" />
          <polyline points="0,${size * 2} ${size / 2},${size} ${size},${size * 2}" fill="none" stroke="${patternColor}" stroke-width="2" />
        `;
        break;
        case 'rightTriangle':
        pattern = `<polygon points="0,0 ${size},0 0,${size}" fill="${patternColor}" />`;
        break;
        case 'halfCircle':
        pattern = `<path d="M ${size},0 A ${size/2} ${size/2} 0 1 0 ${size},${size}" fill="${patternColor}" />`;
        break;
        case 'pacman':
        pattern = `<path d="M${size/2},${size/2} m-${size/2},0 a${size/2},${size/2} 0 1,0 ${size},0 L${size/2},${size/2}" fill="${patternColor}" />`;
        break;
        case 'drop':
        pattern = `<path d="M${size / 2},0 C${size},${size / 2} ${size / 2},${size} 0,${size / 2} Z" fill="${patternColor}" />`;
        break;

        case 'dots':
        pattern = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" fill="${patternColor}" />`;
        break;

        case 'fungi':
        pattern = `<path d="M${size / 2},${size} L0,${size} Q${size / 2},0 ${size},${size} Z" fill="${patternColor}" />`;
        break;

        case 'leaf':
        pattern = `<path d="M${size / 2},${size} Q${size},0 ${size / 2},0 T${size / 2},${size}" fill="${patternColor}" />`;
        break;

        case 'flower':
        pattern = `<circle cx="${size / 2}" cy="${size / 4}" r="${size / 8}" fill="${patternColor}" />
                    <circle cx="${size / 4}" cy="${size / 2}" r="${size / 8}" fill="${patternColor}" />
                    <circle cx="${3 * size / 4}" cy="${size / 2}" r="${size / 8}" fill="${patternColor}" />
                    <circle cx="${size / 2}" cy="${3 * size / 4}" r="${size / 8}" fill="${patternColor}" />`;
        break;

        case 'ring':
        pattern = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" stroke="${patternColor}" stroke-width="4" fill="none" />`;
        break;

        case 'donut':
        pattern = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" stroke="${patternColor}" stroke-width="4" fill="${backgroundColor}" />`;
        break;

        case 'signal':
        pattern = `<path d="M${size / 2},${size} L${size / 2},0 M${size / 4},${size} L${size / 4},${size / 2} M${3 * size / 4},${size} L${3 * size / 4},${size / 4}" stroke="${patternColor}" stroke-width="4" />`;
        break;

        case 'nestedTriangle':
        pattern = `<polygon points="0,${size},${size / 2},0,${size},${size}" fill="${patternColor}" />
                    <polygon points="0,${size * 0.75},${size * 0.5},${size * 0.25},${size},${size * 0.75}" fill="${backgroundColor}" />`;
        break;

        case 'plus':
        pattern = `<rect x="${size / 2 - 4}" y="0" width="8" height="${size}" fill="${patternColor}" />
                    <rect x="0" y="${size / 2 - 4}" width="${size}" height="8" fill="${patternColor}" />`;
        break;

        case 'minus':
        pattern = `<rect x="0" y="${size / 2 - 4}" width="${size}" height="8" fill="${patternColor}" />`;
        break;

        case 'multiply':
        pattern = `<line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${patternColor}" stroke-width="4" />
                    <line x1="0" y1="${size}" x2="${size}" y2="0" stroke="${patternColor}" stroke-width="4" />`;
        break;

        case 'rhombus':
        pattern = `<polygon points="${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}" fill="${patternColor}" />`;
        break;

        case 'mandala':
        pattern = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" stroke="${patternColor}" stroke-width="2" fill="none" />
                    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 6}" stroke="${patternColor}" stroke-width="2" fill="none" />
                    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 8}" stroke="${patternColor}" stroke-width="2" fill="none" />`;
        break;

        case 'parquet':
        pattern = `<rect x="0" y="0" width="${size / 2}" height="${size / 2}" fill="${patternColor}" />
                    <rect x="${size / 2}" y="${size / 2}" width="${size / 2}" height="${size / 2}" fill="${patternColor}" />`;
        break;

        case 'layers':
        pattern = `<path d="M0,${size / 2} L${size},${size / 2}" stroke="${patternColor}" stroke-width="4" />
                    <path d="M0,${size / 4} L${size},${size / 4}" stroke="${patternColor}" stroke-width="4" />
                    <path d="M0,${(3 * size) / 4} L${size},${(3 * size) / 4}" stroke="${patternColor}" stroke-width="4" />`;
        break;

        case 'cloudLine':
        pattern = `<path d="M${size / 4},${size / 2} C${size / 8},${size / 4} ${3 * size / 4},${size / 4} ${size / 2},${size}" stroke="${patternColor}" stroke-width="4" fill="none" />`;
        break;

        case 'cloudSolid':
        pattern = `<path d="M${size / 4},${size / 2} C${size / 8},${size / 4} ${3 * size / 4},${size / 4} ${size / 2},${size}" fill="${patternColor}" />`;
        break;

        case 'flashSolid':
        pattern = `<polygon points="0,${size / 2} ${size / 2},${size / 4} ${size / 4},${size} ${size},${size / 2}" fill="${patternColor}" />`;
        break;

        case 'flashLine':
        pattern = `<polygon points="0,${size / 2} ${size / 2},${size / 4} ${size / 4},${size} ${size},${size / 2}" stroke="${patternColor}" stroke-width="4" fill="none" />`;
        break;

        case 'gearSolid':
        pattern = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" fill="${patternColor}" />
                    <rect x="${size / 4}" y="0" width="${size / 2}" height="${size}" fill="${patternColor}" />
                    <rect x="0" y="${size / 4}" width="${size}" height="${size / 2}" fill="${patternColor}" />`;
        break;

        case 'gearLine':
        pattern = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" stroke="${patternColor}" stroke-width="4" fill="none" />
                    <rect x="${size / 4}" y="0" width="${size / 2}" height="${size}" stroke="${patternColor}" stroke-width="4" fill="none" />
                    <rect x="0" y="${size / 4}" width="${size}" height="${size / 2}" stroke="${patternColor}" stroke-width="4" fill="none" />`;
        break;

        case 'paperPlaneSolid':
        pattern = `<polygon points="0,${size} ${size / 2},0 ${size},${size / 2} ${size / 2},${size / 4}" fill="${patternColor}" />`;
        break;

        case 'paperPlaneLine':
        pattern = `<polygon points="0,${size} ${size / 2},0 ${size},${size / 2} ${size / 2},${size / 4}" stroke="${patternColor}" stroke-width="4" fill="none" />`;
        break;

        case 'chatSolid':
        pattern = `<rect x="0" y="0" width="${size}" height="${size / 2}" fill="${patternColor}" />
                    <polygon points="${size / 4},${size / 2} ${size / 2},${size / 2} ${size / 4},${size}" fill="${patternColor}" />`;
        break;

        case 'chatLine':
        pattern = `<rect x="0" y="0" width="${size}" height="${size / 2}" stroke="${patternColor}" stroke-width="4" fill="none" />
                    <polygon points="${size / 4},${size / 2} ${size / 2},${size / 2} ${size / 4},${size}" stroke="${patternColor}" stroke-width="4" fill="none" />`;
        break;

    
        
    }

    const { width, height } = exportSize === 'custom' 
      ? { width: customWidth, height: customHeight }
      : exportSizes[exportSize];

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <defs>
          <pattern id="pattern" x="0" y="0" width="${svgSize}" height="${svgSize}" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="${svgSize}" height="${svgSize}" fill="${backgroundColor}" />
            <g transform="rotate(${rotation}, ${svgSize / 2}, ${svgSize / 2})" opacity="${opacity / 100}">
              ${pattern}
            </g>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
      </svg>
    `;

    setSvgCode(svg);
  }, [patternType, patternColor, backgroundColor, size, spacing, rotation, opacity, exportSize, customWidth, customHeight]);

  useEffect(() => {
    generatePattern();
  }, [generatePattern]);

  const handleRandomize = () => {
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const patternTypes: PatternType[] = ['circles', 'squares', 'triangles', 'hexagons', 'zigzag', 'polkaDots', 'stripes', 'chevron'];
    
    setPatternType(patternTypes[Math.floor(Math.random() * patternTypes.length)]);
    setPatternColor(randomColor());
    setBackgroundColor(randomColor());
    setSize(Math.floor(Math.random() * 40) + 10);
    setSpacing(Math.floor(Math.random() * 20));
    setRotation(Math.floor(Math.random() * 360));
    setOpacity(Math.floor(Math.random() * 100) + 1);
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pattern_${exportSize}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('SVG pattern downloaded successfully!');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(svgCode).then(() => {
      toast.success('SVG code copied to clipboard!');
    }, () => {
      toast.error('Failed to copy SVG code.');
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">SVG Pattern Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Pattern Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pattern-type" className="text-white mb-2 block">Pattern Type</Label>
                  <Select value={patternType} onValueChange={(value: PatternType) => setPatternType(value)}>
                    <SelectTrigger id="pattern-type" className="bg-gray-700 text-white border-gray-600 ">
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
                      <SelectItem value="drop">Drop</SelectItem>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="fungi">Fungi</SelectItem>
                        <SelectItem value="leaf">Leaf</SelectItem>
                        <SelectItem value="flower">Flower</SelectItem>
                        <SelectItem value="ring">Ring</SelectItem>
                        <SelectItem value="donut">Donut</SelectItem>
                        <SelectItem value="signal">Signal</SelectItem>
                        <SelectItem value="nestedTriangle">Nested Triangle</SelectItem>
                        <SelectItem value="plus">Plus</SelectItem>
                        <SelectItem value="minus">Minus</SelectItem>
                        <SelectItem value="multiply">Multiply</SelectItem>
                        <SelectItem value="rhombus">Rhombus</SelectItem>
                        <SelectItem value="mandala">Mandala</SelectItem>
                        <SelectItem value="parquet">Parquet</SelectItem>
                        <SelectItem value="layers">Layers</SelectItem>
                        <SelectItem value="cloudLine">Cloud Line</SelectItem>
                        <SelectItem value="cloudSolid">Cloud Solid</SelectItem>
                        <SelectItem value="flashSolid">Flash Solid</SelectItem>
                        <SelectItem value="flashLine">Flash Line</SelectItem>
                        <SelectItem value="gearSolid">Gear Solid</SelectItem>
                        <SelectItem value="gearLine">Gear Line</SelectItem>
                        <SelectItem value="paperPlaneSolid">Paper Plane Solid</SelectItem>
                        <SelectItem value="paperPlaneLine">Paper Plane Line</SelectItem>
                        <SelectItem value="chatSolid">Chat Solid</SelectItem>
                        <SelectItem value="chatLine">Chat Line</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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

                <div>
                  <Label htmlFor="size-slider" className="text-white mb-2 block">Size: {size}px</Label>
                  <Slider
                    id="size-slider"
                    min={5}
                    max={100}
                    step={1}
                    value={size}
                    onChange={(value) => setSize(value)}
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
                  />
                </div>

                <div>
                  <Label htmlFor="rotation-slider" className="text-white mb-2 block">Rotation: {rotation}°</Label>
                  <Slider
                    id="rotation-slider"
                    min={0}
                    max={360}
                    step={1}
                    value={rotation}
                    onChange={(value) => setRotation(value)}
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
                  />
                </div>

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
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Pattern Preview</h2>
              <div className="bg-white rounded-lg overflow-hidden" style={{ height: '300px' }}>
                <div dangerouslySetInnerHTML={{ __html: svgCode }} style={{ width: '100%', height: '100%' }} />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download SVG
                </Button>
                <Button onClick={handleCopyToClipboard} className="bg-green-600 hover:bg-green-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy SVG Code
                </Button>
                <Button onClick={handleRandomize} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Randomize
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Choose a pattern type from the dropdown menu.</li>
            <li>Adjust the pattern color and background color using the color pickers.</li>
            <li>Use the sliders to modify the size, spacing, rotation, and opacity of the pattern elements.</li>
            <li>Select an export size from the dropdown or choose "Custom Size" to enter specific dimensions.</li>
            <li>Preview the pattern in real-time as you make changes.</li>
            <li>Click "Download SVG" to save the pattern as an SVG file.</li>
            <li>Use "Copy SVG Code" to copy the SVG code to your clipboard for use in web projects.</li>
            <li>Click "Randomize" to generate a completely random pattern.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Experiment with different pattern types and color combinations to create unique designs.</li>
            <li>Adjust the spacing and size to create dense or sparse patterns.</li>
            <li>Try different rotation angles to add variety to your patterns.</li>
            <li>Use lower opacity values to create subtle, watermark-like patterns.</li>
            <li>Utilize the various export sizes for different social media platforms and use cases.</li>
            <li>For web backgrounds, consider using larger sizes and repeating patterns.</li>
            <li>Combine multiple patterns by layering SVGs in your design software for more complex designs.</li>
            <li>Use the custom size option for specific project requirements or to create seamless tiles.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}