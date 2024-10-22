'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import  Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider  from "@/components/ui/Slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster,} from 'react-hot-toast'
import { Download, Camera, User, MoreHorizontal, Bookmark, Info, BookOpen, Lightbulb } from 'lucide-react'
import HeartIcon from '@/components/ui/HeartIcon'
import ShareIcon from '@/components/ui/ShareIcon'
import CommentIcon from '@/components/ui/CommentIcon'
import ToolLayout from '@/components/ToolLayout'

const VerifiedBadge = () => (
  <svg viewBox="0 0 22 22" aria-label="Verified account" role="img" className="w-4 h-4 ml-1 inline-block fill-[#1d9bf0]">
    <g>
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
    </g>
  </svg>
);

const InstagramStoryIcon = () => (
  <svg className="w-8 h-8 absolute top-0 left-0 m-1">
    <image x="0" y="0" width="100%" height="100%" href="data:image/png;base64,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" preserveAspectRatio="xMidYMid slice" />
  </svg>
);

interface InstagramPostProps {
  theme: 'light' | 'dark'
  username: string
  isVerified: boolean
  location: string
  postTime: string
  avatarUrl: string
  postImageUrl: string
  postText: string
  imageSize: { width: number; height: number }
  likeCount: number
  commentCount: number
  isLikedByViewer: boolean
  isSomeoneTagged: boolean
  hasInstagramStory: boolean
  areCommentsDisplayed: boolean
  hashtags: string
  mentions: string
}

