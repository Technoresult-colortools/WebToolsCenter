'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Download, RefreshCw, AlertCircle, Tag, Info, Lightbulb, BookOpen, BarChart, Clock, MessageSquare, Share2 } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Tags from './Tags'

interface VideoData {
  tags: string[]
  title: string
  description: string
  thumbnail: string
  viewCount: string
  likeCount: string
  commentCount: string
  publishedAt: string
}

export default function YouTubeKeywordTagExtractor() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

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
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const item = data.items[0]
        const snippet = item.snippet
        const statistics = item.statistics
        const videoData: VideoData = {
          tags: snippet.tags || [],
          title: snippet.title,
          description: snippet.description,
          thumbnail: snippet.thumbnails.high.url,
          viewCount: statistics.viewCount,
          likeCount: statistics.likeCount,
          commentCount: statistics.commentCount,
          publishedAt: new Date(snippet.publishedAt).toLocaleDateString()
        }

        setVideoData(videoData)
        updateSearchHistory(videoUrl)
        toast.success('Video data extracted successfully!')
      } else {
        setError('No data found for this video')
      }
    } catch (err) {
      setError('Failed to fetch video data. Please try again.')
    }

    setLoading(false)
  }

  const updateSearchHistory = (url: string) => {
    const newHistory = [url, ...searchHistory.slice(0, 9)]
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVideoData()
  }

  const handleReset = () => {
    setVideoUrl('')
    setVideoData(null)
    setError('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
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

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
    toast.success('Search history cleared!')
  }

  return (
    <ToolLayout
      title="YouTube Keyword Tag Extractor"
      description="Extract keyword tags and metadata from any YouTube video"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-6xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Extract Video Metadata</CardTitle>
          <CardDescription>Enter a YouTube video URL to extract tags and other metadata</CardDescription>
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
                      {loading ? 'Extracting...' : 'Extract'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Extract metadata from the YouTube video</p>
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

          {videoData && (
            <Card className="bg-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">{videoData.title}</CardTitle>
                <CardDescription className="text-gray-300">Published on {videoData.publishedAt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <img src={videoData.thumbnail} alt="Video Thumbnail" className="w-full rounded-lg mb-4" />
                    <div className="flex justify-between text-sm text-gray-300">
                      <span className="flex items-center"><BarChart size={16} className="mr-1" /> {parseInt(videoData.viewCount).toLocaleString()} views</span>
                      <span className="flex items-center"><Lightbulb size={16} className="mr-1" /> {parseInt(videoData.likeCount).toLocaleString()} likes</span>
                      <span className="flex items-center"><MessageSquare size={16} className="mr-1" /> {parseInt(videoData.commentCount).toLocaleString()} comments</span>
                    </div>
                  </div>
                  <div>
                    <Tabs defaultValue="tags" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="tags">Tags</TabsTrigger>
                        <TabsTrigger value="description">Description</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tags">
                        <Tags tags={videoData.tags} />
                      </TabsContent>
                      <TabsContent value="description">
                        <div className="bg-gray-800 rounded-lg p-4 shadow-md mb-4 max-h-[300px] overflow-y-auto">
                          <h3 className="text-xl font-bold text-white mb-2">Video Description</h3>
                          <p className="text-gray-300 whitespace-pre-wrap">{videoData.description}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button
                        onClick={downloadTags}
                        className="bg-green-500 hover:bg-green-600 text-white flex-1"
                      >
                        <Download className="mr-2" size={16} />
                        Download Tags
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!videoData && !error && (
            <div className="text-center text-gray-400 py-12">
              <Tag size={48} className="mx-auto mb-4" />
              <p>Enter a YouTube video URL to extract keyword tags and metadata</p>
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
          About YouTube Keyword Tag Extractor
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300">
        <p className="mb-4">
          Our YouTube Keyword Tag Extractor is a comprehensive tool designed to help content creators, marketers, researchers, and YouTube enthusiasts extract and analyze valuable metadata from YouTube videos. This powerful tool goes beyond simple tag extraction, offering a comprehensive suite of features to enhance your understanding of video content and optimize your YouTube strategy.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/YoutubeKeywordTagsPreview.png?height=400&width=600" 
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
          <li>Keyword Tag Extraction: Instantly extract all tags associated with any YouTube video.</li>
          <li>Video Metadata Analysis: Gather crucial information such as view count, like count, comment count, and publish date.</li>
          <li>Visual Tag Cloud: Generate an interactive tag cloud for easy visualization of keyword prominence.</li>
          <li>Description Analysis: Access and analyze the full video description for additional context and keywords.</li>
          <li>Thumbnail Preview: View the high-quality thumbnail of the analyzed video.</li>
          <li>One-Click Copy and Download: Easily copy tags to clipboard or download them as a text file.</li>
          <li>Search History: Keep track of your recently analyzed videos for quick reference.</li>
          <li>User-Friendly Interface: Intuitive design with tabs for organized data presentation.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          How to Use YouTube Keyword Tag Extractor?
        </h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Enter the URL of the YouTube video you want to analyze in the input field.</li>
          <li>Click the "Extract" button to fetch the video's metadata and tags.</li>
          <li>Explore the extracted data in the tabbed interface:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Tags: View all associated tags and copy or download them.</li>
              <li>Description: Read the full video description.</li>
              <li>Tag Cloud: Visualize tag prominence in an interactive cloud.</li>
            </ul>
          </li>
          <li>Use the additional metadata (views, likes, comments) to gauge video performance.</li>
          <li>Leverage the search history feature for quick access to previously analyzed videos.</li>
        </ol>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Share2 className="w-5 h-5 mr-2" />
          Benefits and Applications
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Content Strategy: Analyze successful videos in your niche to identify trending tags and topics.</li>
          <li>SEO Optimization: Improve your video's searchability by using relevant, high-performing tags.</li>
          <li>Competitor Analysis: Study the tag strategies of top-performing channels in your industry.</li>
          <li>Trend Identification: Track changes in tag usage over time to spot emerging trends.</li>
          <li>Content Ideation: Use popular tags as inspiration for new video topics.</li>
          <li>Audience Research: Gain insights into what keywords resonate with your target audience.</li>
          <li>Marketing Campaigns: Align your video metadata with ongoing marketing initiatives.</li>
          <li>Educational Research: Study tagging patterns across different types of educational content.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Tips for Effective Use
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Regularly analyze top-performing videos in your niche to stay updated on trending tags.</li>
          <li>Compare tags across multiple videos to identify consistent high-performers.</li>
          <li>Use the tag cloud to quickly identify the most prominent keywords for a video.</li>
          <li>Don't just copy tags – use them as inspiration to create relevant, unique tag sets for your content.</li>
          <li>Analyze your own videos to refine your tagging strategy over time.</li>
          <li>Consider the relationship between tags, title, and description for comprehensive optimization.</li>
          <li>Use the search history feature to track changes in tag usage for specific videos over time.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Privacy and Ethical Use
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>This tool respects YouTube's terms of service and only accesses publicly available data.</li>
          <li>Always use extracted tags ethically and avoid misleading tag practices.</li>
          <li>Respect copyright and intellectual property rights when using insights gained from this tool.</li>
        </ul>

        <p className="mt-6">
          By leveraging the YouTube Keyword Tag Extractor, you can gain valuable insights into successful content strategies, optimize your own videos for better discoverability, and stay ahead of trends in your niche. Whether you're a content creator looking to grow your channel, a marketer aiming to improve video performance, or a researcher studying online video trends, this tool provides the data and analysis you need to succeed on YouTube.
        </p>
      </CardContent>
    </Card>
    </ToolLayout>
  )
}

