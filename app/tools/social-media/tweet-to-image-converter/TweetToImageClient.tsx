'use client';

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Download, Camera, Maximize, } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { exportComponentAsJPEG, exportComponentAsPNG } from 'react-component-export-image';

const gradients = {
  Sunset: 'from-orange-400 via-pink-500 to-purple-500',
  Ocean: 'from-blue-400 via-cyan-500 to-teal-500',
  Forest: 'from-green-400 via-lime-500 to-emerald-500',
  Lavender: 'from-purple-400 via-pink-500 to-indigo-500',
  Autumn: 'from-yellow-400 via-orange-500 to-red-500',
  Midnight: 'from-blue-900 via-indigo-900 to-purple-900',
};

type GradientKey = keyof typeof gradients;

const Tweet = React.forwardRef<HTMLDivElement, {
  tweetData: {
    username: string;
    handle: string;
    content: string;
    date: string;
    time: string;
  };
  layout: 'wide' | 'compact' | 'square';
  backgroundType: 'gradient' | 'solid' | 'image';
  gradientColor: GradientKey;
  solidColor: string;
  backgroundImage: string;
  watermark: string;
  comment: string;
}>((props, ref) => {
  const getBackgroundStyle = () => {
    switch (props.backgroundType) {
      case 'gradient':
        return `bg-gradient-to-r ${gradients[props.gradientColor]}`;
      case 'solid':
        return `bg-[${props.solidColor}]`;
      case 'image':
        return `bg-cover bg-center`;
    }
  };

  return (
    <div 
      ref={ref}
      className={`${getBackgroundStyle()} p-8 rounded-lg shadow-lg ${
        props.layout === 'wide' ? 'aspect-video' : props.layout === 'square' ? 'aspect-square' : 'aspect-[4/3]'
      } flex items-center justify-center`}
      style={props.backgroundType === 'image' 
        ? { backgroundImage: `url(${props.backgroundImage})` } 
        : props.backgroundType === 'solid' 
        ? { backgroundColor: props.solidColor }
        : {}
      }
    >
      <div className="bg-white rounded-lg shadow-2xl p-4 max-w-md mx-auto">
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
          <div>
            <p className="font-bold text-gray-900">{props.tweetData.username}</p>
            <p className="text-gray-600">{props.tweetData.handle}</p>
          </div>
        </div>
        <p className="text-gray-900 mb-2">{props.tweetData.content}</p>
        <p className="text-gray-600 text-sm">{props.tweetData.time} · {props.tweetData.date}</p>
      </div>
      {props.watermark && (
        <div className="absolute bottom-2 right-2 text-white text-sm opacity-50">
          {props.watermark}
        </div>
      )}
      {props.comment && (
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-75 p-2 rounded max-w-xs">
          <p className="text-sm text-gray-800">{props.comment}</p>
        </div>
      )}
    </div>
  );
});

Tweet.displayName = 'Tweet';

