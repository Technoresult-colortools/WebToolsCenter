'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Upload, Download, RefreshCw, } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type CensorType = 'blur' | 'pixelate' | 'black';

export default function PhotoCensor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [censoredImage, setCensoredImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [censorType, setCensorType] = useState<CensorType>('blur');
  const [intensity, setIntensity] = useState<number>(10);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setCensoredImage(null);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const applyCensor = useCallback(() => {
    if (!imageRef.current || !completedCrop || !canvasRef.current) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    const pixelRatio = window.devicePixelRatio;
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.scale(pixelRatio, pixelRatio);

    if (censorType === 'blur') {
      ctx.filter = `blur(${intensity}px)`;
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        cropX,
        cropY,
        cropWidth,
        cropHeight
      );
    } else if (censorType === 'pixelate') {
      const pixelSize = intensity;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        cropX,
        cropY,
        cropWidth / pixelSize,
        cropHeight / pixelSize
      );
      ctx.drawImage(
        canvas,
        cropX,
        cropY,
        cropWidth / pixelSize,
        cropHeight / pixelSize,
        cropX,
        cropY,
        cropWidth,
        cropHeight
      );
    } else if (censorType === 'black') {
      ctx.fillStyle = 'black';
      ctx.fillRect(cropX, cropY, cropWidth, cropHeight);
    }

    ctx.scale(1 / pixelRatio, 1 / pixelRatio);
    ctx.filter = 'none';

    const censoredDataUrl = canvas.toDataURL('image/png');
    setCensoredImage(censoredDataUrl);
    toast.success('Censoring applied successfully!');
  }, [completedCrop, censorType, intensity]);

  const handleDownload = () => {
    if (!censoredImage) return;

    const link = document.createElement('a');
    link.href = censoredImage;
    link.download = 'censored-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Censored image downloaded successfully!');
  };

  const handleReset = () => {
    setOriginalImage(null);
    setCensoredImage(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setCensorType('blur');
    setIntensity(10);
    toast.success('All settings reset!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Photo Censor</h1>

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
                <h3 className="text-xl font-bold text-white mb-4">Select Area to Censor</h3>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    ref={imageRef}
                    src={originalImage}
                    alt="Original"
                    style={{ maxWidth: '100%', maxHeight: '500px' }}
                  />
                </ReactCrop>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Censoring Options</h3>
                <RadioGroup value={censorType} onValueChange={(value: string) => setCensorType(value as CensorType)} className="mb-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="blur" id="blur" />
                        <Label htmlFor="blur" className="text-white">Blur</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pixelate" id="pixelate" />
                        <Label htmlFor="pixelate" className="text-white">Pixelate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="black" id="black" />
                        <Label htmlFor="black" className="text-white">Black-out</Label>
                    </div>
                </RadioGroup>

  
   

                {censorType !== 'black' && (
                  <div className="mb-4">
                    <Label htmlFor="intensity" className="text-white mb-2 block">
                      Intensity: {intensity}
                    </Label>
                    <Slider
                      id="intensity"
                      min={1}
                      max={20}
                      step={1}
                      value={intensity}
                      onChange={(value) => setIntensity(value)}
                    />
                  </div>
                )}

                <Button onClick={applyCensor} className="bg-green-600 hover:bg-green-700 text-white">
                  Apply Censoring
                </Button>
              </div>

              {censoredImage && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Censored Image Preview</h3>
                  <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={censoredImage} 
                      alt="Censored" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handleDownload} disabled={!censoredImage} className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                  <Download className="h-5 w-5 mr-2" />
                  Download Censored Image
                </Button>
                <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Click the "Select an image file" button to upload your image.</li>
            <li>Once uploaded, you'll see the original image.</li>
            <li>Click and drag on the image to select the area you want to censor.</li>
            <li>Choose a censoring method: Blur, Pixelate, or Black-out.</li>
            <li>For Blur and Pixelate, adjust the intensity using the slider.</li>
            <li>Click "Apply Censoring" to see the result.</li>
            <li>If satisfied, click "Download Censored Image" to save the result.</li>
            <li>Use the "Reset" button to start over or adjust settings.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>You can select multiple areas to censor by applying censoring multiple times.</li>
            <li>Blur is best for subtle censoring, while Black-out provides complete coverage.</li>
            <li>Pixelate can be useful for creating a retro or artistic effect.</li>
            <li>Higher intensity values create stronger censoring effects.</li>
            <li>You can combine different censoring methods on the same image.</li>
            <li>For precise selection, try zooming in on your browser before selecting the area.</li>
            <li>Remember to respect privacy and copyright when censoring and sharing images.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}