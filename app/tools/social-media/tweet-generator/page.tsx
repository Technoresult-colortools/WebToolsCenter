'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Download, Upload, Twitter, Camera, User, Calendar, Hash, AtSign, Link, BarChart2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import html2canvas from 'html2canvas';

export default function TweetGenerator() {
  const [theme, setTheme] = useState('light');
  const [name, setName] = useState('John Doe');
  const [username, setUsername] = useState('johndoe');
  const [isVerified, setIsVerified] = useState(false);
  const [tweetDate, setTweetDate] = useState('');
  const [tweetTime, setTweetTime] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [tweetText, setTweetText] = useState('');
  const [tweetImage, setTweetImage] = useState('');
  const [replyCount, setReplyCount] = useState(0);
  const [retweetCount, setRetweetCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [hashtags, setHashtags] = useState('');
  const [mentions, setMentions] = useState('');
  const [links, setLinks] = useState('');
  const tweetRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    setTweetDate(now.toISOString().split('T')[0]);
    setTweetTime(now.toTimeString().split(' ')[0].slice(0, 5));
  }, []);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTweetImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTweetImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTweetText = (text: string) => {
    let formattedText = text;
    hashtags.split(',').forEach(tag => {
      formattedText = formattedText.replace(`#${tag.trim()}`, `<span class="text-blue-500">#${tag.trim()}</span>`);
    });
    mentions.split(',').forEach(mention => {
      formattedText = formattedText.replace(`@${mention.trim()}`, `<span class="text-blue-500">@${mention.trim()}</span>`);
    });
    links.split(',').forEach(link => {
      formattedText = formattedText.replace(link.trim(), `<span class="text-blue-500">${link.trim()}</span>`);
    });
    return formattedText;
  };

  const exportTweet = async (format: 'png' | 'jpeg' | 'webp') => {
    if (tweetRef.current) {
      try {
        const canvas = await html2canvas(tweetRef.current);
        const dataUrl = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.download = `tweet.${format}`;
        link.href = dataUrl;
        link.click();
        toast.success(`Tweet exported as ${format.toUpperCase()}`);
      } catch (error) {
        console.error('Error exporting tweet:', error);
        toast.error('Failed to export tweet');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Tweet Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Tweet Preview</h2>
              <div 
                ref={tweetRef}
                className={`bg-${theme === 'light' ? 'white' : 'gray-900'} rounded-lg overflow-hidden p-4`}
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-3">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full text-gray-600 p-2" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <p className={`font-bold ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                        {name}
                        {isVerified && (
                          <span className="ml-1 text-blue-500">✓</span>
                        )}
                      </p>
                      <p className={`ml-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>@{username} · {tweetDate}</p>
                    </div>
                    <div 
                      className={`mt-1 ${theme === 'light' ? 'text-black' : 'text-white'}`}
                      dangerouslySetInnerHTML={{ __html: formatTweetText(tweetText) }}
                    />
                    {tweetImage && (
                      <img src={tweetImage} alt="Tweet image" className="mt-2 rounded-lg max-w-full h-auto" />
                    )}
                    <div className="flex justify-between mt-4 text-gray-500">
                      <span>{replyCount} <span className="hidden sm:inline">Replies</span></span>
                      <span>{retweetCount} <span className="hidden sm:inline">Retweets</span></span>
                      <span>{likeCount} <span className="hidden sm:inline">Likes</span></span>
                      <span>{viewCount} <span className="hidden sm:inline">Views</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Tweet Settings</h2>
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

                <div>
                  <Label htmlFor="hashtags" className="text-white mb-2 block">Hashtags (comma-separated)</Label>
                  <Input
                    id="hashtags"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="tech, news, coding"
                  />
                </div>

                <div>
                  <Label htmlFor="mentions" className="text-white mb-2 block">Mentions (comma-separated)</Label>
                  <Input
                    id="mentions"
                    value={mentions}
                    onChange={(e) => setMentions(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="user1, user2, brand"
                  />
                </div>

                <div>
                  <Label htmlFor="links" className="text-white mb-2 block">Links (comma-separated)</Label>
                  <Input
                    id="links"
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="https://example.com, https://another.com"
                  />
                </div>

                <div>
                  <Label htmlFor="reply-count" className="text-white mb-2 block">Reply Count</Label>
                  <Input
                    id="reply-count"
                    type="number"
                    value={replyCount}
                    onChange={(e) => setReplyCount(Number(e.target.value))}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="retweet-count" className="text-white mb-2 block">Retweet Count</Label>
                  <Input
                    id="retweet-count"
                    type="number"
                    value={retweetCount}
                    onChange={(e) => setRetweetCount(Number(e.target.value))}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="like-count" className="text-white mb-2 block">Like Count</Label>
                  <Input
                    id="like-count"
                    type="number"
                    value={likeCount}
                    onChange={(e) => setLikeCount(Number(e.target.value))}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="view-count" className="text-white mb-2 block">View Count</Label>
                  <Input
                    id="view-count"
                    type="number"
                    value={viewCount}
                    onChange={(e) => setViewCount(Number(e.target.value))}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button onClick={() => exportTweet('png')} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export as PNG
            </Button>
            <Button onClick={() => exportTweet('jpeg')} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export as JPEG
            </Button>
            <Button onClick={() => exportTweet('webp')} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export as WebP
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Fill in the tweet details in the settings panel on the right.</li>
            <li>Upload avatar and tweet images using the file upload buttons.</li>
            <li>Add hashtags, mentions, and links in the respective fields.</li>
            <li>Set the desired engagement metrics (replies, retweets, likes, views).</li>
            <li>Toggle the verified account status if needed.</li>
            <li>Preview your tweet in real-time on the left side of the screen.</li>
            <li>When satisfied with your tweet, click one of the "Export" buttons to save the tweet as an image.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Real-time preview of your tweet</li>
            <li>Customizable name, username, and verified status</li>
            <li>Upload and preview avatar and tweet images</li>
            <li>Set tweet date and time</li>
            <li>Add tweet text with support for hashtags, mentions, and links</li>
            <li>Adjust engagement metrics (replies, retweets, likes, views)</li>
            <li>Light and dark theme options for preview</li>
            <li>Export tweet as PNG, JPEG, or WebP image</li>
            <li>Responsive design for use on various devices</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}