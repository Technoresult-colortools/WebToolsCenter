'use client'

import React, { useState, useRef } from 'react'
import { Search, Download, RefreshCw, Clipboard, Check, AlertCircle, Tag, Info, Lightbulb, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'

interface VideoData {
  tags: string[]
  title: string
  description: string
  thumbnail: string
}

export default function YouTubeKeywordTagExtractor() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const fetchVideoData = async () => {
    setError('')
    setVideoData(null)
    setLoading(true)

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setError('Invalid YouTube URL')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyA0PxWAlxu6KE9o9bkn1K5mjlbtBFiSmes`
      )
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const snippet = data.items[0].snippet
        const tags = snippet.tags || []
        const title = snippet.title
        const description = snippet.description
        const thumbnail = snippet.thumbnails.high.url

        setVideoData({ tags, title, description, thumbnail })
        toast.success('Video data extracted successfully!')
      } else {
        setError('No data found for this video')
      }
    } catch (err) {
      setError('Failed to fetch video data. Please try again.')
    }

    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVideoData()
  }

  const handleReset = () => {
    setVideoUrl('')
    setVideoData(null)
    setError('')
    setCopied(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success('Tags copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const downloadTags = () => {
    if (!videoData) return
    const tagText = videoData.tags.join('\n')
    const blob = new Blob([tagText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'youtube_tags.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Tags downloaded!')
  }

  return (
    <ToolLayout
      title="YouTube Keyword Tag Extractor"
      description="Extract keyword tags from any YouTube video"
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

        {videoData && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Extracted Video Data</h2>
            <div className="bg-gray-700 rounded-lg p-4 shadow-md mb-6">
              <img src={videoData.thumbnail} alt="Video Thumbnail" className="w-full rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Keyword Tags</h3>
              <p className="text-white mb-3">
                {videoData.tags.length > 0 ? videoData.tags.join(', ') : 'No tags found'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={downloadTags}
                  className="bg-green-500 hover:bg-green-600 text-white flex-1"
                >
                  <Download className="mr-2" size={16} />
                  Download Tags
                </Button>
                <Button
                  onClick={() => copyToClipboard(videoData.tags.join(', '))}
                  className="bg-purple-500 hover:bg-purple-600 text-white flex-1"
                >
                  {copied ? (
                    <Check className="mr-2" size={16} />
                  ) : (
                    <Clipboard className="mr-2" size={16} />
                  )}
                  {copied ? 'Copied!' : 'Copy Tags'}
                </Button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Video Title</h3>
            <p className="text-gray-300 mb-4">{videoData.title}</p>
            <h3 className="text-xl font-bold text-white mb-2">Video Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{videoData.description}</p>
          </div>
        )}

        {!videoData && !error && (
          <div className="text-center text-gray-400 py-12">
            <Tag size={48} className="mx-auto mb-4" />
            <p>Enter a YouTube video URL to extract keyword tags</p>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About YouTube Keyword Tag Extractor
        </h2>
        <p className="text-gray-300 mb-4">
          Our YouTube Keyword Tag Extractor is a powerful tool designed to help you easily extract keyword tags from any YouTube video. This tool is perfect for content creators, marketers, and researchers who want to analyze and utilize the tags used in YouTube videos to improve their own content strategy.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Instantly extract keyword tags from any YouTube video by entering the video URL.</li>
          <li>View the video thumbnail along with extracted tags.</li>
          <li>Display the video title and description for comprehensive analysis.</li>
          <li>Copy extracted tags to clipboard with a single click.</li>
          <li>Download tags as a text file for easy sharing and analysis.</li>
          <li>Clean and user-friendly interface for a smooth experience.</li>
          <li>No login required - use the tool directly in your browser.</li>
          <li>Compatible with all devices and browsers.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use YouTube Keyword Tag Extractor
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Copy the URL of the YouTube video you want to analyze.</li>
          <li>Paste the URL into the input field of the YouTube Keyword Tag Extractor.</li>
          <li>Click the "Extract" button to fetch the tags and video information.</li>
          <li>View the extracted tags, video thumbnail, title, and description.</li>
          <li>Copy the tags to your clipboard or download them as a text file.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use the extracted tags to improve your own video's discoverability on YouTube.</li>
          <li>Analyze popular videos in your niche to identify commonly used tags.</li>
          <li>Compare tags across multiple videos to find trending keywords in your industry.</li>
          <li>Use the downloaded tag list to create a database of relevant keywords for your content.</li>
          <li>Combine the tag extractor with other SEO tools to optimize your YouTube strategy.</li>
          <li>Study the relationship between tags, titles, and descriptions to understand effective metadata practices.</li>
          <li>Remember to use tags relevantly and avoid keyword stuffing in your own content.</li>
        </ul>
      </div>
    </ToolLayout>
  )
}