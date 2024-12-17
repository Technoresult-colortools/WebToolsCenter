'use client'

import React, { useState, useRef } from 'react'
import { Search, Download, RefreshCw, Clipboard, Check, AlertCircle, Tag, Info, Lightbulb, BookOpen, Share2, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NextImage from 'next/image'

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
  duration: string
  definition: string
  caption: string
  licensedContent: boolean
  privacyStatus: string
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
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,status&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const { snippet, statistics, contentDetails, status } = data.items[0]
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
          channelId: snippet.channelId,
          duration: contentDetails.duration,
          definition: contentDetails.definition,
          caption: contentDetails.caption,
          licensedContent: contentDetails.licensedContent,
          privacyStatus: status.privacyStatus
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

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return '00:00'
    
    const hours = match[1] ? parseInt(match[1].slice(0, -1)) : 0
    const minutes = match[2] ? parseInt(match[2].slice(0, -1)) : 0
    const seconds = match[3] ? parseInt(match[3].slice(0, -1)) : 0
    
    const paddedMinutes = minutes.toString().padStart(2, '0')
    const paddedSeconds = seconds.toString().padStart(2, '0')
    
    return hours > 0 
      ? `${hours}:${paddedMinutes}:${paddedSeconds}`
      : `${paddedMinutes}:${paddedSeconds}`
  }

  return (
    <ToolLayout
      title="YouTube Metadata Extractor"
      description="Extract comprehensive metadata from any YouTube video"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardContent>
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
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info">
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
                        <p className="font-semibold">Duration:</p>
                        <p>{formatDuration(metadata.duration)}</p>
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
                      <div>
                        <p className="font-semibold">Definition:</p>
                        <p>{metadata.definition}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Caption:</p>
                        <p>{metadata.caption}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Licensed Content:</p>
                        <p>{metadata.licensedContent ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Privacy Status:</p>
                        <p>{metadata.privacyStatus}</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="tags">
                    <h3 className="text-xl font-bold text-white mb-2">Tags</h3>
                    <p className="text-white mb-3">
                      {metadata.tags.length > 0 ? metadata.tags.join(', ') : 'No tags found'}
                    </p>
                  </TabsContent>
                  <TabsContent value="description">
                    <h3 className="text-xl font-bold text-white mb-2">Description</h3>
                    <p className="text-white mb-4 whitespace-pre-wrap">{metadata.description}</p>
                  </TabsContent>
                </Tabs>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
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
                  <Button
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${extractVideoId(videoUrl)}`, '_blank')}
                    className="bg-red-500 hover:bg-red-600 text-white flex-1"
                  >
                    <ExternalLink className="mr-2" size={16} />
                    Open Video
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
        </CardContent>
      </Card>

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About YouTube Metadata Extractor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Our YouTube Metadata Extractor is a comprehensive tool designed to help you easily extract detailed metadata from any YouTube video. This tool is perfect for content creators, marketers, researchers, and data analysts who want to gain insights into YouTube videos and channels.
          </p>

          <div className="my-8">
          <NextImage 
            src="/Images/YoutubeMetadataPreview.png?height=400&width=600" 
            alt="Screenshot of the Code to Image Converter interface showing code input area and customization options" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Extract comprehensive metadata from any YouTube video by entering the video URL.</li>
            <li>View the video thumbnail along with extracted metadata.</li>
            <li>Display detailed video information including title, channel, publish date, duration, view count, like count, and comment count.</li>
            <li>Extract and display video tags and description.</li>
            <li>Show additional information such as video definition, caption availability, licensed content status, and privacy status.</li>
            <li>Copy all extracted metadata to clipboard with a single click.</li>
            <li>Download metadata as a JSON file for easy sharing and analysis.</li>
            <li>Open the original YouTube video directly from the tool.</li>
            <li>Clean and user-friendly interface with tabbed layout for better organization of information.</li>
            <li>No login required - use the tool directly in your browser.</li>
            <li>Compatible with all devices and browsers.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use YouTube Metadata Extractor?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Copy the URL of the YouTube video you want to analyze.</li>
            <li>Paste the URL into the input field of the YouTube Metadata Extractor.</li>
            <li>Click the "Extract" button to fetch the comprehensive metadata.</li>
            <li>View the extracted metadata in the tabbed interface:</li>
            <ul className="list-disc list-inside ml-6">
              <li>Info tab: View general video information and statistics.</li>
              <li>Tags tab: See all tags associated with the video.</li>
              <li>Description tab: Read the full video description.</li>
            </ul>
            <li>Use the action buttons to:</li>
            <ul className="list-disc list-inside ml-6">
              <li>Copy the metadata to your clipboard for quick sharing.</li>
              <li>Download the metadata as a JSON file for further analysis.</li>
              <li>Open the original YouTube video in a new tab.</li>
            </ul>
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
            <li>Pay attention to video duration, definition, and caption availability to understand their impact on video performance.</li>
            <li>Analyze the privacy status and licensed content information to understand content protection strategies.</li>
            <li>Use the tool to quickly gather information for video SEO optimization.</li>
            <li>Combine the metadata extractor with other analytics tools to create comprehensive YouTube performance reports.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Share2 className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Content Creation: Analyze successful videos to improve your own content strategy.</li>
            <li>Marketing Research: Gather insights on competitor videos and trending content.</li>
            <li>SEO Optimization: Use extracted tags and descriptions to improve your video's searchability.</li>
            <li>Academic Research: Collect data for studies on social media trends and online video consumption.</li>
            <li>Journalism: Quickly gather information about viral or newsworthy videos.</li>
            <li>Brand Monitoring: Track videos mentioning your brand or products.</li>
            <li>Influencer Marketing: Evaluate potential influencers based on their video performance and content.</li>
            <li>Educational Resources: Analyze educational content for curriculum development or learning platforms.</li>
            <li>Entertainment Industry: Research audience preferences and trending topics in video content.</li>
            <li>Data Analysis: Use the JSON output for large-scale data analysis and visualization projects.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The YouTube Metadata Extractor is a powerful tool that opens up a world of possibilities for understanding and leveraging YouTube content. Whether you're a content creator, marketer, researcher, or just curious about video metrics, this tool provides valuable insights at your fingertips. Start exploring the wealth of information hidden in YouTube videos today!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}