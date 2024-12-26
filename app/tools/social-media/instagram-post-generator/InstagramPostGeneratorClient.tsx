'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { BookOpen, Cog, Download, FileText, Info, Lightbulb, MessageSquare, Share2, TrendingUp, User, RefreshCw } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import InstagramPost from '@/components/InstagramPost'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Image from 'next/image'
import { CustomFileInput } from '@/components/CustomFileInput'

interface Comment {
  username: string;
  text: string;
}

export default function InstagramPostGenerator() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [username, setUsername] = useState('premnash')
  const [isVerified, setIsVerified] = useState(false)
  const [location, setLocation] = useState('Mumbai, India')
  const [postDate, setPostDate] = useState<'minutes' | 'hours' | 'days' | 'weeks'>('minutes')
  const [postValue, setPostValue] = useState<number>(1)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [postImageUrl, setPostImageUrl] = useState('')
  const [postText, setPostText] = useState('Type your sample post here. Use #hashtags and @mentions directly in the text.')
  const [likeCount, setLikeCount] = useState(1234)
  const [commentCount, setCommentCount] = useState(56)
  const [isLikedByViewer, setIsLikedByViewer] = useState(false)
  const [isSomeoneTagged, setIsSomeoneTagged] = useState(false)
  const [hasInstagramStory, setHasInstagramStory] = useState(false)
  const [areCommentsDisplayed, setAreCommentsDisplayed] = useState(true)
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [imageCount, setImageCount] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [comments, setComments] = useState<Comment[]>([
    { username: 'premnash', text: 'Great post!' },
    { username: 'premnash', text: 'Thanks for sharing! 🔥🔥🔥!' }
  ])
  const [avatarFileName, setAvatarFileName] = useState('')
  const [postImageFileName, setPostImageFileName] = useState('')

  const postRef = useRef<HTMLDivElement>(null)

  const getFormattedPostTime = () => {
    const value = postValue.toString()
    switch(postDate) {
      case 'minutes':
        return `${value}m`
      case 'hours':
        return `${value}h`
      case 'days':
        return `${value}d`
      case 'weeks':
        return `${value}w`
      default:
        return '1m'
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePostImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPostImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCommentUpdate = (index: number, field: 'username' | 'text', value: string) => {
    setComments(prev => prev.map((comment, i) => 
      i === index ? { ...comment, [field]: value } : comment
    ))
  }

  const handleResetAvatar = () => {
    setAvatarUrl('')
    setAvatarFileName('')
  }

  const handleResetPostImage = () => {
    setPostImageUrl('')
    setPostImageFileName('')
  }

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/render-instagram-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          username,
          isVerified,
          location,
          postTime: getFormattedPostTime(),
          avatarUrl,
          postImageUrl,
          postText,
          likeCount,
          commentCount,
          isLikedByViewer,
          isSomeoneTagged,
          hasInstagramStory,
          areCommentsDisplayed,
          imageCount,
          currentImageIndex,
          comments,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.error}. Details: ${errorData.details}`);
      }
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      link.download = `instagram_post_${randomNumber}_webtoolcenter.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Instagram post downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image. Please try again.');
    }
  };

  const handleResetToDefault = () => {
    setTheme('light')
    setUsername('premnash')
    setIsVerified(false)
    setLocation('Mumbai, India')
    setPostDate('minutes')
    setPostValue(1)
    setAvatarUrl('')
    setPostImageUrl('')
    setPostText('Type your sample post here. Use #hashtags and @mentions directly in the text.')
    setLikeCount(1234)
    setCommentCount(56)
    setIsLikedByViewer(false)
    setIsSomeoneTagged(false)
    setHasInstagramStory(false)
    setAreCommentsDisplayed(true)
    setImageCount(1)
    setCurrentImageIndex(0)
    setComments([
      { username: 'premnash', text: 'Great post!' },
      { username: 'premnash', text: 'Thanks for sharing! 🔥🔥🔥!' }
    ])
    setAvatarFileName('')
    setPostImageFileName('')
  }

  return (
    <ToolLayout
      title="Instagram Post Generator"
      description="Create realistic Instagram posts with our Fake Instagram Post Generator"
    >
      <Toaster position="top-right" />

      {/* Instagram Post Preview section */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Instagram Post Preview</h2>
        <div className="flex justify-center">
          <InstagramPost
            ref={postRef}
            theme={theme}
            username={username}
            isVerified={isVerified}
            location={location}
            postTime={getFormattedPostTime()}
            avatarUrl={avatarUrl}
            postImageUrl={postImageUrl}
            postText={postText}
            likeCount={likeCount}
            commentCount={commentCount}
            isLikedByViewer={isLikedByViewer}
            isSomeoneTagged={isSomeoneTagged}
            hasInstagramStory={hasInstagramStory}
            areCommentsDisplayed={areCommentsDisplayed}
            imageCount={imageCount}
            currentImageIndex={currentImageIndex}
            comments={comments}
            onResetAvatar={handleResetAvatar}
            onResetPostImage={handleResetPostImage}
          />
        </div>
      </div>

      {/* Instagram Post Settings section */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Instagram Post Settings</h2>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 gap-2 mb-6">
            <TabsTrigger value="general" className="flex items-center justify-center">
              <Cog className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center justify-center">
              <User className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">User</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center justify-center">
              <FileText className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Engagement</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Comments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              {/* Theme selection */}
              <div>
                <Label htmlFor="theme" className="text-white mb-2 block">Theme</Label>
                <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                  <SelectTrigger id="theme" className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Post time settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="post-value" className="text-white mb-2 block">Post Time Value</Label>
                  <Input
                    id="post-value"
                    type="number"
                    min={1}
                    max={99}
                    value={postValue}
                    onChange={(e) => setPostValue(Number(e.target.value))}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="post-date" className="text-white mb-2 block">Post Time Unit</Label>
                  <Select value={postDate} onValueChange={(value: 'minutes' | 'hours' | 'days' | 'weeks') => setPostDate(value)}>
                    <SelectTrigger id="post-date" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select time unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location input */}
              <div>
                <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>

              {/* Image count selection */}
              <div>
                <Label htmlFor="image-count" className="text-white mb-2 block">Number of Images</Label>
                <Select 
                  value={imageCount.toString()} 
                  onValueChange={(value) => {
                    setImageCount(Number(value))
                    setCurrentImageIndex(0)
                  }}
                >
                  <SelectTrigger id="image-count" className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select number of images" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current image selection (if multiple images) */}
              {imageCount > 1 && (
                <div>
                  <Label htmlFor="current-image" className="text-white mb-2 block">Current Image</Label>
                  <Select 
                    value={currentImageIndex.toString()} 
                    onValueChange={(value) => setCurrentImageIndex(Number(value))}
                  >
                    <SelectTrigger id="current-image" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select current image" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      {Array.from({ length: imageCount }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>Image {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Post image upload */}
              <div>
                <Label htmlFor="post-image-upload" className="text-white mb-2 block">Post Image</Label>
                <CustomFileInput
                  id="post-image-upload"
                  onChange={handlePostImageUpload}
                  onReset={handleResetPostImage}
                  accept="image/*"
                  className="bg-gray-700 text-white border-gray-600"
                  fileName={postImageFileName}
                  setFileName={setPostImageFileName}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user">
            <div className="space-y-4">
              {/* Username input */}
              <div>
                <Label htmlFor="username" className="text-white mb-2 block">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>

              {/* Verified account toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={isVerified}
                  onCheckedChange={setIsVerified}
                />
                <Label htmlFor="verified" className="text-white">Verified Account</Label>
              </div>

              {/* Instagram story toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="has-story"
                  checked={hasInstagramStory}
                  onCheckedChange={setHasInstagramStory}
                />
                <Label htmlFor="has-story" className="text-white">Has Instagram Story</Label>
              </div>

              {/* Avatar image upload */}
              <div>
                <Label htmlFor="avatar-upload" className="text-white mb-2 block">Avatar Image</Label>
                <CustomFileInput
                  id="avatar-upload"
                  onChange={handleAvatarUpload}
                  onReset={handleResetAvatar}
                  accept="image/*"
                  className="bg-gray-700 text-white border-gray-600"
                  fileName={avatarFileName}
                  setFileName={setAvatarFileName}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-4">
              {/* Post text input */}
              <div>
                <Label htmlFor="post-text" className="text-white mb-2 block">
                  Post Text
                  <span className="text-xs text-yellow-500 ml-2">(Use #hashtags and @mentions directly in the text)</span>
                </Label>
                <Textarea
                  id="post-text"
                  value={postText}
                  onChange={(e) => {
                    const text = e.target.value;
                    if (text.length <= 300) {
                      setPostText(text);
                    }
                  }}
                  className="bg-gray-700 text-white border-gray-600 w-full"
                  rows={4}
                  maxLength={300}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {postText.length}/300 characters
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="space-y-4">
              {/* Like count input */}
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

              {/* Comment count input */}
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

              {/* Liked by viewer toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="liked-by-viewer"
                  checked={isLikedByViewer}
                  onCheckedChange={setIsLikedByViewer}
                />
                <Label htmlFor="liked-by-viewer" className="text-white">Liked by Viewer</Label>
              </div>

              {/* Someone tagged toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="someone-tagged"
                  checked={isSomeoneTagged}
                  onCheckedChange={setIsSomeoneTagged}
                />
                <Label htmlFor="someone-tagged" className="text-white">Someone Tagged</Label>
              </div>

              {/* Comments displayed toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="comments-displayed"
                  checked={areCommentsDisplayed}
                  onCheckedChange={setAreCommentsDisplayed}
                />
                <Label htmlFor="comments-displayed" className="text-white">Comments Displayed</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="space-y-6">
              {/* Comment inputs */}
              {comments.map((comment, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-white">Comment {index + 1}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      value={comment.username}
                      onChange={(e) => handleCommentUpdate(index, 'username', e.target.value)}
                      placeholder="Username"
                      className="bg-gray-700 text-white border-gray-600 col-span-1"
                    />
                    <Input
                      value={comment.text}
                      onChange={(e) => handleCommentUpdate(index, 'text', e.target.value)}
                      placeholder="Comment text"
                      className="bg-gray-700 text-white border-gray-600 col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        {/* Reset to Default button */}
        <div className="mt-6">
          <Button onClick={handleResetToDefault} className="w-full bg-red-600 hover:bg-red-700 text-white">
            <RefreshCw className="h-5 w-5 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Download section */}
      <div className="flex justify-center mt-8 space-x-4">
        <Select value={exportFormat} onValueChange={(value: 'png' | 'jpeg' | 'webp') => setExportFormat(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white border-gray-600">
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="h-5 w-5 mr-2" />
          Download Instagram Post
        </Button>
      </div>

      {/* About section */}
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Instagram Post Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <p className="mb-4">
            Our Instagram Post Generator is a powerful and user-friendly tool designed to help content creators, marketers, and Instagram enthusiasts easily create engaging and professional-looking Instagram posts. This versatile tool offers a range of features to enhance your Instagram content creation process and workflow.
          </p>

          <div className="my-8">
            <Image 
              src="/Images/InstagramPostGeneratorPreview.png?height=400&width=600" 
              alt="Screenshot of the Instagram Post Generator interface showing post preview and customization options" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Real-time preview of your Instagram post</li>
            <li>Customizable user profile (username, avatar, verified status)</li>
            <li>Support for multiple images in a single post</li>
            <li>Post image upload and preview</li>
            <li>Editable post caption with support for hashtags and mentions</li>
            <li>Adjustable engagement metrics (likes, comments)</li>
            <li>Light and dark theme options</li>
            <li>Customizable post date and location</li>
            <li>Option to add Instagram story indicator</li>
            <li>Simulated comments with editable usernames and text</li>
            <li>Export options in PNG, JPEG, and WebP formats</li>
            <li>Mobile-responsive design for on-the-go use</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            How to Use Instagram Post Generator?
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Choose between light and dark theme for your post</li>
            <li>Set up your user profile (username, avatar, verified status)</li>
            <li>Upload a post image or use the default placeholder</li>
            <li>Write your post caption, including hashtags and mentions</li>
            <li>Adjust engagement metrics like likes and comments</li>
            <li>Add location and set the post time</li>
            <li>Customize additional features like Instagram story indicator or tagged users</li>
            <li>Preview your post in real-time as you make changes</li>
            <li>Select your preferred export format (PNG, JPEG, or WebP)</li>
            <li>Click the "Download Instagram Post" button to save your creation</li>
          </ol>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Content Creation: Design and visualize your Instagram posts before publishing</li>
            <li>Marketing: Create mock-ups for client approval or team collaboration</li>
            <li>Influencer Collaborations: Provide sponsors with post previews</li>
            <li>Education: Teach social media best practices with visual examples</li>
            <li>Personal Branding: Maintain a consistent aesthetic across your posts</li>
            <li>Event Promotion: Design eye-catching posts for upcoming events</li>
            <li>Product Launches: Visualize how new products will look on your Instagram feed</li>
          </ul>

          <p className="mt-6">
            By leveraging the Instagram Post Generator, you can streamline your content creation process, enhance your Instagram marketing strategies, and create visually appealing posts that stand out in the crowded social media landscape. Whether you're a seasoned influencer, a business owner, or just starting out on Instagram, this tool provides the functionality and ease of use you need to create professional-looking posts that engage your audience and elevate your Instagram presence.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

