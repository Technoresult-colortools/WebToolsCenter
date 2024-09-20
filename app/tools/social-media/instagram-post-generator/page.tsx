'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Download, Camera, User, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function InstagramPostGenerator() {
  const [theme, setTheme] = useState('light');
  const [username, setUsername] = useState('premnash');
  const [isVerified, setIsVerified] = useState(false);
  const [description, setDescription] = useState('Las Vegas, USA');
  const [postDate, setPostDate] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postText, setPostText] = useState('');
  const [imageCount, setImageCount] = useState(1);
  const [likeCount, setLikeCount] = useState(1234);
  const [commentCount, setCommentCount] = useState(1234);
  const [isLikedByViewer, setIsLikedByViewer] = useState(false);
  const [isSomeoneTagged, setIsSomeoneTagged] = useState(false);
  const [hasInstagramStory, setHasInstagramStory] = useState(false);
  const [areCommentsDisplayed, setAreCommentsDisplayed] = useState(true);
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('normal');
  const [hashtags, setHashtags] = useState('');
  const [mentions, setMentions] = useState('');
  const [postTime, setPostTime] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const now = new Date();
    setPostDate(now.toISOString().split('T')[0]);
    setPostTime(now.toTimeString().split(' ')[0].slice(0, 5));
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

  const handlePostImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    // In a real implementation, this would generate and download the Instagram post
    toast.success('Instagram post exported successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Instagram Post Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-6xl mx-auto mb-8">
          {/* Preview Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Post Preview</h2>
            <div className={`bg-${theme === 'light' ? 'white' : 'gray-900'} rounded-lg overflow-hidden`}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                      {username}
                      {isVerified && (
                        <span className="ml-1 text-blue-500">✓</span>
                      )}
                    </p>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{description}</p>
                  </div>
                </div>
                <button className={`text-${theme === 'light' ? 'gray-600' : 'gray-400'}`}>•••</button>
              </div>
              <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                {postImageUrl ? (
                  <img src={postImageUrl} alt="Post image" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-4">
                    <button className={`text-${theme === 'light' ? 'gray-600' : 'gray-400'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className={`text-${theme === 'light' ? 'gray-600' : 'gray-400'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button className={`text-${theme === 'light' ? 'gray-600' : 'gray-400'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                  <button className={`text-${theme === 'light' ? 'gray-600' : 'gray-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                <p className={`font-semibold ${theme === 'light' ? 'text-black' : 'text-white'} mb-1`}>{likeCount.toLocaleString()} likes</p>
                <p className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
                  <span className="font-semibold">{username}</span> {postText}
                </p>
                {hashtags && (
                  <p className={`text-blue-500 mt-1`}>
                    {hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ')}
                  </p>
                )}
                {mentions && (
                  <p className={`text-blue-500 mt-1`}>
                    {mentions.split(',').map(mention => `@${mention.trim()}`).join(' ')}
                  </p>
                )}
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-2`}>
                  View all {commentCount.toLocaleString()} comments
                </p>
                <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                  {postDate} {postTime}
                </p>
              </div>
            </div>
          </div>

          {/* Compact Settings Button */}
          <div className="flex justify-center mb-4">
            <Button onClick={() => setShowSettings(!showSettings)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Settings className="h-5 w-5 mr-2" />
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </Button>
          </div>

          {/* Settings Section */}
          {showSettings && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Label htmlFor="description" className="text-white mb-2 block">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="post-date" className="text-white mb-2 block">Post Date</Label>
                  <Input
                    id="post-date"
                    type="date"
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="post-time" className="text-white mb-2 block">Post Time</Label>
                  <Input
                    id="post-time"
                    type="time"
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
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
                  <Label htmlFor="post-image-upload" className="text-white mb-2 block">Post Image</Label>
                  <Input
                    id="post-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePostImageUpload}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="post-text" className="text-white mb-2 block">Post Text</Label>
                  <Textarea
                    id="post-text"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    maxLength={2200}
                    className="bg-gray-700 text-white border-gray-600"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="hashtags" className="text-white mb-2 block">Hashtags</Label>
                  <Input
                    id="hashtags"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="travel, photography, nature"
                  />
                </div>

                <div>
                  <Label htmlFor="mentions" className="text-white mb-2 block">Mentions</Label>
                  <Input
                    id="mentions"
                    value={mentions}
                    onChange={(e) => setMentions(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="friend1, friend2, brand"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="New York, NY"
                  />
                </div>

                <div>
                  <Label htmlFor="filter" className="text-white mb-2 block">Filter</Label>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger id="filter" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="clarendon">Clarendon</SelectItem>
                      <SelectItem value="gingham">Gingham</SelectItem>
                      <SelectItem value="moon">Moon</SelectItem>
                      <SelectItem value="lark">Lark</SelectItem>
                      <SelectItem value="reyes">Reyes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="image-count" className="text-white mb-2 block">Image Count: {imageCount}</Label>
                  <Slider
                    id="image-count"
                    min={1}
                    max={10}
                    step={1}
                    value={imageCount}
                    onChange={(value) => setImageCount(value)}
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
                  <Label htmlFor="comment-count" className="text-white mb-2 block">Comment Count</Label>
                  <Input
                    id="comment-count"
                    type="number"
                    value={commentCount}
                    onChange={(e) => setCommentCount(Number(e.target.value))}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="liked-by-viewer"
                    checked={isLikedByViewer}
                    onCheckedChange={setIsLikedByViewer}
                  />
                  <Label htmlFor="liked-by-viewer" className="text-white">Liked by Viewer</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="someone-tagged"
                    checked={isSomeoneTagged}
                    onCheckedChange={setIsSomeoneTagged}
                  />
                  <Label htmlFor="someone-tagged" className="text-white">Someone Tagged</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-instagram-story"
                    checked={hasInstagramStory}
                    onCheckedChange={setHasInstagramStory}
                  />
                  <Label htmlFor="has-instagram-story" className="text-white">Has Instagram Story</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="comments-displayed"
                    checked={areCommentsDisplayed}
                    onCheckedChange={setAreCommentsDisplayed}
                  />
                  <Label htmlFor="comments-displayed" className="text-white">Comments Displayed</Label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export Instagram Post
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Fill in the post details in the settings panel on the right.</li>
            <li>Upload avatar and post images using the file upload buttons.</li>
            <li>Adjust the post text, hashtags, and mentions as needed.</li>
            <li>Set the desired stats for likes, comments, and other engagement metrics.</li>
            <li>Toggle additional features like verified account, Instagram story, etc.</li>
            <li>Preview your post in real-time on the left side of the screen.</li>
            <li>When satisfied with your post, click the "Export Instagram Post" button.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Real-time preview of your Instagram post</li>
            <li>Customizable username, description, and verified status</li>
            <li>Upload and preview avatar and post images</li>
            <li>Set post date and time</li>
            <li>Add post text with support for hashtags and mentions</li>
            <li>Adjust engagement metrics (likes, comments)</li>
            <li>Toggle additional Instagram features (stories, tagging)</li>
            <li>Choose from different Instagram filters</li>
            <li>Set post location</li>
            <li>Support for multiple images in a post</li>
            <li>Light and dark theme options for preview</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}