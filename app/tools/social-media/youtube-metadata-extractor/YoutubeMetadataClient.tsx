'use client'

import React, { useState, useRef } from 'react'
import { Search, Download, RefreshCw, Clipboard, Check, AlertCircle, Tag, Info, Lightbulb, BookOpen, Calendar, Eye, ThumbsUp, User } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'

interface VideoMetadata {
  tags: string[]
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  viewCount: string
  likeCount: string
  commentCount: string
  channelTitle: string
  channelId: string
}

export default function YouTubeMetadataExtractor() {
  const [videoUrl, setVideoUrl] = useState('')
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const fetchVideoMetadata = async () => {
    setError('')
    setMetadata(null)
    setLoading(true)

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setError('Invalid YouTube URL')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=AIzaSyA0PxWAlxu6KE9o9bkn1K5mjlbtBFiSmes`
      )
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const { snippet, statistics } = data.items[0]
        setMetadata({
          tags: snippet.tags || [],
          title: snippet.title,
          description: snippet.description,
          thumbnail: snippet.thumbnails.high.url,
          publishedAt: new Date(snippet.publishedAt).toLocaleDateString(),
          viewCount: statistics.viewCount,
          likeCount: statistics.likeCount,
          commentCount: statistics.commentCount,
          channelTitle: snippet.channelTitle,
          channelId: snippet.channelId
        })
        toast.success('Video metadata extracted successfully!')
      } else {
        setError('No data found for this video')
      }
    } catch (err) {
      setError('Failed to fetch video metadata. Please try again.')
    }

    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVideoMetadata()
  }

  const handleReset = () => {
    setVideoUrl('')
    setMetadata(null)
    setError('')
    setCopied(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success('Metadata copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const downloadMetadata = () => {
    if (!metadata) return
    const metadataText = JSON.stringify(metadata, null, 2)
    const blob = new Blob([metadataText], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'youtube_metadata.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Metadata downloaded!')
  }

  return (
    <ToolLayout
      title="YouTube Metadata Extractor"
      description="Extract comprehensive metadata from any YouTube video"
    >
      <Toaster position="top-right" />
      
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              ref={inputRef}
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL"
              className="flex-grow bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="animate-spin mr-2" size={20} />
              ) : (
                <Search className="mr-2" size={20} />
              )}
              {loading ? 'Extracting...' : 'Extract'}
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <RefreshCw className="mr-2" size={20} />
              Reset
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md mb-6 flex items-center">
            <AlertCircle className="mr-2 flex-shrink-0" size={20} />
            <span>{error}</span>
          </div>
        )}

        {metadata && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Extracted Video Metadata</h2>
            <div className="bg-gray-700 rounded-lg p-4 shadow-md mb-6">
              <img src={metadata.thumbnail} alt="Video Thumbnail" className="w-full rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Video Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white mb-4">
                <div>
                  <p className="font-semibold">Title:</p>
                  <p>{metadata.title}</p>
                </div>
                <div>
                  <p className="font-semibold">Channel:</p>
                  <p>{metadata.channelTitle}</p>
                </div>
                <div>
                  <p className="font-semibold">Published Date:</p>
                  <p>{metadata.publishedAt}</p>
                </div>
                <div>
                  <p className="font-semibold">View Count:</p>
                  <p>{metadata.viewCount}</p>
                </div>
                <div>
                  <p className="font-semibold">Like Count:</p>
                  <p>{metadata.likeCount}</p>
                </div>
                <div>
                  <p className="font-semibold">Comment Count:</p>
                  <p>{metadata.commentCount}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tags</h3>
              <p className="text-white mb-3">
                {metadata.tags.length > 0 ? metadata.tags.join(', ') : 'No tags found'}
              </p>
              <h3 className="text-xl font-bold text-white mb-2">Description</h3>
              <p className="text-white mb-4 whitespace-pre-wrap">{metadata.description}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={downloadMetadata}
                  className="bg-green-500 hover:bg-green-600 text-white flex-1"
                >
                  <Download className="mr-2" size={16} />
                  Download Metadata
                </Button>
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(metadata, null, 2))}
                  className="bg-purple-500 hover:bg-purple-600 text-white flex-1"
                >
                  {copied ? (
                    <Check className="mr-2" size={16} />
                  ) : (
                    <Clipboard className="mr-2" size={16} />
                  )}
                  {copied ? 'Copied!' : 'Copy Metadata'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {!metadata && !error && (
          <div className="text-center text-gray-400 py-12">
            <Tag size={48} className="mx-auto mb-4" />
            <p>Enter a YouTube video URL to extract metadata</p>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About YouTube Metadata Extractor
        </h2>
        <p className="text-gray-300 mb-4">
          Our YouTube Metadata Extractor is a comprehensive tool designed to help you easily extract detailed metadata from any YouTube video. This tool is perfect for content creators, marketers, researchers, and data analysts who want to gain insights into YouTube videos and channels.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Extract comprehensive metadata from any YouTube video by entering the video URL.</li>
          <li>View the video thumbnail along with extracted metadata.</li>
          <li>Display detailed video information including title, channel, publish date, view count, like count, and comment count.</li>
          <li>Extract and display video tags and description.</li>
          <li>Copy all extracted metadata to clipboard with a single click.</li>
          <li>Download metadata as a JSON file for easy sharing and analysis.</li>
          <li>Clean and user-friendly interface for a smooth experience.</li>
          <li>No login required - use the tool directly in your browser.</li>
          <li>Compatible with all devices and browsers.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use YouTube Metadata Extractor
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Copy the URL of the YouTube video you want to analyze.</li>
          <li>Paste the URL into the input field of the YouTube Metadata Extractor.</li>
          <li>Click the "Extract" button to fetch the comprehensive metadata.</li>
          <li>View the extracted metadata including tags, title, description, thumbnail, and various statistics.</li>
          <li>Copy the metadata to your clipboard or download it as a JSON file for further analysis.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use the extracted metadata to gain insights into successful video strategies on YouTube.</li>
          <li>Analyze popular videos in your niche to identify trends in titles, descriptions, and tags.</li>
          <li>Compare metadata across multiple videos to understand what drives engagement (views, likes, comments).</li>
          <li>Use the downloaded metadata to create a database for content analysis and strategy planning.</li>
          <li>Study the relationship between various metadata elements to optimize your own YouTube content.</li>
          <li>Use the channel information to discover and analyze successful creators in your niche.</li>
          <li>Combine the metadata extractor with other analytics tools to create comprehensive YouTube performance reports.</li>
        </ul>
      </div>
    </ToolLayout>
  )
}