const InstagramPost = React.forwardRef<HTMLDivElement, InstagramPostProps>(({ 
  theme,
  username,
  isVerified,
  location,
  postTime,
  avatarUrl,
  postImageUrl,
  postText,
  imageSize,
  likeCount,
  commentCount,
  isLikedByViewer,
  hasInstagramStory,
  areCommentsDisplayed,
  hashtags,
  mentions
}, ref) => {
  return (
    <div ref={ref} className={`bg-${theme === 'light' ? 'white' : 'gray-900'} w-[375px] rounded-lg overflow-hidden`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full text-gray-600" />
            )}
            {hasInstagramStory && <InstagramStoryIcon />}
          </div>
          <div>
            <p className={`font-semibold text-sm ${theme === 'light' ? 'text-black' : 'text-white'}`}>
              {username}
              {isVerified && <VerifiedBadge />}
              <span className={`font-normal ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} ml-1`}> · {postTime}</span>
            </p>
            {location && <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{location}</p>}
          </div>
        </div>
        <MoreHorizontal className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} size={20} />
      </div>
      <div className="aspect-[4/5] bg-gray-200">
        {postImageUrl ? (
          <img 
            src={postImageUrl} 
            alt="Post image" 
            className="w-full h-full object-cover"
            style={{
              width: `${imageSize.width}%`,
              height: `${imageSize.height}%`,
              objectFit: 'cover'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <HeartIcon className={`h-6 w-6 ${isLikedByViewer ? 'fill-red-500 text-red-500' : theme === 'light' ? 'text-black' : 'text-white'}`} />
            <CommentIcon className={`h-6 w-6 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
            <ShareIcon className={`h-6 w-6 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
          </div>
          <Bookmark className={`h-6 w-6 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
        </div>
        <p className={`font-semibold mb-1 ${theme === 'light' ? 'text-black' : 'text-white'}`}>{likeCount.toLocaleString()} likes</p>
        <p className={theme === 'light' ? 'text-black' : 'text-white'}>
          <span className="font-semibold">{username}</span> {postText}
        </p>
        {hashtags && (
          <p className="text-blue-500 mt-1">
            {hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ')}
          </p>
        )}
        {mentions && (
          <p className="text-blue-500 mt-1">
            {mentions.split(',').map(mention => `@${mention.trim()}`).join(' ')}
          </p>
        )}
        {areCommentsDisplayed && (
          <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
            View all {commentCount.toLocaleString()} comments
          </p>
        )}
      </div>
    </div>
  )
})

InstagramPost.displayName = 'InstagramPost'

export default function InstagramPostGenerator() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [username, setUsername] = useState('premnash')
  const [isVerified, setIsVerified] = useState(false)
  const [location, setLocation] = useState('New York, USA')
  const [postTime, setPostTime] = useState('18m')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [postImageUrl, setPostImageUrl] = useState('')
  const [postText, setPostText] = useState('Type your sample post here.')
  const [imageSize, setImageSize] = useState({ width: 100, height: 100 })
  const [likeCount, setLikeCount] = useState(1234)
  const [commentCount, setCommentCount] = useState(56)
  const [isLikedByViewer, setIsLikedByViewer] = useState(false)
  const [isSomeoneTagged, setIsSomeoneTagged] = useState(false)
  const [hasInstagramStory, setHasInstagramStory] = useState(false)
  const [areCommentsDisplayed, setAreCommentsDisplayed] = useState(true)
  const [hashtags, setHashtags] = useState('travel')
  const [mentions, setMentions] = useState('tony')
  const [expandText, setExpandText] = useState(false);

  const postRef = useRef<HTMLDivElement>(null)

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

  const exportPost = () => {
    if (postRef.current) {
      const scale = 2; // Increase this for higher resolution
      const canvas = document.createElement('canvas');
      canvas.width = 375 * scale;
      canvas.height = 469 * scale;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.scale(scale, scale);
        ctx.fillStyle = theme === 'light' ? 'white' : '#111827'; // Match the background color
        ctx.fillRect(0, 0, 375, 469);

        const svgData = `
          <svg xmlns="http://www.w3.org/2000/svg" width="375" height="469">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml">
                ${postRef.current.outerHTML}
              </div>
            </foreignObject>
          </svg>
        `;

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 375, 469);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = 'instagram-post.png';
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        };
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
      }
    }
  };

  return (
    <ToolLayout
      title="Instagram Photo Generator"
      description="Create an engaging and professional-looking Instagram posts"
    >

      <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Instagram Post Preview</h2>
            <div className="flex justify-center">
              <InstagramPost
                ref={postRef}
                theme={theme}
                username={username}
                isVerified={isVerified}
                location={location}
                postTime={postTime}
                avatarUrl={avatarUrl}
                postImageUrl={postImageUrl}
                postText={postText}
                imageSize={imageSize}
                likeCount={likeCount}
                commentCount={commentCount}
                isLikedByViewer={isLikedByViewer}
                isSomeoneTagged={isSomeoneTagged}
                hasInstagramStory={hasInstagramStory}
                areCommentsDisplayed={areCommentsDisplayed}
                hashtags={hashtags}
                mentions={mentions}
                
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Instagram Post Settings</h2>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <div className="space-y-4">
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
                  <div>
                    <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-time" className="text-white mb-2 block">Post Time</Label>
                    <Input
                      id="post-time"
                      value={postTime}
                      onChange={(e) => setPostTime(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                      placeholder="e.g. 2w, 3d, 5h, 18m"
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
                    <Label htmlFor="image-width" className="text-white mb-2 block">Image Width: {imageSize.width}%</Label>
                    <Slider
                      id="image-width"
                      min={10}
                      max={100}
                      step={1}
                      value={imageSize.width}
                      onChange={(value) => setImageSize(prev => ({ ...prev, width: value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-height" className="text-white mb-2 block">Image Height: {imageSize.height}%</Label>
                    <Slider
                      id="image-height"
                      min={10}
                      max={100}
                      step={1}
                      value={imageSize.height}
                      onChange={(value) => setImageSize(prev => ({ ...prev, height: value }))}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="user">
                <div className="space-y-4">
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
                  <Label htmlFor="post-text" className="text-white mb-2 block">
                    Post Text
                    <span className="text-xs text-yellow-500 ml-2">(Max 120 characters)</span>
                  </Label>
                  <Textarea
                    id="post-text"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    rows={4}
                  />
                  {postText.length > 120 && (
                    <p className="text-xs text-gray-400 mt-1">
                      ...more <span onClick={() => setExpandText(!expandText)} className="text-yellow-500 cursor-pointer">({expandText ? 'hide' : 'show'})</span>
                      {expandText && (
                        <span className="text-gray-400">
                          {postText.slice(120)}
                        </span>
                      )}
                    </p>
                  )}
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
                </div>
              </TabsContent>
              <TabsContent value="engagement">
                <div className="space-y-4">
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
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={exportPost} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Export Instagram Post
            </Button>
          </div>
          {/* About section remains unchanged */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Instagram Post Generator
            </h2>
            <p className="text-gray-300 mb-4">
              Our Instagram Post Generator is a powerful tool designed to help you create engaging and professional-looking Instagram posts. Whether you're a social media manager, influencer, or business owner, this tool allows you to customize every aspect of your post, from the image and caption to engagement metrics and visual style.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use the preview at the top to see your Instagram post in real-time.</li>
              <li>Adjust settings in the tabs below to customize your post.</li>
              <li>Upload your avatar and post images using the file upload buttons.</li>
              <li>Customize the post text, hashtags, and mentions to suit your content.</li>
              <li>Adjust engagement metrics like likes and comments to simulate different levels of interaction.</li>
              <li>Toggle additional features such as verified account status and liked by viewer.</li>
              <li>Use the image resize sliders to adjust the size of your post image.</li>
              <li>When you're satisfied with your post, click one of the export buttons to save your creation as PNG or JPEG.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Real-time preview of your Instagram post</li>
              <li>Customizable user profile (username, avatar, verified status)</li>
              <li>Post image upload and preview with resizing options</li>
              <li>Editable post caption with support for hashtags and mentions</li>
              <li>Adjustable engagement metrics (likes, comments)</li>
              <li>Date and time settings</li>
              <li>Light and dark theme options for preview</li>
              <li>Export options in PNG and JPEG formats</li>
              <li>Mobile-responsive design for easy use on any device</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips & Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use high-quality images for both your avatar and post to make your content stand out.</li>
              <li>Include relevant hashtags to increase the discoverability of your post.</li>
              <li>Mention other accounts (like collaborators or featured brands) to boost engagement.</li>
              <li>Adjust the likes and comments to reflect realistic engagement for your account size.</li>
              <li>Preview your post in both light and dark themes to ensure it looks good in all settings.</li>
              <li>Keep your captions concise and engaging to maintain viewer interest.</li>
              <li>Use the image resize feature to focus on the most important parts of your image.</li>
              <li>Experiment with different combinations of settings to create the perfect post for your audience.</li>
            </ul>
          </div>
  </ToolLayout>
  )
}