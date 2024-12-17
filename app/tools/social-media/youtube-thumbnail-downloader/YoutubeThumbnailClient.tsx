'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, RefreshCw, AlertCircle, ImageIcon, Clock, Info, Lightbulb, BookOpen, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ThumbnailGrid from './ThumbnailGrid'
import { extractVideoId, fetchThumbnails } from './YoutubeUtils'

interface ThumbnailQuality {
  url: string
  width: number
  height: number
}

export default function YouTubeThumbnailDownloader() {
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnails, setThumbnails] = useState<ThumbnailQuality[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const history = localStorage.getItem('thumbnailSearchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setThumbnails([])
    setLoading(true)

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setError('Invalid YouTube URL')
      setLoading(false)
      return
    }

    try {
      const thumbnailData = await fetchThumbnails(videoId)
      setThumbnails(thumbnailData)
      updateSearchHistory(videoUrl)
      toast.success('Thumbnails fetched successfully!')
    } catch (err) {
      setError('Failed to fetch thumbnails. Please try again.')
    }

    setLoading(false)
  }

  const updateSearchHistory = (url: string) => {
    const newHistory = [url, ...searchHistory.slice(0, 9)]
    setSearchHistory(newHistory)
    localStorage.setItem('thumbnailSearchHistory', JSON.stringify(newHistory))
  }

  const handleReset = () => {
    setVideoUrl('')
    setThumbnails([])
    setError('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('thumbnailSearchHistory')
    toast.success('Search history cleared!')
  }

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader"
      description="Download high-quality thumbnails from any YouTube video"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-6xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>YouTube Thumbnail Downloader</CardTitle>
          <CardDescription>Enter a YouTube video URL to fetch and download thumbnails</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                ref={inputRef}
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter YouTube video URL"
                className="flex-grow text-black"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                      {loading ? 'Fetching...' : 'Fetch Thumbnails'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fetch thumbnails from the YouTube video</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

          {thumbnails.length > 0 ? (
            <ThumbnailGrid thumbnails={thumbnails} />
          ) : (
            <div className="text-center text-gray-400 py-12">
              <ImageIcon size={48} className="mx-auto mb-4" />
              <p>Enter a YouTube video URL to fetch thumbnails</p>
            </div>
          )}

          {searchHistory.length > 0 && (
            <Card className="mt-6 bg-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Clock className="mr-2" size={20} />
                    Recent Searches
                  </div>
                  <Button
                    onClick={clearSearchHistory}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    Clear History
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {searchHistory.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setVideoUrl(url)}
                      className="w-full text-left p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-300"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>

      </Card>
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About YouTube Thumbnail Downloader
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300">
        <p className="mb-4">
          Our YouTube Thumbnail Downloader is a powerful and user-friendly tool designed to help content creators, marketers, researchers, and YouTube enthusiasts easily access and download high-quality thumbnails from any YouTube video. This versatile tool goes beyond simple thumbnail extraction, offering a range of features to enhance your YouTube-related projects and workflows.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/YoutubeThumbnailPreview.png?height=400&width=600" 
            alt="Screenshot of the Code to Image Converter interface showing code input area and customization options" 
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
          <li>Instant thumbnail extraction from any YouTube video URL</li>
          <li>Support for multiple thumbnail resolutions (including HD and max resolution)</li>
          <li>One-click download for easy saving of thumbnails</li>
          <li>Copy thumbnail URL functionality for quick sharing or embedding</li>
          <li>Preview of all available thumbnail qualities</li>
          <li>Recent search history for convenient access to previously fetched videos</li>
          <li>Clean and intuitive user interface</li>
          <li>Mobile-responsive design for on-the-go use</li>
          <li>No login required - use the tool directly in your browser</li>
          <li>Fast and efficient API-based thumbnail fetching</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          How to Use YouTube Thumbnail Downloader?
        </h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Copy the URL of the YouTube video whose thumbnail you want to download</li>
          <li>Paste the URL into the input field of the YouTube Thumbnail Downloader</li>
          <li>Click the "Fetch Thumbnails" button to retrieve available thumbnails</li>
          <li>Browse through the different thumbnail qualities displayed</li>
          <li>Click "Download" to save the desired thumbnail to your device</li>
          <li>Alternatively, use "Copy URL" to get the direct link to the thumbnail</li>
          <li>Use the recent search history for quick access to previously fetched videos</li>
        </ol>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Share2 className="w-5 h-5 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Content Creation: Use high-quality thumbnails as templates or inspiration for your own video thumbnails</li>
          <li>Marketing: Analyze successful video thumbnails in your niche to improve your own thumbnail strategy</li>
          <li>Social Media: Easily share eye-catching video previews on various social platforms</li>
          <li>Blogging: Enhance your blog posts with relevant YouTube video thumbnails</li>
          <li>Research: Collect and analyze thumbnail trends for YouTube-related studies</li>
          <li>Education: Use thumbnails in presentations or educational materials</li>
          <li>Web Development: Quickly integrate YouTube video previews into websites</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Tips for Effective Use
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Always download the highest resolution thumbnail available for best quality</li>
          <li>Use the copy URL feature to quickly embed thumbnails in your projects</li>
          <li>Analyze thumbnails of popular videos in your niche for design inspiration</li>
          <li>Experiment with different thumbnail styles to see what works best for your audience</li>
          <li>Regularly update your thumbnails to keep your content fresh and engaging</li>
          <li>Use the search history feature to track changes in thumbnails over time</li>
          <li>Combine thumbnail analysis with other YouTube metrics for comprehensive content strategy</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Legal and Ethical Considerations
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Respect copyright laws when using downloaded thumbnails</li>
          <li>Always credit the original content creator when using thumbnails for reference or analysis</li>
          <li>Be aware of YouTube's terms of service regarding the use of their content</li>
          <li>Use thumbnails ethically and avoid misleading practices</li>
          <li>Consider seeking permission for commercial use of downloaded thumbnails</li>
        </ul>

        <p className="mt-6">
          By leveraging the YouTube Thumbnail Downloader, you can streamline your content creation process, enhance your marketing strategies, and gain valuable insights into successful YouTube practices. Whether you're a content creator looking to improve your thumbnail game, a marketer analyzing trends, or a researcher studying online video phenomena, this tool provides the functionality and ease of use you need to succeed in the dynamic world of YouTube content.
        </p>
      </CardContent>
    </Card>
    </ToolLayout>
  )
}

