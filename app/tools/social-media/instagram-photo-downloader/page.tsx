'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Download, Search, Instagram, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type ImageQuality = 'low' | 'medium' | 'high';

export default function InstagramPhotoDownloader() {
  const [url, setUrl] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageQuality, setImageQuality] = useState<ImageQuality>('high');
  const [downloadAll, setDownloadAll] = useState<boolean>(false);
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(false);
  const [watermarkText, setWatermarkText] = useState<string>('');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    // In a real implementation, this would make an API call to fetch Instagram photos
    // For demonstration purposes, we'll simulate a delay and use placeholder images
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholderImages = [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4',
    ];
    setImageUrls(placeholderImages);
    setIsLoading(false);
    toast.success('Photos fetched successfully!');
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl) 
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  const handleDownload = async () => {
    const imagesToDownload = downloadAll ? imageUrls : selectedImages;
    
    if (imagesToDownload.length === 0) {
      toast.error('Please select at least one image to download.');
      return;
    }

    for (const imageUrl of imagesToDownload) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `instagram_photo_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading image:', error);
        toast.error(`Failed to download image: ${imageUrl}`);
      }
    }

    toast.success(`${imagesToDownload.length} image(s) downloaded successfully!`);
  };

  const applyWatermark = (imageUrl: string) => {
    // In a real implementation, this would apply a watermark to the image
    // For demonstration purposes, we'll just return the original image
    return imageUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Instagram Photo Downloader</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <Label htmlFor="instagram-url" className="text-white mb-2 block">Instagram Post URL</Label>
            <div className="flex">
              <Input
                id="instagram-url"
                type="text"
                placeholder="https://www.instagram.com/p/..."
                value={url}
                onChange={handleUrlChange}
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Button onClick={handleSearch} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? 'Searching...' : <Search className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="image-quality" className="text-white mb-2 block">Image Quality</Label>
              <Select value={imageQuality} onValueChange={(value: ImageQuality) => setImageQuality(value)}>
                <SelectTrigger id="image-quality" className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select image quality" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="download-all" className="text-white">Download All Images</Label>
              <Switch
                id="download-all"
                checked={downloadAll}
                onCheckedChange={setDownloadAll}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="include-metadata" className="text-white">Include Metadata</Label>
              <Switch
                id="include-metadata"
                checked={includeMetadata}
                onCheckedChange={setIncludeMetadata}
              />
            </div>

            <div>
              <Label htmlFor="watermark-text" className="text-white mb-2 block">Watermark Text</Label>
              <Input
                id="watermark-text"
                type="text"
                placeholder="Enter watermark text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="watermark-opacity" className="text-white mb-2 block">Watermark Opacity: {watermarkOpacity}%</Label>
              <Slider
                id="watermark-opacity"
                min={0}
                max={100}
                step={1}
                value={watermarkOpacity}
                onChange={(value) => setWatermarkOpacity(value)}
              />
            </div>
          </div>
        </div>

        {imageUrls.length > 0 && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Available Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={applyWatermark(imageUrl)}
                    alt={`Instagram photo ${index + 1}`}
                    className={`w-full h-40 object-cover rounded-lg cursor-pointer ${
                      selectedImages.includes(imageUrl) ? 'border-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleImageSelect(imageUrl)}
                  />
                  {selectedImages.includes(imageUrl) && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button onClick={handleDownload} className="mt-6 bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download Selected Photos
            </Button>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter the Instagram post URL in the input field.</li>
            <li>Click the search button to fetch available photos.</li>
            <li>Select the desired image quality from the dropdown menu.</li>
            <li>Choose whether to download all images or select specific ones.</li>
            <li>Toggle the option to include metadata if needed.</li>
            <li>Add a watermark text and adjust its opacity if desired.</li>
            <li>Click on individual photos to select/deselect them for download.</li>
            <li>Click the "Download Selected Photos" button to save the chosen images.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Legal and Ethical Considerations</h2>
          <div className="flex items-start space-x-4 text-yellow-300">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-1" />
            <p>
              Please be aware that downloading and using Instagram photos may infringe on copyright laws and Instagram's terms of service. 
              Always ensure you have the right to download and use the images, preferably by obtaining permission from the content creator. 
              This tool is for educational purposes only and should be used responsibly and ethically.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}