'use client';

import React, { useState, useRef, } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import Checkbox from "@/components/ui/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Upload, Download, RefreshCw, ArrowLeftRight, } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ImageResizer() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<string>('png');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          setWidth(img.width);
          setHeight(img.height);
          setResizedImage(null);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setWidth(newWidth);
    if (preserveAspectRatio && originalImage) {
      setHeight(Math.round(newWidth / (originalImage.width / originalImage.height)));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    setHeight(newHeight);
    if (preserveAspectRatio && originalImage) {
      setWidth(Math.round(newHeight * (originalImage.width / originalImage.height)));
    }
  };

  const handlePreserveAspectRatioChange = (checked: boolean) => {
    setPreserveAspectRatio(checked);
    if (checked && originalImage) {
      setHeight(Math.round(width / (originalImage.width / originalImage.height)));
    }
  };

  const handleResize = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(originalImage, 0, 0, width, height);

    const resizedDataUrl = canvas.toDataURL(`image/${format}`);
    setResizedImage(resizedDataUrl);
    toast.success('Image resized successfully!');
  };

  const handleDownload = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `resized-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Image downloaded as ${format.toUpperCase()}!`);
  };

  const handleReset = () => {
    if (originalImage) {
      setWidth(originalImage.width);
      setHeight(originalImage.height);
    }
    setResizedImage(null);
    setPreserveAspectRatio(true);
    setFormat('png');
    toast.success('Settings reset to original!');
  };

  const handleSwapDimensions = () => {
    setWidth(height);
    setHeight(width);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image Resizer</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Upload Image</h2>
            <label className="flex flex-col items-center justify-center h-32 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
              <Upload size={32} />
              <span className="mt-2 text-base leading-normal">Select an image file</span>
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>

          {originalImage && (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Original Image</h3>
                <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={originalImage.src} 
                    alt="Original" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <p className="text-white mt-2">Original size: {originalImage.width} x {originalImage.height}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Resize Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width" className="text-white mb-2 block">Width</Label>
                    <div className="flex items-center">
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={handleWidthChange}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                      <span className="text-white ml-2">px</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-white mb-2 block">Height</Label>
                    <div className="flex items-center">
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={handleHeightChange}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                      <span className="text-white ml-2">px</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <Button onClick={handleSwapDimensions} className="bg-blue-600 hover:bg-blue-700 text-white mr-4">
                    <ArrowLeftRight className="h-5 w-5 mr-2" />
                    Swap Dimensions
                  </Button>
                  <Checkbox
                    id="preserve-aspect-ratio"
                    checked={preserveAspectRatio}
                    onChange={handlePreserveAspectRatioChange}
                  />
                  <Label
                    htmlFor="preserve-aspect-ratio"
                    className="text-white ml-2 cursor-pointer"
                  >
                    Preserve aspect ratio
                  </Label>
                </div>
              </div>

              <div className="mb-8">
                <Label htmlFor="format" className="text-white mb-2 block">Output Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format" className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button onClick={handleResize} className="bg-green-600 hover:bg-green-700 text-white">
                  Resize Image
                </Button>
                <Button onClick={handleDownload} disabled={!resizedImage} className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                  <Download className="h-5 w-5 mr-2" />
                  Download Resized Image
                </Button>
                <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {resizedImage && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Resized Image Preview</h3>
                  <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={resizedImage} 
                      alt="Resized" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <p className="text-white mt-2">Resized to: {width} x {height}</p>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Click the "Select an image file" button to upload your image.</li>
            <li>Once uploaded, you'll see the original image and its dimensions.</li>
            <li>Enter the desired width and height for your resized image.</li>
            <li>Use the "Swap Dimensions" button to quickly switch width and height.</li>
            <li>Check or uncheck "Preserve aspect ratio" as needed.</li>
            <li>Select the output format (PNG, JPEG, or WebP).</li>
            <li>Click "Resize Image" to generate the resized version.</li>
            <li>Preview the resized image and its new dimensions.</li>
            <li>Click "Download Resized Image" to save the result.</li>
            <li>Use the "Reset" button to start over or adjust settings.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Preserving aspect ratio ensures your image doesn't look stretched or distorted.</li>
            <li>Use the "Swap Dimensions" button to quickly create portrait or landscape versions.</li>
            <li>PNG is best for images with transparency or sharp edges.</li>
            <li>JPEG is ideal for photographs and complex images with many colors.</li>
            <li>WebP often provides the best compression while maintaining quality.</li>
            <li>You can resize multiple times before downloading to find the perfect size.</li>
            <li>The preview helps you check the quality before downloading.</li>
            <li>Remember, enlarging a small image may result in loss of quality.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}