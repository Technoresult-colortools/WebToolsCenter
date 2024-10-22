'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Download, User, Link as MessageSquare, Heart, Repeat, BarChart2, Bookmark, Share2, MoreHorizontal, Settings, Sliders, LockIcon, Filter, Info, BookOpen, Lightbulb } from 'lucide-react';
import { exportComponentAsJPEG, exportComponentAsPNG } from 'react-component-export-image';
import ToolLayout from '@/components/ToolLayout'

const VerifiedBadge = () => (
  <svg viewBox="0 0 22 22" aria-label="Verified account" role="img" className="w-4 h-4 ml-1 inline-block fill-[#1d9bf0]">
    <g>
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
    </g>
  </svg>
);

const ActionIcon = ({ Icon, count }: { Icon: React.ElementType; count: string }) => (
  <div className="flex items-center text-gray-500 group">
    <div className="p-2 rounded-full group-hover:bg-opacity-10 group-hover:bg-blue-500">
      <Icon className="w-5 h-5" />
    </div>
    <span className="ml-1 text-sm">{count}</span>
  </div>
);

const Tweet = React.forwardRef<HTMLDivElement, {
  theme: string;
  name: string;
  username: string;
  isVerified: boolean;
  avatarUrl: string;
  tweetText: string;
  tweetImage: string;
  imageSize: number;
  className?: string;
  engagementCounts: {
    replies: number;
    retweets: number;
    likes: number;
    views: number;
    
  };
  formatDate: () => string;
  formatTweetText: (text: string) => string;
  formatNumber: (num: number) => string;
}>((props, ref) => (
  <div 
    ref={ref}
    className={`bg-${props.theme === 'light' ? 'white' : 'black'} rounded-lg overflow-hidden p-4 mx-auto w-full ${props.className}`}
    
  >
    <div className="flex items-start mb-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-3 flex-shrink-0">
        {props.avatarUrl ? (
          <img src={props.avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
        ) : (
          <User className="w-full h-full text-gray-600 p-2" />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-wrap">
            <p className={`font-bold ${props.theme === 'light' ? 'text-black' : 'text-white'} text-[15px]`}>
              {props.name}
              {props.isVerified && <VerifiedBadge />}
            </p>
            <p className={`ml-1 ${props.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-[15px]`}>
              @{props.username} · {props.formatDate()}
            </p>
          </div>
          <MoreHorizontal className={`w-5 h-5 ${props.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} flex-shrink-0`} />
        </div>
        <div 
          className={`mt-1 ${props.theme === 'light' ? 'text-black' : 'text-white'} text-[15px]`}
          dangerouslySetInnerHTML={{ __html: props.formatTweetText(props.tweetText) }}
        />
        {props.tweetImage && (
          <img 
            src={props.tweetImage} 
            alt="Tweet image" 
            className="mt-2 rounded-2xl max-w-full h-auto" 
            style={{ width: `${props.imageSize}%` }}
          />
        )}
        <div className="flex justify-between items-center mt-4 text-gray-500">
          <ActionIcon Icon={MessageSquare} count={props.formatNumber(props.engagementCounts.replies)} />
          <ActionIcon Icon={Repeat} count={props.formatNumber(props.engagementCounts.retweets)} />
          <ActionIcon Icon={Heart} count={props.formatNumber(props.engagementCounts.likes)} />
          <ActionIcon Icon={BarChart2} count={props.formatNumber(props.engagementCounts.views)} />
          <Bookmark className="w-5 h-5" />
          <Share2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  </div>
));

Tweet.displayName = 'Tweet';

export default function TweetGeneratorClient() {
  const [theme, setTheme] = useState('light');
  const [name, setName] = useState('Prem Nash');
  const [username, setUsername] = useState('premnash');
  const [isVerified, setIsVerified] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [tweetText, setTweetText] = useState('This is a sample tweet with #hashtag and @mention https://example.com');
  const [tweetImage, setTweetImage] = useState('');
  const [tweetDate, setTweetDate] = useState('');
  const [tweetTime, setTweetTime] = useState('');
  const [imageSize, setImageSize] = useState(100);
  const [engagementCounts, setEngagementCounts] = useState({
    replies: 1200,
    retweets: 234,
    likes: 234,
    views: 2300
  });
  const tweetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    setTweetDate(now.toISOString().split('T')[0]);
    setTweetTime(now.toTimeString().split(' ')[0].slice(0, 5));
  }, []);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTweetImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setTweetImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEngagementChange = (type: keyof typeof engagementCounts, value: string) => {
    setEngagementCounts(prev => ({ ...prev, [type]: parseInt(value) || 0 }));
  };

  const formatTweetText = (text: string) => {
    return text
      .replace(/(#\w+)/g, '<span class="text-[#1d9bf0]">$1</span>')
      .replace(/(@\w+)/g, '<span class="text-[#1d9bf0]">$1</span>')
      .replace(/(https?:\/\/\S+)/g, '<span class="text-[#1d9bf0]">$1</span>');
  };

  const exportTweet = (format: 'png' | 'jpeg') => {
    if (tweetRef.current) {
      const exportFunction = format === 'png' ? exportComponentAsPNG : exportComponentAsJPEG;
      exportFunction(tweetRef, {
        fileName: `tweet.${format}`,
        html2CanvasOptions: { backgroundColor: theme === 'light' ? '#ffffff' : '#000000' }
      });
      toast.success(`Tweet exported as ${format.toUpperCase()}`);
    } else {
      toast.error('Failed to export tweet');
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };

  const formatDate = () => {
    const now = new Date();
    const tweetDateTime = new Date(`${tweetDate}T${tweetTime}`);
    const diffInMinutes = Math.floor((now.getTime() - tweetDateTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return tweetDateTime.toLocaleString('default', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <ToolLayout
      title="Tweet Generator"
      description="Create and visualize tweets without actually posting them on Twitter"
    >

       <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Tweet Preview</h2>
            <div className="w-full max-w-full flex justify-center">
              <Tweet
                ref={tweetRef}
                theme={theme}
                name={name}
                username={username}
                isVerified={isVerified}
                avatarUrl={avatarUrl}
                tweetText={tweetText}
                tweetImage={tweetImage}
                imageSize={imageSize}
                engagementCounts={engagementCounts}
                formatDate={formatDate}
                formatTweetText={formatTweetText}
                formatNumber={formatNumber}
                className="w-full" // Ensures the tweet fits the parent container
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Tweet Settings</h2>
            <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-2 mb-4">
              <TabsTrigger value="general" className="flex items-center justify-center">
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="user" className="flex items-center justify-center">
                <Sliders className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">User</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center justify-center">
                <LockIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center justify-center">
                <Filter className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
            </TabsList>
              <TabsContent value="general">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme" className="text-white mb-2 block">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tweet-date" className="text-white mb-2 block">Tweet Date</Label>
                    <Input
                      id="tweet-date"
                      type="date"
                      value={tweetDate}
                      onChange={(e) => setTweetDate(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tweet-time" className="text-white mb-2 block">Tweet Time</Label>
                    <Input
                      id="tweet-time"
                      type="time"
                      value={tweetTime}
                      onChange={(e) => setTweetTime(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="user">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-white mb-2 block">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="verified"
                      checked={isVerified}
                      onCheckedChange={setIsVerified}
                    />
                    <Label htmlFor="verified" className="text-white">Verified Account</Label>
                  </div>
                  <div>
                    <Label htmlFor="avatar-upload" className="text-white mb-2 block">Avatar Image</Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="content">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tweet-text" className="text-white mb-2 block">Tweet Text (max. 280 characters)</Label>
                    <Textarea
                      id="tweet-text"
                      value={tweetText}
                      onChange={(e) => setTweetText(e.target.value)}
                      maxLength={280}
                      className="bg-gray-700 text-white border-gray-600"
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="media">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tweet-image-upload" className="text-white mb-2 block">Tweet Image</Label>
                    <Input
                      id="tweet-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleTweetImageUpload}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  {tweetImage && (
                    <div>
                      <Label htmlFor="image-size" className="text-white mb-2 block">Image Size</Label>
                      <Slider
                        id="image-size"
                        min={10}
                        max={100}
                        step={1}
                        value={imageSize}
                        onChange={(value) => setImageSize(value)}
                        className="w-full"
                      />
                      <div className="text-white mt-2">{imageSize}%</div>
                    </div>
                  )}
                  {Object.entries(engagementCounts).map(([type, count]) => (
                    <div key={type}>
                      <Label htmlFor={`${type}-count`} className="text-white mb-2 block capitalize">{type} Count</Label>
                      <Input
                        id={`${type}-count`}
                        type="number"
                        value={count}
                        onChange={(e) => handleEngagementChange(type as keyof typeof engagementCounts, e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button onClick={() => exportTweet('png')} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export as PNG
            </Button>
            <Button onClick={() => exportTweet('jpeg')} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export as JPEG
            </Button>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Tweet Generator
            </h2>
            <p className="text-gray-300 mb-4">
              Our Tweet Generator is a powerful tool designed to help you create and visualize tweets without actually posting them on Twitter. Whether you're a social media manager, content creator, or just someone who wants to experiment with tweet designs, this tool provides a user-friendly interface to craft the perfect tweet and export it as an image.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use the settings tabs below the preview to customize your tweet.</li>
              <li>The General tab allows you to set the theme and tweet date/time.</li>
              <li>In the User tab, you can set your name, username, verified status, and upload an avatar.</li>
              <li>The Content tab is where you input your tweet text, hashtags, mentions, and links.</li>
              <li>Use the Media tab to upload a tweet image and set engagement metrics.</li>
              <li>See how your tweet looks in real-time in the preview section at the top.</li>
              <li>When satisfied with your tweet, click one of the "Export" buttons to save the tweet as an image.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Real-time preview of your tweet</li>
              <li>Customizable user profile (name, username, avatar, verified status)</li>
              <li>Tweet text input with character limit</li>
              <li>Support for hashtags, mentions, and links</li>
              <li>Image upload for both avatar and tweet content</li>
              <li>Adjustable engagement metrics (replies, retweets, likes, views)</li>
              <li>Date and time settings for the tweet</li>
              <li>Light and dark theme options for preview</li>
              <li>Export options in PNG, JPEG, and WebP formats</li>
              <li>Mobile-responsive design for use on any device</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips & Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use high-quality images for both your avatar and tweet image to make your content stand out.</li>
              <li>Experiment with different combinations of hashtags and mentions to see how they affect your tweet's appearance.</li>
              <li>Try both light and dark themes to see which one suits your content better.</li>
              <li>Use realistic engagement numbers to make your tweet preview more authentic.</li>
              <li>When adding a link, consider how it affects your character count and adjust your tweet text accordingly.</li>
              <li>Use the verified status feature judiciously to match the account you're simulating.</li>
              <li>Export your tweet in different formats to see which one provides the best quality for your needs.</li>
              <li>Remember that this tool is for visualization purposes only – always follow Twitter's guidelines when actually posting content.</li>
            </ul>
          </div>
  </ToolLayout>
  );
}