export default function TweetToImageConverter() {
  const [tweetUrl, setTweetUrl] = useState('');
  const [tweetData, setTweetData] = useState({
    username: 'WebToolsCenter',
    handle: '@WTS',
    content: 'Hello world! 👋 WebCenterTools has a lot of online tools. This Tweet to image conversion tool converts your Tweets to fancy Images! 📸🎨🔧',
    date: 'Sep 20, 2024',
    time: '7:13 AM',
  });
  const [layout, setLayout] = useState<'wide' | 'compact' | 'square'>('wide');
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'solid' | 'image'>('gradient');
  const [gradientColor, setGradientColor] = useState<GradientKey>('Ocean');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [watermark, setWatermark] = useState('');
  const [comment, setComment] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tweetRef = useRef<HTMLDivElement>(null);

  const handleCapture = async () => {
    const tweetId = tweetUrl.split('/').pop();
  
    if (!tweetId) {
      toast.error('Invalid Tweet URL');
      return;
    }
  
    try {
      const response = await fetch(`/api/tweet/${tweetId}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch tweet');
      }
  
      const data = await response.json();
      setTweetData({
        username: data.user.name,
        handle: `@${data.user.username}`,
        content: data.text,
        date: new Date(data.created_at).toLocaleDateString(),
        time: new Date(data.created_at).toLocaleTimeString(),
      });
  
      toast.success('Tweet captured successfully!');
    } catch (error) {
      console.error('Error fetching tweet:', error);
      toast.error('Failed to capture tweet. Please try again.');
    }
  };

  const handleExport = (format: 'png' | 'jpeg') => {
    if (tweetRef.current) {
      const exportFunction = format === 'png' ? exportComponentAsPNG : exportComponentAsJPEG;
      exportFunction(tweetRef, {
        fileName: `tweet-image.${format}`,
        html2CanvasOptions: { backgroundColor: null }
      });
      toast.success(`Image exported as ${format.toUpperCase()}`);
    }
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Tweet to Image Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <Label htmlFor="tweet-url" className="text-white mb-2 block">Tweet URL</Label>
            <div className="flex space-x-2">
              <Input
                id="tweet-url"
                type="text"
                placeholder="https://twitter.com/username/status/123456789"
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Button onClick={handleCapture} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Camera className="h-5 w-5 mr-2" />
                Capture
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
            <Tweet
              ref={tweetRef}
              tweetData={tweetData}
              layout={layout}
              backgroundType={backgroundType}
              gradientColor={gradientColor}
              solidColor={solidColor}
              backgroundImage={backgroundImage}
              watermark={watermark}
              comment={comment}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="layout" className="text-white mb-2 block">Layout</Label>
                <Select value={layout} onValueChange={(value: 'wide' | 'compact' | 'square') => setLayout(value)}>
                  <SelectTrigger id="layout" className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="wide">Wide</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="background-type" className="text-white mb-2 block">Background Type</Label>
                <Select value={backgroundType} onValueChange={(value: 'gradient' | 'solid' | 'image') => setBackgroundType(value)}>
                  <SelectTrigger id="background-type" className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select background type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {backgroundType === 'gradient' && (
                <div>
                  <Label htmlFor="gradient-color" className="text-white mb-2 block">Gradient</Label>
                  <Select value={gradientColor} onValueChange={(value: GradientKey) => setGradientColor(value)}>
                    <SelectTrigger id="gradient-color" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select gradient" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      {Object.keys(gradients).map((gradient) => (
                        <SelectItem key={gradient} value={gradient as GradientKey}>{gradient}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {backgroundType === 'solid' && (
                <div>
                  <Label htmlFor="solid-color" className="text-white mb-2 block">Solid Color</Label>
                  <Input
                    id="solid-color"
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 h-10 w-full"
                  />
                </div>
              )}

              {backgroundType === 'image' && (
                <div>
                  <Label htmlFor="background-image" className="text-white mb-2 block">Background Image</Label>
                  <Input
                    id="background-image"
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="watermark" className="text-white mb-2 block">Watermark</Label>
                <Input
                  id="watermark"
                  type="text"
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  placeholder="Enter watermark text"
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="comment" className="text-white mb-2 block">Comment</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment"
                  className="bg-gray-700 text-white border-gray-600"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button onClick={() => handleExport('png')} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export as PNG
            </Button>
            <Button onClick={() => handleExport('jpeg')} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export as JPEG
            </Button>
            <Button onClick={() => setIsFullscreen(!isFullscreen)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Maximize className="h-5 w-5 mr-2" />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Tweet to Image Converter</h2>
          <p className="text-gray-300 mb-4">
            Our Tweet to Image Converter is a powerful tool designed to transform tweets into visually appealing, 
            customizable images. Whether you're a social media manager, content creator, or just someone who wants 
            to share tweets in a more engaging format, this tool provides an easy-to-use interface to create 
            eye-catching tweet images for various platforms.
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-2">Key Features:</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>Easy tweet capture using URL</li>
            <li>Multiple layout options (Wide, Compact, Square)</li>
            <li>Customizable backgrounds (Gradients, Solid Colors, Custom Images)</li>
            <li>Watermark support for branding</li>
            <li>Comment section for additional context</li>
            <li>Real-time preview of the generated image</li>
            <li>Export options in PNG and JPEG formats</li>
            <li>Fullscreen preview mode</li>
            <li>Responsive design for use on various devices</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-2">How to Use:</h3>
          <ol className="list-decimal list-inside text-gray-300 mb-4">
            <li>Enter the URL of the tweet you want to convert to an image.</li>
            <li>Click the "Capture" button to fetch the tweet data.</li>
            <li>Customize the image layout, choosing between wide, compact, or square formats.</li>
            <li>Select a background type: gradient, solid color, or custom image.</li>
            <li>Add a watermark or comment to personalize your image.</li>
            <li>Use the preview to see how your image will look in real-time.</li>
            <li>Click "Export as PNG" or "Export as JPEG" to download your created image.</li>
            <li>Use "Fullscreen Preview" to see a larger version of your image before exporting.</li>
          </ol>

          <h3 className="text-xl font-semibold text-white mb-2">Tips and Tricks:</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>Experiment with different gradients to find the perfect background for your tweet content.</li>
            <li>Use the watermark feature to add your brand or website URL to the images you create.</li>
            <li>Try different layouts to see which one works best for your tweet's length and content.</li>
            <li>Add comments to provide context or additional information about the tweet.</li>
            <li>Use custom background images that complement the tweet's content for more engaging visuals.</li>
            <li>Export in both PNG and JPEG to see which format provides the best quality for your needs.</li>
            <li>Utilize the fullscreen preview to check all details before finalizing your image.</li>
            <li>Remember to respect copyright and Twitter's terms of service when sharing tweet images.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}