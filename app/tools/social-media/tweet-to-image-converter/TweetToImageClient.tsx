'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Download, Info, Lightbulb, BookOpen, RefreshCw, Layout, ImageIcon, Sliders, Type, } from 'lucide-react';
import { exportComponentAsJPEG, exportComponentAsPNG } from 'react-component-export-image';
import ToolLayout from '@/components/ToolLayout'



const gradients = {
  Sunset: 'from-orange-400 via-pink-500 to-purple-500',
  Ocean: 'from-blue-400 via-cyan-500 to-teal-500',
  Forest: 'from-green-400 via-lime-500 to-emerald-500',
  Lavender: 'from-purple-400 via-pink-500 to-indigo-500',
  Autumn: 'from-yellow-400 via-orange-500 to-red-500',
  Midnight: 'from-blue-900 via-indigo-900 to-purple-900',
  Twilight: 'from-indigo-500 via-purple-500 to-pink-500',
  Emerald: 'from-emerald-400 via-green-500 to-teal-600',
  Coral: 'from-red-400 via-orange-400 to-pink-400',
  Arctic: 'from-blue-100 via-blue-300 to-blue-500',
  Sahara: 'from-yellow-300 via-amber-400 to-orange-500',
  Galaxy: 'from-violet-600 via-indigo-700 to-purple-800',
  Tropical: 'from-green-300 via-yellow-300 to-pink-300',
  Flamingo: 'from-pink-400 via-pink-500 to-pink-600',
  Aquamarine: 'from-teal-300 via-cyan-400 to-blue-500',
  Volcano: 'from-red-500 via-orange-600 to-yellow-700',
  Amethyst: 'from-purple-300 via-purple-400 to-purple-500',
  Mint: 'from-green-200 via-green-300 to-green-400',
  Dusk: 'from-sky-400 via-blue-500 to-indigo-600',
  Peach: 'from-red-200 via-red-300 to-yellow-300',
  Neon: 'from-green-400 via-yellow-300 to-pink-400',
  Aurora: 'from-green-300 via-blue-500 to-purple-600',
  Crimson: 'from-red-600 via-red-500 to-orange-500',
  Ocean2: 'from-blue-500 via-cyan-400 to-blue-300',
  Meadow: 'from-green-300 via-yellow-300 to-green-400',
  Nebula: 'from-pink-600 via-purple-600 to-indigo-600',
};

type GradientKey = keyof typeof gradients;

const extractTweetId = (url: string): string | null => {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};

interface TweetData {
  username: string;
  handle: string;
  content: string;
  date: string;
  time: string;
  profileImage?: string;
  media?: Array<{
    type: string;
    url: string;
  }>;
}


