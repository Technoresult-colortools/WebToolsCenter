'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import { Label } from "@/components/ui/label"
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { RotateCw, Crop as CropIcon, RefreshCw, Download, Upload } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const [imgSrc, setImgSrc] = useState('');
  const [croppedImgSrc, setCroppedImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setCroppedImgSrc('');
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setCroppedImgSrc('');
      });
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const cropImage = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    const offscreen = new OffscreenCanvas(completedCrop.width, completedCrop.height);
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    const blob = await offscreen.convertToBlob({ type: 'image/png' });
    const croppedImageUrl = URL.createObjectURL(blob);
    setCroppedImgSrc(croppedImageUrl);
    toast.success('Image cropped successfully!');
  }, [completedCrop]);

  const handleDownloadCrop = () => {
    if (!croppedImgSrc) return;
    const link = document.createElement('a');
    link.href = croppedImgSrc;
    link.download = 'cropped-image.png';
    link.click();
  };

  const handleAspectChange = useCallback((value: string) => {
    if (value === 'free') {
      setAspect(undefined);
    } else {
      const [width, height] = value.split(':').map(Number);
      setAspect(width / height);
    }
    
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newAspect = value === 'free' ? undefined : aspect;
      setCrop(newAspect ? centerAspectCrop(width, height, newAspect) : undefined);
    }
  }, [aspect]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1);
    setScale(Math.max(0.1, Math.min(newScale, 3)));
  };

  const handleReset = () => {
    setImgSrc('');
    setCroppedImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    setRotate(0);
    setAspect(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Image Cropper</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <div 
            className="mb-4 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer"
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
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-400">Drag your image here, or click to browse</p>
            </label>
          </div>

          {Boolean(imgSrc) && !croppedImgSrc && (
            <div onWheel={handleWheel} className="relative flex justify-center items-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-h-[60vh] w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                  className="max-w-full h-auto"
                />
              </ReactCrop>
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white opacity-50"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {croppedImgSrc && (
            <div className="flex justify-center items-center">
              <img src={croppedImgSrc} alt="Cropped" className="max-h-[60vh] max-w-full" />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
            <Label htmlFor="aspect-ratio" className="text-white">Aspect Ratio:</Label>
            <Select onValueChange={handleAspectChange} value={aspect ? `${aspect}` : 'free'}>
              <SelectTrigger id="aspect-ratio" className="w-[140px] bg-gray-700 text-white text-sm">
                <SelectValue placeholder="Aspect Ratio" />
              </SelectTrigger>
              <SelectContent className="w-[180px] bg-gray-700 text-white border-gray-600">
                <SelectItem value="free">Free Selection</SelectItem>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="2:3">2:3</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setRotate((r) => (r + 90) % 360)} className="bg-blue-600 hover:bg-blue-700 text-sm">
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
              <Button
                onClick={cropImage}
                disabled={!completedCrop?.width || !completedCrop?.height}
                className="bg-green-600 hover:bg-green-700 text-sm"
              >
                <CropIcon className="w-4 h-4 mr-2" />
                Crop
              </Button>
              <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleDownloadCrop}
                disabled={!croppedImgSrc}
                className="bg-purple-600 hover:bg-purple-700 text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">About Image Cropper</h2>
            <p className="text-white">
              The Image Cropper is a powerful and user-friendly tool designed to help you edit and customize your images with ease. Whether you're preparing visuals for social media, adjusting photos for your website, or simply want to focus on a specific part of an image, our Image Cropper provides the flexibility and precision you need.
            </p>
            <p className="text-white">
              With features like free-form selection, preset aspect ratios, image rotation, and zoom capabilities, you have complete control over your image editing process. The intuitive interface allows for quick adjustments, while the real-time preview ensures you get exactly the crop you want.
            </p>
            <p className="text-white">
              Perfect for designers, marketers, social media managers, or anyone looking to enhance their visual content, the Image Cropper streamlines your workflow and helps you achieve professional-looking results in just a few clicks.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">How to Use Image Cropper?</h2>
            <ol className="list-decimal list-inside text-white space-y-2">
              <li>Upload an image by dragging and dropping it onto the designated area or clicking to browse your files.</li>
              <li>Once the image is loaded, use your mouse to select the area you want to crop.</li>
              <li>Adjust the selection by dragging the corners or edges of the crop box.</li>
              <li>Use the mouse scroll wheel to zoom in and out of the image for precise cropping.</li>
              <li>Choose an aspect ratio from the dropdown menu, or keep the default "Free Selection" for custom cropping.</li>
              <li>Click the "Rotate" button to rotate the image in 90-degree increments if needed.</li>
              <li>When satisfied with your selection, click the "Crop" button to apply the crop.</li>
              <li>Review the cropped image in the preview area.</li>
              <li>Click "Download" to save your cropped image, or "Reset" to start over with a new image.</li>
            </ol>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Key Features</h2>
            <ul className="list-disc list-inside text-white space-y-2">
              <li>Intuitive Interface: Easy-to-use design suitable for both beginners and professionals.</li>
              <li>Free-Form Selection: Crop your images with complete freedom, allowing for custom shapes and sizes.</li>
              <li>Preset Aspect Ratios: Quickly select common aspect ratios for various platforms and use cases.</li>
              <li>Image Rotation: Rotate your image in 90-degree increments for the perfect orientation.</li>
              <li>Zoom Functionality: Zoom in for precise cropping and out for a full view of your image.</li>
              <li>Real-Time Preview: See your crop selection instantly as you make adjustments.</li>
              <li>Responsive Design: Works seamlessly on desktop and mobile devices.</li>
              <li>High-Quality Output: Download your cropped images in high resolution.</li>
              <li>Reset Option: Easily start over with a single click if you're not satisfied with your crop.</li>
            </ul>
          </section>
        </div>

      </main>
      <Footer />
    </div>
  );
}