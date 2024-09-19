'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import Slider from "@/components/ui/Slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Upload, Download, RefreshCw, ZoomIn, ZoomOut, RotateCw, Crop as CropIcon, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CONTAINER_WIDTH = 600;
const CONTAINER_HEIGHT = 400;

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setCroppedImageUrl(null);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  useEffect(() => {
    if (imageRef.current && aspect) {
      const { width, height } = imageRef.current;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }, [aspect]);

  const handleZoomIn = () => setZoom(prevZoom => Math.min(prevZoom + 0.1, 3));
  const handleZoomOut = () => setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.1));
  const handleRotate = () => setRotation(prevRotation => (prevRotation + 90) % 360);

  const getCroppedImg = useCallback((image: HTMLImageElement, crop: PixelCrop, rotation = 0) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const rotateRads = rotation * Math.PI / 180;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.rotate(rotateRads);
    ctx.scale(1 / zoom, 1 / zoom);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
  }, [zoom]);

  const handleCrop = useCallback(async () => {
    if (!imageRef.current || !completedCrop) return;

    try {
      const croppedImage = await getCroppedImg(
        imageRef.current,
        completedCrop,
        rotation
      );
      setCroppedImageUrl(croppedImage);
      toast.success('Image cropped successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to crop image');
    }
  }, [completedCrop, rotation, getCroppedImg]);

  const handleDownload = () => {
    if (!croppedImageUrl) return;

    const link = document.createElement('a');
    link.download = 'cropped-image.png';
    link.href = croppedImageUrl;
    link.click();
    toast.success('Image downloaded successfully!');
  };

  const handleReset = () => {
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setZoom(1);
    setRotation(0);
    setCroppedImageUrl(null);
    setAspect(16 / 9);
  };

  const handleAspectChange = (value: string) => {
    if (value === 'free') {
      setAspect(undefined);
    } else {
      const [width, height] = value.split(':').map(Number);
      setAspect(width / height);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image Cropper</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Upload an Image</h2>
            {!imageSrc ? (
              <label className="flex flex-col items-center justify-center h-96 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
                <Upload size={48} />
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input type="file" className="hidden" onChange={onSelectFile} accept="image/*" />
              </label>
            ) : (
              <div className="relative">
                <div 
                  className="relative h-96 bg-gray-700 rounded-lg overflow-hidden cursor-crosshair"
                  style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT, margin: '0 auto' }}
                >
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                  >
                    <img
                      ref={imageRef}
                      alt="Crop me"
                      src={imageSrc}
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
                <button
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600 transition duration-300"
                  onClick={handleReset}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {imageSrc && (
            <>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Button onClick={handleZoomIn} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ZoomIn className="h-5 w-5 mr-2" />
                  Zoom In
                </Button>
                <Button onClick={handleZoomOut} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ZoomOut className="h-5 w-5 mr-2" />
                  Zoom Out
                </Button>
                <Button onClick={handleRotate} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <RotateCw className="h-5 w-5 mr-2" />
                  Rotate
                </Button>
                <Button onClick={handleCrop} className="bg-green-600 hover:bg-green-700 text-white">
                  <CropIcon className="h-5 w-5 mr-2" />
                  Crop
                </Button>
                <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleDownload} disabled={!croppedImageUrl} className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </Button>
              </div>

              <div className="mb-6">
                <Label htmlFor="zoom-slider" className="text-white mb-2 block">Zoom: {zoom.toFixed(1)}x</Label>
                <Slider
                  id="zoom-slider"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(value) => setZoom(value)}
                  className="mt-2"
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="rotation-slider" className="text-white mb-2 block">Rotation: {rotation}°</Label>
                <Slider
                  id="rotation-slider"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(value) => setRotation(value)}
                  className="mt-2"
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="aspect-ratio" className="text-white mb-2 block">Aspect Ratio</Label>
                <Select onValueChange={handleAspectChange}>
                  <SelectTrigger id="aspect-ratio" className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="2:3">2:3</SelectItem>
                    <SelectItem value="free">Free Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {croppedImageUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Cropped Image Preview</h3>
              <div className="relative h-96 bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={croppedImageUrl} 
                  alt="Cropped" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            style={{
              display: 'none',
            }}
          />
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Click the "Select a file" button or drag and drop an image into the designated area.</li>
            <li>Once the image is loaded, you can drag to select the area you want to crop.</li>
            <li>Use the zoom buttons or slider to adjust the image size.</li>
            <li>Use the rotate button or slider to adjust the image rotation.</li>
            <li>Select an aspect ratio or use free selection for custom cropping.</li>
            <li>Click the "Crop" button to apply the crop to your image.</li>
            <li>The cropped image will be displayed in the preview area.</li>
            <li>Click the "Download" button to save your cropped image.</li>
            <li>Use the "Reset" button to start over with a new image.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>The image is displayed in a fixed container for consistent layout.</li>
            <li>You can fine-tune your selection by dragging the corners or edges of the crop box.</li>
            <li>Zoom in for more precise cropping, especially with smaller details.</li>
            <li>Experiment with different rotations to get the perfect angle for your image.</li>
            <li>Try different aspect ratios to fit your specific needs (e.g., social media posts, profile pictures).</li>
            <li>Use the free selection option for custom crop shapes.</li>
            <li>After cropping, you can continue to adjust and crop again before downloading.</li>
            <li>The cropped image will be downloaded as a PNG file to preserve quality.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}