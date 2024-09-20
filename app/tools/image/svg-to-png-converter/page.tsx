'use client';

import React, { useState, useRef, useCallback } from 'react';
import NextImage from 'next/image';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Upload, Download, RefreshCw, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SvgToPngConverter() {
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [pngUrl, setPngUrl] = useState<string>('');
  const [scale, setScale] = useState<number>(1);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [showBackground, setShowBackground] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      setSvgFile(file);
      const url = URL.createObjectURL(file);
      setSvgUrl(url);
      setPngUrl('');
      setError(null);
      loadSvgDimensions(url);
      toast.success('SVG file uploaded successfully!');
    } else {
      toast.error('Please upload a valid SVG file.');
    }
  };

  const handleUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setSvgUrl(url);
    setPngUrl('');
    setError(null);
    if (url) {
      loadSvgDimensions(url);
    }
  };

  const loadSvgDimensions = (url: string) => {
    const img = new Image();
    img.onload = () => {
      setSvgDimensions({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      setError('Failed to load SVG dimensions.');
      toast.error('Failed to load SVG.');
    };
    img.src = url;
  };

  const handleConvert = useCallback(async () => {
    if (!svgUrl) {
      toast.error('Please upload an SVG file or enter a valid SVG URL.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(svgUrl);
      if (!response.ok) throw new Error('Failed to fetch SVG');
      const svgText = await response.text();
      
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            if (showBackground) {
              ctx.fillStyle = backgroundColor;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            try {
              const pngDataUrl = canvas.toDataURL('image/png');
              setPngUrl(pngDataUrl);
              toast.success('SVG converted to PNG successfully!');
            } catch (e) {
              setError('Failed to generate PNG. The image might be tainted by cross-origin data.');
              toast.error('Conversion failed. Please try uploading the SVG file directly.');
            }
          }
        }
        setIsLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load SVG. Please check the URL or file.');
        toast.error('Failed to load SVG.');
        setIsLoading(false);
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgText);
    } catch (e) {
      setError('Failed to fetch or process the SVG. It might be due to CORS restrictions.');
      toast.error('Failed to process SVG. Try uploading the file directly.');
      setIsLoading(false);
    }
  }, [svgUrl, scale, backgroundColor, showBackground]);

  const handleDownload = () => {
    if (pngUrl) {
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'converted-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PNG file downloaded successfully!');
    } else {
      toast.error('Please convert the SVG to PNG first.');
    }
  };

  const handleReset = () => {
    setSvgFile(null);
    setSvgUrl('');
    setPngUrl('');
    setScale(1);
    setBackgroundColor('#ffffff');
    setShowBackground(true);
    setError(null);
    toast.success('All settings reset.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">SVG to PNG Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Upload SVG or Enter URL</h2>
            <div className="flex flex-col space-y-4">
              <label className="flex flex-col items-center justify-center h-32 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
                <Upload size={32} />
                <span className="mt-2 text-base leading-normal">Select SVG file</span>
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".svg,image/svg+xml" />
              </label>
              {svgFile && (
                <p className="text-white mt-2">Uploaded File: {svgFile.name}</p>
              )}
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Or enter SVG URL"
                  value={svgUrl}
                  onChange={handleUrlInput}
                  className="flex-grow bg-gray-700 text-white border-gray-600"
                />
                <Button onClick={handleConvert} className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                  {isLoading ? 'Converting...' : 'Convert'}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-600 text-white rounded-lg flex items-center">
              <AlertTriangle className="mr-2" />
              <p>{error}</p>
            </div>
          )}

          {svgUrl && !error && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">SVG Preview</h3>
              {svgDimensions.width > 0 && svgDimensions.height > 0 && (
                <div className="mb-4 text-white">
                  <p>SVG Dimensions: {svgDimensions.width} x {svgDimensions.height}</p>
                </div>
              )}
              <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
                <NextImage 
                  src={svgUrl} 
                  alt="SVG Preview"
                  fill 
                  style={{ 
                    objectFit: 'contain',
                    backgroundColor: showBackground ? backgroundColor : 'transparent'
                  }}
                />
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Conversion Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="scale-slider" className="text-white mb-2 block">Scale: {scale.toFixed(1)}x</Label>
                <Slider
                  id="scale-slider"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={scale}
                  onChange={(value) => setScale(value)}
                  className="mt-2"
                />
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
                  <Button
                    onClick={() => setShowBackground(!showBackground)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {showBackground ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {pngUrl && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">PNG Preview</h3>
              <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
                <NextImage
                  src={pngUrl}
                  alt="PNG Preview"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download size={20} />
              <span className="ml-2">Download PNG</span>
            </Button>
            <Button onClick={handleReset} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <RefreshCw size={20} />
              <span className="ml-2">Reset</span>
            </Button>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Upload an SVG file using the file input or enter a valid SVG URL.</li>
            <li>Adjust the scale to increase or decrease the size of the output PNG.</li>
            <li>Choose a background color for the PNG (optional).</li>
            <li>Toggle background visibility with the eye icon.</li>
            <li>Click the "Convert to PNG" button to generate the PNG image.</li>
            <li>Preview the converted PNG image.</li>
            <li>Click the "Download PNG" button to save the converted image.</li>
            <li>Use the "Reset" button to clear all settings and start over.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>For best results, use high-quality SVG files.</li>
            <li>Adjust the scale to get the desired PNG resolution.</li>
            <li>Experiment with different background colors to complement your SVG.</li>
            <li>Toggle background visibility to create PNGs with transparent backgrounds.</li>
            <li>You can convert multiple SVGs in succession without reloading the page.</li>
            <li>The preview feature allows you to check the result before downloading.</li>
            <li>If you encounter issues with SVG URLs, try downloading the SVG and uploading it directly.</li>
            <li>Some SVGs from external sources may not convert due to CORS restrictions. In such cases, download the SVG and upload it manually.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}