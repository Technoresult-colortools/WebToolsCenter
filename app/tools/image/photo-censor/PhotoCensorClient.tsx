'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Upload, Download, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/sidebarTools';

type CensorType = 'blur' | 'pixelate' | 'black';

const PhotoCensor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [censorType, setCensorType] = useState<CensorType>('blur');
  const [intensity, setIntensity] = useState<number>(10);
  const [selection, setSelection] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const applyCensor = useCallback(() => {
    if (!image || !imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    const scaledSelection = {
      x: selection.x * scaleX,
      y: selection.y * scaleY,
      width: selection.width * scaleX,
      height: selection.height * scaleY
    };

    if (censorType === 'blur') {
      ctx.filter = `blur(${intensity}px)`;
      ctx.drawImage(img, scaledSelection.x, scaledSelection.y, scaledSelection.width, scaledSelection.height, 
                         scaledSelection.x, scaledSelection.y, scaledSelection.width, scaledSelection.height);
    } else if (censorType === 'pixelate') {
      const pixelSize = intensity;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, scaledSelection.x, scaledSelection.y, scaledSelection.width, scaledSelection.height, 
                         scaledSelection.x, scaledSelection.y, scaledSelection.width / pixelSize, scaledSelection.height / pixelSize);
      ctx.drawImage(canvas, scaledSelection.x, scaledSelection.y, scaledSelection.width / pixelSize, scaledSelection.height / pixelSize, 
                            scaledSelection.x, scaledSelection.y, scaledSelection.width, scaledSelection.height);
    } else if (censorType === 'black') {
      ctx.fillStyle = 'black';
      ctx.fillRect(scaledSelection.x, scaledSelection.y, scaledSelection.width, scaledSelection.height);
    }

    setImage(canvas.toDataURL());
    toast.success('Censoring applied successfully!');
  }, [image, censorType, intensity, selection]);

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelection({ x, y, width: 0, height: 0 });
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isSelecting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelection(prev => ({
      ...prev,
      width: x - prev.x,
      height: y - prev.y
    }));
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    applyCensor();
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = 'censored-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Censored image downloaded successfully!');
  };

  const handleReset = () => {
    setImage(null);
    setSelection({ x: 0, y: 0, width: 0, height: 0 });
    setCensorType('blur');
    setIntensity(10);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('All settings reset!');
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
        <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12 text-center px-4">
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
              Photo Censor
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Protect your privacy and enhance your visuals effortlessly with our intuitive Photo Censor tool, designed for seamless image editing and creative expression.
          </p>
      </div>


          <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Upload Image</h2>
              <label className="flex flex-col items-center justify-center h-32 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
                <Upload size={32} />
                <span className="mt-2 text-base leading-normal">Select an image file</span>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                />
              </label>
            </div>
            <div className="mb-8 p-4 bg-gray-700 rounded-lg min-h-[300px] flex items-center justify-center">
              {image ? (
                <div className="relative max-w-full max-h-[500px] flex items-center justify-center">
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Uploaded image"
                    className={`max-w-full max-h-[500px] object-contain ${
                      isSelecting 
                        ? 'cursor-crosshair select-none' 
                        : 'cursor-crosshair hover:cursor-crosshair select-none'
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={(e) => handleMouseDown(e.touches[0] as unknown as React.MouseEvent<HTMLImageElement>)}
                    onTouchMove={(e) => handleMouseMove(e.touches[0] as unknown as React.MouseEvent<HTMLImageElement>)}
                    onTouchEnd={handleMouseUp}
                    draggable={false}
                  />
                  {isSelecting && (
                    <div
                      style={{
                        position: 'absolute',
                        border: '2px solid red',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        left: `${Math.min(selection.x, selection.x + selection.width)}px`,
                        top: `${Math.min(selection.y, selection.y + selection.height)}px`,
                        width: `${Math.abs(selection.width)}px`,
                        height: `${Math.abs(selection.height)}px`,
                        cursor: 'crosshair',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center">
                  <p>No image uploaded</p>
                  <p className="text-sm">Upload an image to get started</p>
                </div>
              )}
            </div>


            {image && (
              <>
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

                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={handleDownload} disabled={!image} className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
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
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">About Photo Censor</h2>
              <p className="text-white">
                The Photo Censor tool allows you to easily apply censoring to any part of an image. Whether you need to blur, pixelate, or black-out specific areas, this tool provides multiple options to protect sensitive content or add creative effects. With a user-friendly interface, you can upload images, select the censoring area, and customize the intensity for a polished result.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Key Features of Photo Censor</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Support for Blur, Pixelate, and Black-out censoring methods</li>
                <li>Adjustable censoring intensity for Blur and Pixelate</li>
                <li>Real-time preview of the censored area</li>
                <li>Easy image upload and selection of censoring area</li>
                <li>Option to download the censored image in high quality</li>
                <li>Ability to reset the image and start over</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">How to Use Photo Censor?</h2>
              <ol className="list-decimal list-inside text-white space-y-2">
                <li>Click the "Select an image file" button to upload your image.</li>
                <li>Once uploaded, you'll see the original image displayed.</li>
                <li>Click and drag on the image to select the area you want to censor.</li>
                <li>Choose a censoring method: Blur, Pixelate, or Black-out.</li>
                <li>For Blur and Pixelate, adjust the intensity using the slider.</li>
                <li>Click "Apply Censoring" to apply the effect to the selected area.</li>
                <li>Click "Download Censored Image" to save the result.</li>
                <li>Use the "Reset" button to start over or adjust settings.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-2">Tips and Tricks</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>You can select multiple areas to censor by applying censoring multiple times.</li>
                <li>Blur is best for subtle censoring, while Black-out provides complete coverage.</li>
                <li>Pixelate can create a unique, retro effect for artistic purposes.</li>
                <li>Use higher intensity for more dramatic censoring effects.</li>
                <li>You can combine different censoring methods on the same image for a layered effect.</li>
                <li>For precise selection, zoom in on your browser before selecting the area.</li>
                <li>Respect privacy and copyright laws when censoring and sharing images.</li>
              </ul>
            </section>
          </div>
        </main>
       </div> 
      

      <Footer />
    </div>
  );
};

export default PhotoCensor;