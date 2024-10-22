'use client'
import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { RotateCw, Crop as CropIcon, RefreshCw, Upload, Info, BookOpen, Lightbulb, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout'

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
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

export default function EnhancedImageCropper() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const imgRef = useRef<HTMLImageElement>(null);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [imageFormat, setImageFormat] = useState('image/png');

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const cropImage = useCallback(() => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    // Increase the size of the canvas for better quality
    const outputWidth = completedCrop.width * scaleX * 2;
    const outputHeight = completedCrop.height * scaleY * 2;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.save();
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-outputWidth / 2, -outputHeight / 2);

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight
    );

    ctx.restore();

    const croppedImageUrl = canvas.toDataURL(imageFormat, 1.0);
    setImgSrc(croppedImageUrl);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setRotate(0);
    setScale(1);
    setAspect(undefined); // Switch to free selection after cropping
    toast.success('Image cropped successfully!');
  }, [completedCrop, rotate, scale, imageFormat]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setRotate(0);
    setScale(1);
    setAspect(16 / 9);
  };

  const handleRotate = () => {
    setRotate((prevRotate) => (prevRotate + 90) % 360);
  };

  const handleAspectChange = (value: string) => {
    if (value === 'free') {
      setAspect(undefined);
    } else {
      const [width, height] = value.split(':').map(Number);
      setAspect(width / height);
    }
    
    if (imgRef.current && aspect) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const handleDownload = () => {
    if (!imgSrc) return;

    const link = document.createElement('a');
    link.download = `cropped-image.${imageFormat.split('/')[1]}`;
    link.href = imgSrc;
    link.click();
  };

  return (
    <ToolLayout
      title="Image Cropper"
      description="Edit and customize your images with precision using the Enhanced Image Cropper. Perfect for social media, websites, or print, offering flexibility and professional results"
    >

    <Toaster position="top-right" />


          <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mb-8">
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer mb-8"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-400">Drag your image here, or click to browse</p>
              </label>
            </div>

            {imgSrc ? (
              <div className="mb-8">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{
                      transform: `rotate(${rotate}deg) scale(${scale})`,
                      maxWidth: '100%',
                      maxHeight: '70vh',
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            ) : (
              <div className="bg-gray-700 rounded-lg p-16 text-center mb-8">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-400">Upload an image to start cropping</p>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
              <Select onValueChange={handleAspectChange} value={aspect ? `${aspect}` : 'free'}>
                <SelectTrigger className="w-[180px] bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Aspect Ratio" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="free">Free Selection</SelectItem>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectItem value="1:1">1:1</SelectItem>
                  <SelectItem value="2:3">2:3</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setImageFormat} value={imageFormat}>
                <SelectTrigger className="w-[180px] bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Image Format" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="image/png">PNG</SelectItem>
                  <SelectItem value="image/jpeg">JPEG</SelectItem>
                  <SelectItem value="image/webp">WebP</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleRotate} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
                <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={cropImage}
                  disabled={!completedCrop?.width || !completedCrop?.height}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CropIcon className="w-4 h-4 mr-2" />
                  Crop
                </Button>
                <Button 
                  onClick={handleDownload}
                  disabled={!imgSrc}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Enhanced Image Cropper
            </h2>
            <p className="text-gray-300 mb-4">
              The Enhanced Image Cropper is a sophisticated tool designed for both casual users and professionals. It offers a wide range of features to edit and customize your images with precision and flexibility. Whether you're preparing visuals for social media, adjusting photos for your website, or fine-tuning images for print, this tool provides the capabilities you need for perfect results every time.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Enhanced Image Cropper
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Upload an image by dragging and dropping or clicking to browse.</li>
              <li>Use your mouse to select the area you want to crop.</li>
              <li>Adjust the selection by dragging the corners or edges of the crop box.</li>
              <li>Choose an aspect ratio or use free selection for custom cropping.</li>
              <li>Use the rotate button to adjust the image orientation if needed.</li>
              <li>Select your desired output image format (PNG, JPEG, or WebP).</li>
              <li>Click the "Crop" button when you're satisfied with your selection.</li>
              <li>After cropping, you can continue to make further adjustments in free selection mode.</li>
              <li>Use the "Download" button to save your cropped image in the chosen format.</li>
              <li>Use the "Reset" button to start over with the original image.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Intuitive drag-and-drop interface for easy image uploading</li>
              <li>Precise cropping with adjustable aspect ratios and free selection mode</li>
              <li>Image rotation functionality for perfect alignment</li>
              <li>High-quality output with enlarged cropped images</li>
              <li>Multiple output formats: PNG, JPEG, and WebP</li>
              <li>Ability to make multiple crops on the same image</li>
              <li>Real-time preview of crop selection</li>
              <li>Responsive design for seamless use on desktop and mobile devices</li>
              <li>Simple and clean user interface for effortless navigation</li>
              <li>Direct download option for quick saving of cropped images</li>
            </ul>
          </div>
  </ToolLayout>
  );
}