'use client'

import React from 'react'
import { MoreHorizontal, Bookmark, Camera } from 'lucide-react'
import HeartIcon from '@/components/ui/HeartIcon'
import ShareIcon from '@/components/ui/ShareIcon'
import CommentIcon from '@/components/ui/CommentIcon'
import ImageDotsIndicator from '@/components/ImageDotsIndicator'
import { Button } from "@/components/ui/Button"

const VerifiedBadge = () => (
  <svg 
    aria-label="Verified" 
    className="w-3 h-3 ml-0.5 inline-block" 
    fill="#3897f0" 
    viewBox="0 0 40 40"
  >
    <path 
      fillRule="evenodd"
      d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" 
      clipRule="evenodd"
    />
  </svg>
)

const InstagramStoryRing = () => (
  <svg className="absolute inset-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)]" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" stroke="url(#instagramGradient)" strokeWidth="3" fill="none" />
  </svg>
)

const SomeoneTaggedIcon = () => (
  <svg aria-label="Tags" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.334 23H2.666a1 1 0 0 1-1-1v-1.354a6.279 6.279 0 0 1 6.272-6.272h8.124a6.279 6.279 0 0 1 6.271 6.271V22a1 1 0 0 1-1 1ZM12 13.269a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6Z" />
  </svg>
)

interface Comment {
  username: string;
  text: string;
}

interface InstagramPostProps {
  theme: 'light' | 'dark'
  username: string
  isVerified: boolean
  location: string
  postTime: string
  avatarUrl: string
  postImageUrl: string
  postText: string
  likeCount: number
  commentCount: number
  isLikedByViewer: boolean
  hasInstagramStory: boolean
  areCommentsDisplayed: boolean
  imageCount: number
  currentImageIndex: number
  isSomeoneTagged: boolean
  comments: Comment[]
  onResetAvatar: () => void;
  onResetPostImage: () => void;
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
  likeCount,
  commentCount,
  isLikedByViewer,
  hasInstagramStory,
  areCommentsDisplayed,
  imageCount,
  currentImageIndex,
  isSomeoneTagged,
  comments,
  onResetAvatar,
  onResetPostImage
}, ref) => {
  const processPostText = (text: string) => {
    const hashtagRegex = /#[a-zA-Z0-9]+/g
    const mentionRegex = /@[a-zA-Z0-9]+/g
    const urlRegex = /(https?:\/\/[^\s]+)/g

    let processedText = text
      .replace(hashtagRegex, '<span class="text-[#00376b]">$&</span>')
      .replace(mentionRegex, '<span class="text-[#00376b]">$&</span>')
      .replace(urlRegex, '<a href="$1" class="text-[#00376b]" target="_blank" rel="noopener noreferrer">$1</a>')

    return processedText
  }

  const placeholderImage = `/Images/InstagramPostGeneratordefaultImage.jpg?height=400&width=400`
  const defaultAvatarImage = "/Images/cbimage.png?height=32&width=32"

  return (
    <div 
      id="instagram-post" 
      ref={ref} 
      className={`bg-${theme === 'light' ? 'white' : 'black'} w-[375px] rounded-lg overflow-hidden shadow-lg`}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8">
            {hasInstagramStory && <InstagramStoryRing />}
            <div className={`w-8 h-8 rounded-full overflow-hidden ${hasInstagramStory ? 'relative z-10' : ''}`}>
              <img src={avatarUrl || defaultAvatarImage} alt="User avatar" className="w-full h-full object-cover" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute inset-0 opacity-0 hover:opacity-100 bg-black bg-opacity-50 flex items-center justify-center"
                onClick={onResetAvatar}
              >
                <Camera className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <span className={`font-semibold text-sm ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                {username}
              </span>
              {isVerified && <VerifiedBadge />}
              <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                • {postTime}
              </span>
            </div>
            {location && (
              <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                {location}
              </p>
            )}
          </div>
        </div>
        <MoreHorizontal className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} size={20} />
      </div>

      <div className="relative">
        <div className="aspect-square bg-gray-200">
          <img 
            src={postImageUrl || placeholderImage} 
            alt="Post image" 
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-0 opacity-0 hover:opacity-100 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={onResetPostImage}
          >
            <Camera className="h-8 w-8 text-white" />
          </Button>
          {isSomeoneTagged && (
            <div className="absolute bottom-3 left-3 bg-[#333333] rounded-full p-1">
              <SomeoneTaggedIcon />
            </div>
          )}
          {imageCount > 1 && (
            <>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
              <img 
                src="data:image/png;base64,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"
                alt="Icon"
                className="w-6 h-6"
              />
            </div>

              <ImageDotsIndicator total={imageCount} current={currentImageIndex} theme={theme} />
            </>
          )}
   
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <HeartIcon className={`h-6 w-6 ${isLikedByViewer ? 'fill-red-500 text-red-500' : theme === 'light' ? 'text-black' : 'text-white'}`} />
            <CommentIcon className={`h-6 w-6 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
            <ShareIcon className={`h-6 w-6 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
          </div>
          <Bookmark className={`h-6 w-6 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
        </div>

        <p className={`font-semibold mb-1 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
          {likeCount.toLocaleString()} likes
        </p>

        <div className="space-y-1">
          <p className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
            <span className="font-semibold">{username}</span>{' '}
            {postText.length > 120 ? (
              <>
                <span dangerouslySetInnerHTML={{ __html: processPostText(postText.slice(0, 120)) }} />
                <span className="text-gray-500 cursor-pointer">... more</span>
              </>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: processPostText(postText) }} />
            )}
          </p>

          {areCommentsDisplayed && commentCount > 0 && (
            <>
              <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                View all {commentCount.toLocaleString()} comments
              </p>
              {comments.slice(0, 2).map((comment, index) => (
                <p key={index} className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm`}>
                  <span className="font-semibold">{comment.username}</span>{' '}
                  <span dangerouslySetInnerHTML={{ __html: processPostText(comment.text) }} />
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
})

InstagramPost.displayName = 'InstagramPost'

export default InstagramPost