const Tweet = React.forwardRef<HTMLDivElement, {
  tweetData: TweetData;
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
      className={`${getBackgroundStyle()} p-4 sm:p-8 rounded-lg shadow-lg ${
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
          <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
            {props.tweetData.profileImage ? (
              <img 
                src={props.tweetData.profileImage} 
                alt={props.tweetData.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900">{props.tweetData.username}</p>
            <p className="text-gray-600">{props.tweetData.handle}</p>
          </div>
        </div>
        <p className="text-gray-900 mb-2">{props.tweetData.content}</p>
        <p className="text-gray-600 text-sm">{props.tweetData.time} · {props.tweetData.date}</p>
        
        {props.tweetData.media && props.tweetData.media.length > 0 && (
          <div className="mt-2 rounded-lg overflow-hidden">
            {props.tweetData.media.map((item, index) => (
              item.type === 'photo' && (
                <img 
                  key={index}
                  src={item.url}
                  alt="Tweet media"
                  className="w-full h-auto rounded"
                />
              )
            ))}
          </div>
        )}
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
  const [tweetData, setTweetData] = useState<TweetData>({
    username: 'WebToolsCenter',
    handle: '@WTS',
    content: 'Hello world! 👋 WebToolsCenter has a lot of online tools. This Tweet to image conversion tool converts your Tweets to fancy Images! 📸🎨🔧',
    date: 'Sep 20, 2024',
    time: '7:13 AM',
    profileImage: undefined,
    media: []
  });
  const [layout, setLayout] = useState<'wide' | 'compact' | 'square'>('wide');
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'solid' | 'image'>('gradient');
  const [gradientColor, setGradientColor] = useState<GradientKey>('Ocean');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [watermark, setWatermark] = useState('');
  const [comment, setComment] = useState('');

  const tweetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBackgroundImage('');
    setWatermark('');
    setComment('');
  }, [tweetUrl]);

  const handleCapture = async () => {
    const tweetId = extractTweetId(tweetUrl);
  
    if (!tweetId) {
      toast.error('Invalid Tweet URL. Please enter a valid Twitter/X post URL.');
      return;
    }
  
    try {
      const response = await fetch(`/api/tweet/${tweetId}`);
      const data = await response.json();
  
      if (response.status === 403) {
        toast.error('Twitter API access error: Please check your API token permissions and ensure you have Elevated access enabled.');
        console.error('Authentication error:', data);
        return;
      }
  
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch tweet');
      }
  
      setTweetData({
        username: data.user.name,
        handle: `@${data.user.username}`,
        content: data.text,
        date: formatDate(data.created_at),
        time: formatTime(data.created_at),
        profileImage: data.user.profile_image_url,
        media: data.media || []
      });
  
      toast.success('Tweet captured successfully!');
    } catch (error) {
      console.error('Error capturing tweet:', error);
      toast.error(`Failed to capture tweet: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  <ToolLayout
      title="Tweet to Image Converter"
      description="Turn tweets into images, providing you with a flexible way to capture and share tweet snapshots"
    >

    <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Tweet Preview</h2>
              <div 
                ref={tweetRef}
                className="relative rounded-lg overflow-hidden border-4 border-gray-700"
                style={{ width: '100%' }}
              >
                <Tweet
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
              <div className="mt-4">
                <Button onClick={handleCapture} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Capture Tweet
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <div className="mb-6">
                <Label htmlFor="tweet-url" className="text-white mb-2 block">Tweet URL</Label>
                <Input
                  id="tweet-url"
                  type="text"
                  placeholder="Enter Tweet URL"
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <Tabs defaultValue="layout" className="w-full">
                <TabsList className="grid w-full grid-cols-4 gap-2 mb-4">
                  <TabsTrigger value="layout" className="flex items-center justify-center">
                    <Layout className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Layout</span>
                  </TabsTrigger>
                  <TabsTrigger value="background" className="flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Background</span>
                  </TabsTrigger>
                  <TabsTrigger value="extras" className="flex items-center justify-center">
                    <Sliders className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Extras</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center justify-center">
                    <Type className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Text</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="layout">
                  <div>
                    <Label htmlFor="layout" className="text-white mb-2 block">Layout</Label>
                    <Select value={layout} onValueChange={(value: 'wide' | 'compact' | 'square') => setLayout(value)}>
                      <SelectTrigger id="layout" className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select Layout" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="wide">Wide</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="background">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="background-type" className="text-white mb-2 block">Background Type</Label>
                      <Select value={backgroundType} onValueChange={(value: 'gradient' | 'solid' | 'image') => setBackgroundType(value)}>
                        <SelectTrigger id="background-type" className="w-full bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select Background Type" />
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
                        <Label htmlFor="gradient-color" className="text-white mb-2 block">Gradient Color</Label>
                        <Select value={gradientColor} onValueChange={(value: GradientKey) => setGradientColor(value)}>
                          <SelectTrigger id="gradient-color" className="w-full bg-gray-700 text-white border-gray-600">
                            <SelectValue placeholder="Select Gradient" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 text-white border-gray-600 max-h-40 overflow-y-auto">
                            {(Object.keys(gradients) as GradientKey[]).map((key) => (
                              <SelectItem key={key} value={key}>{key}</SelectItem>
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
                          className="w-full bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                    )}
                    {backgroundType === 'image' && (
                      <div>
                        <Label htmlFor="background-image" className="text-white mb-2 block">Upload Background Image</Label>
                        <Input
                          id="background-image"
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundImageUpload}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="extras">
                  <div>
                    <Label htmlFor="watermark" className="text-white mb-2 block">Watermark</Label>
                    <Input
                      id="watermark"
                      type="text"
                      placeholder="Your Watermark"
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="text">
                  <div>
                    <Label htmlFor="comment" className="text-white mb-2 block">Comment</Label>
                    <Textarea
                      id="comment"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8 flex flex-wrap justify-end space-x-2 space-y-2 sm:space-y-0">
              <Button onClick={() => handleExport('png')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-5 w-5 mr-2" /> Export as PNG
              </Button>
              <Button onClick={() => handleExport('jpeg')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-5 w-5 mr-2" /> Export as JPEG
              </Button>
            
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the Tweet to Image Converter?
            </h2>
            <p className="text-gray-300 mb-4">
              The Tweet to Image Converter is a free online tool designed to turn tweets into images, providing you with a flexible way to capture and share tweet snapshots. You can easily add custom backgrounds to enhance the visual appeal of your tweets, making them perfect for sharing across different platforms.
            </p>

            <p className="text-gray-300 mb-4">
              Tweets are brief messages that users post on Twitter, a popular platform for sharing news, updates, and media content. However, if a tweet is deleted or protected, it becomes inaccessible. With this tool, you can convert tweets into permanent images, ensuring they remain visible even if the original tweet is no longer available. You can then share these tweet images on platforms like Instagram, Pinterest, or Facebook.
            </p>

            <p className="text-gray-300 mb-4">If you're looking for an easy solution to share tweets on Instagram or Pinterest, this tool offers an image orientation option for a perfect fit. For instance, setting the orientation to "Square" ensures the tweet image is ready to be shared on platforms like Instagram and Pinterest, where square images are the norm. Additionally, you can further personalize your tweet image by adding a custom background to increase engagement and make your posts more eye-catching.</p>

            <p className="text-gray-300 mb-4">Whether you're a social media influencer, business owner, or just someone who wants to share tweets across multiple platforms, this tool allows you to create professional-looking tweet images that can be shared effortlessly on Instagram, Pinterest, Facebook, and more.</p>
            
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Tweet to Image Converter?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter a valid Twitter/X post URL in the input field.</li>
              <li>Click the "Capture Tweet" button to fetch the tweet data.</li>
              <li>Customize the layout, background, and other settings as desired.</li>
              <li>Add a watermark or comment if needed.</li>
              <li>Preview your customized tweet image in real-time.</li>
              <li>Export the image as PNG or JPEG using the provided buttons.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Capture tweets automatically by inputting a URL.</li>
              <li>Real-time preview of the tweet as an image.</li>
              <li>Options to add background images, watermarks, or comments.</li>
              <li>Multiple export formats (PNG and JPEG).</li>
              <li>Custom layouts and square image option for Instagram and Pinterest.</li>
              <li>Preserve tweet content even if the tweet is deleted or restricted.</li>
              <li>Responsive design for mobile and desktop devices.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use high-quality backgrounds to make your tweet image more appealing.</li>
              <li>Experiment with different layouts to suit your sharing platform.</li>
              <li>Add a watermark if you want to credit your account when sharing.</li>
              <li>Use the square format for Instagram and Pinterest posts for the best fit.</li>
              <li>Take advantage of real-time preview to tweak your design before exporting.</li>
            </ul>
          </div>

  </ToolLayout>
  );
}