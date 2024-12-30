'use client'

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/Button";
import { Toaster, toast } from 'react-hot-toast';
import { RotateCw, CropIcon, RefreshCw, Upload, Info, BookOpen, Lightbulb, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image';
import { Select } from '@/components/ui/select1';

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

const aspectRatioOptions = [
  { value: '16:9', label: '16:9 - Landscape' },
  { value: '4:3', label: '4:3 - Standard' },
  { value: '1:1', label: '1:1 - Square' },
  { value: '2:3', label: '2:3 - Portrait' },
  { value: '9:16', label: '9:16 - Mobile' },
  { value: '3:4', label: '3:4 - Classic Portrait' },
  { value: '3:2', label: '3:2 - Classic Photo' },
  { value: '21:9', label: '21:9 - Ultrawide' },
  { value: 'free', label: 'Free Selection' },
];

const imageFormatOptions = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
];

export default function EnhancedImageCropper() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined); // Default to free selection
  const imgRef = useRef<HTMLImageElement>(null);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [imageFormat, setImageFormat] = useState('image/png');
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);

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

  const calculateDimensions = () => {
    if (!naturalWidth || !naturalHeight) return { width: 0, height: 0 };
    
    const containerWidth = 800; // Maximum width
    const containerHeight = 600; // Maximum height
    
    const ratio = Math.min(
      containerWidth / naturalWidth,
      containerHeight / naturalHeight
    );
    
    return {
      width: naturalWidth * ratio,
      height: naturalHeight * ratio
    };
  };

  const dimensions = calculateDimensions();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setNaturalWidth(e.currentTarget.naturalWidth);
    setNaturalHeight(e.currentTarget.naturalHeight);
    
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
    setAspect(undefined);
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
    
    if (imgRef.current && value !== 'free') {
      const { width, height } = imgRef.current;
      const [aspectWidth, aspectHeight] = value.split(':').map(Number);
      setCrop(centerAspectCrop(width, height, aspectWidth / aspectHeight));
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
      description="Edit and customize your images with precision using the Enhanced Image Cropper"
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
            <div className="relative w-full h-[600px] border-4 border-blue-500 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-w-full max-h-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{
                    transform: `rotate(${rotate}deg) scale(${scale})`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    objectFit: 'contain'
                  }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          </div>
        ) : (
          <div className="w-full h-[600px] bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-400">Upload an image to start cropping</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center mt-4 mb-4 gap-4">
        <Select
          label="Select AspectRatio"
          options={aspectRatioOptions}
          selectedKey={aspect ? (aspect === 16/9 ? "16:9" : aspect === 4/3 ? "4:3" : aspect === 1 ? "1:1" : aspect === 2/3 ? "2:3" : aspect === 9/16 ? "9:16" : aspect === 3/4 ? "3:4" : aspect === 3/2 ? "3:2" : aspect === 21/9 ? "21:9" : "free") : "free"}
          onSelectionChange={(value) => handleAspectChange(value)}
          placeholder="Aspect Ratio"
        />

          <Select
            label="Select Image Format"
            options={imageFormatOptions}
            selectedKey={imageFormat}
            onSelectionChange={(value) => setImageFormat(value)}
            placeholder="Image Format"
          />

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
          What is the Image Cropper?
        </h2>
        <p className="text-gray-300 mb-4">
          The Image Cropper is a powerful and user-friendly tool designed for precise image editing. It offers a wide range of features to help you customize your images for various purposes, from social media posts to professional print materials. With its intuitive interface and advanced capabilities, you can easily crop, rotate, and adjust your images to achieve the perfect look.
        </p>
        <p className="text-gray-300 mb-4">
          Whether you're a professional designer, a social media manager, or just someone who wants to enhance their personal photos, our Enhanced Image Cropper provides you with the flexibility and control you need. It's like having a professional photo editing studio right in your browser!
        </p>

        <div className="my-8">
          <Image 
            src="/Images/ImageCropperPreview.png?height=400&width=600" 
            alt="Screenshot of the Enhanced Image Cropper interface showing image upload area, cropping preview, and control options" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Image Cropper?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Upload an image by dragging and dropping it into the designated area or by clicking to browse your files.</li>
          <li>Once your image is loaded, use your mouse to select the area you want to crop.</li>
          <li>Adjust the crop selection by dragging the corners or edges of the blue border box.</li>
          <li>Choose an aspect ratio from the dropdown menu, or use "Free Selection" for custom cropping.</li>
          <li>If needed, use the "Rotate" button to adjust the image orientation.</li>
          <li>Select your desired output format (PNG, JPEG, or WebP) from the "Image Format" dropdown.</li>
          <li>Click the "Crop" button when you're satisfied with your selection.</li>
          <li>After cropping, you can make further adjustments or download your cropped image.</li>
          <li>Use the "Download" button to save your cropped image in the chosen format.</li>
          <li>If you want to start over, click the "Reset" button to revert to the original image.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Intuitive drag-and-drop interface for easy image uploading</li>
          <li>Precise cropping with adjustable aspect ratios and free selection mode</li>
          <li>Constant blue border box for clear visibility of the crop area</li>
          <li>Image rotation functionality for perfect alignment</li>
          <li>High-quality output with enlarged cropped images</li>
          <li>Multiple output formats: PNG, JPEG, and WebP</li>
          <li>Ability to make multiple crops on the same image</li>
          <li>Real-time preview of crop selection</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Simple and clean user interface for effortless navigation</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Social Media:</strong> Create perfectly sized images for various social media platforms.</li>
          <li><strong>Web Design:</strong> Crop and adjust images for website headers, banners, and thumbnails.</li>
          <li><strong>E-commerce:</strong> Prepare product images with consistent aspect ratios and sizes.</li>
          <li><strong>Digital Marketing:</strong> Create visually appealing graphics for online campaigns and advertisements.</li>
          <li><strong>Photography:</strong> Fine-tune composition and framing of photographs.</li>
          <li><strong>Graphic Design:</strong> Prepare images for integration into larger design projects.</li>
          <li><strong>Print Media:</strong> Adjust images for use in brochures, flyers, and other printed materials.</li>
          <li><strong>Personal Use:</strong> Crop and edit personal photos for albums, profiles, or sharing.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to start cropping and perfecting your images? Dive into our Enhanced Image Cropper tool now and experience the power of professional-grade image editing right in your browser. Whether you're working on a professional project or just want to enhance your personal photos, our tool provides the precision and flexibility you need to achieve outstanding results. Try it out and see how it can transform your image editing process!
        </p>
      </div>
    </ToolLayout>
  );
}