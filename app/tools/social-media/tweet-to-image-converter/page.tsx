'use client';

import React, { useState, useRef, } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Download, Camera, Maximize, } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import html2canvas from 'html2canvas';

const gradients = {
  Sunset: 'from-orange-400 via-pink-500 to-purple-500',
  Marble: 'from-gray-100 via-gray-200 to-gray-300',
  'Shiny Purple': 'from-purple-400 via-pink-500 to-red-500',
  Caribbean: 'from-green-300 via-blue-500 to-purple-600',
  'Candy Cake': 'from-pink-300 via-purple-300 to-indigo-400',
  'Neon Green': 'from-green-300 via-yellow-300 to-pink-300',
};

type GradientKey = keyof typeof gradients;

export default function TweetToImageConverter() {
  const [tweetUrl, setTweetUrl] = useState('');
  const [tweetData, setTweetData] = useState({
    username: 'WebToolsCenter',
    handle: '@WTS',
    content: 'Hello world! 👋 WebCenterTools has lot of online tools, this Tweet to image convertsion tool, convert your Tweets to fancy Images? 📸🎨🔧',
    date: 'Sep 20, 2024',
    time: '7:13 AM',
  });
  const [layout, setLayout] = useState<'wide' | 'compact' | 'square'>('wide');
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'solid' | 'image'>('gradient');
  const [gradientColor, setGradientColor] = useState<GradientKey>('Sunset');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [watermark, setWatermark] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [comment, setComment] = useState('');

  const tweetRef = useRef<HTMLDivElement>(null);

  const handleCapture = async () => {
    const tweetId = tweetUrl.split('/').pop(); // Extract tweet ID from URL
  
    if (!tweetId) {
      toast.error('Invalid Tweet URL');
      return;
    }
  
    try {
      const response = await fetch(`https://api.twitter.com/2/tweets/${tweetId}?expansions=author_id&tweet.fields=created_at&user.fields=username`, {
        headers: {
          'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAAMbtvwEAAAAAbnarBuH8OkIA1Baj85Z96PlphCY%3DyzTVutYe4oY7fwep7MX53m7LBEAfCk1HP56xUUX9Abw43KubPy`, // Use your Bearer Token here
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch tweet');
      }
  
      const data = await response.json();
      const tweet = data.data;
      const user = data.includes.users[0];
  
      setTweetData({
        username: user.name,
        handle: `@${user.username}`,
        content: tweet.text,
        date: new Date(tweet.created_at).toLocaleDateString(),
        time: new Date(tweet.created_at).toLocaleTimeString(),
      });
  
      toast.success('Tweet captured successfully!');
    } catch (error) {
      console.error('Error fetching tweet:', error);
      toast.error('Failed to capture tweet');
    }
  
    toast.success('Tweet captured successfully!');
  };

  const handleExport = async () => {
    if (tweetRef.current) {
      try {
        const canvas = await html2canvas(tweetRef.current);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'tweet-image.png';
        link.click();
        toast.success('Image exported successfully!');
      } catch (error) {
        console.error('Error exporting image:', error);
        toast.error('Failed to export image');
      }
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

  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'gradient':
        return `bg-gradient-to-r ${gradients[gradientColor]}`;
      case 'solid':
        return `bg-[${solidColor}]`;
      case 'image':
        return `bg-cover bg-center`;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
              <div 
                ref={tweetRef}
                className={`${getBackgroundStyle()} p-8 rounded-lg shadow-lg ${
                  layout === 'wide' ? 'aspect-video' : layout === 'square' ? 'aspect-square' : 'aspect-[4/3]'
                }`}
                style={backgroundType === 'image' ? { backgroundImage: `url(${backgroundImage})` } : {}}
              >
                <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-bold text-gray-900">{tweetData.username}</p>
                      <p className="text-gray-600">{tweetData.handle}</p>
                    </div>
                  </div>
                  <p className="text-gray-900 mb-2">{tweetData.content}</p>
                  <p className="text-gray-600 text-sm">{tweetData.time} · {tweetData.date}</p>
                </div>
                {watermark && (
                  <div className="absolute bottom-2 right-2 text-white text-sm opacity-50">
                    {watermark}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <div className="space-y-4">
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
                      <SelectContent>
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
                      className="bg-gray-700 text-white border-gray-600"
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
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export Image
            </Button>
            <Button onClick={() => setIsFullscreen(!isFullscreen)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Maximize className="h-5 w-5 mr-2" />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter the URL of the tweet you want to convert to an image.</li>
            <li>Click the "Capture" button to fetch the tweet data (simulated in this demo).</li>
            <li>Customize the image layout, background, and other settings.</li>
            <li>Add a watermark or comment if desired.</li>
            <li>Use the preview to see how your image will look.</li>
            <li>Click "Export Image" to download the generated image.</li>
            <li>Use "Fullscreen Preview" to see a larger version of your image.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Convert tweets to customizable images</li>
            <li>Multiple layout options (Wide, Compact, Square)</li>
            <li>Background customization (Gradients, Solid Colors, Custom Images)</li>
            <li>Watermark support</li>
            <li>Comment section for additional notes</li>
            <li>Fullscreen preview mode</li>
            <li>Easy export to PNG format</li>
            <li>Responsive design for use on various devices</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}