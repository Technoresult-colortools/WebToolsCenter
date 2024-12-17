'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, RefreshCw, AlertCircle, Globe, Info, Lightbulb, BookOpen, Check, X, Share2, History, LockIcon, BarChart } from 'lucide-react'
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
import WorldMap from './WorldMap'
import CountryList from './CountryList'

interface RegionAvailability {
  [key: string]: {
    available: boolean;
    lastChecked: string;
  }
}

interface VideoDetails {
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  publishedAt: string;
}

// Import the full list of countries from a separate file
import { countries } from './countries'

export default function YouTubeRegionRestrictionFinder() {
  const [videoUrl, setVideoUrl] = useState('')
  const [availability, setAvailability] = useState<RegionAvailability | null>(null)
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
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

  const fetchVideoDetails = async (videoId: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )
      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0]
        return {
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          viewCount: parseInt(item.statistics.viewCount).toLocaleString(),
          publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString()
        }
      }
      return null
    } catch (err) {
      console.error('Error fetching video details:', err)
      return null
    }
  }

  const checkAvailability = async () => {
    setError('')
    setAvailability(null)
    setVideoDetails(null)
    setLoading(true)

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setError('Invalid YouTube URL')
      setLoading(false)
      return
    }

    try {
      // Fetch video details
      const details = await fetchVideoDetails(videoId)
      if (!details) {
        setError('Video not found or API error')
        setLoading(false)
        return
      }
      setVideoDetails(details)

      // Check region availability
      const availabilityData: RegionAvailability = {}
      const checkPromises = countries.map(async (country) => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&regionCode=${country.code}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
          )
          const data = await response.json()
          availabilityData[country.code] = {
            available: data.items && data.items.length > 0,
            lastChecked: new Date().toISOString()
          }
        } catch (err) {
          availabilityData[country.code] = {
            available: false,
            lastChecked: new Date().toISOString()
          }
        }
      })

      await Promise.all(checkPromises)
      setAvailability(availabilityData)
      
      // Update search history
      const newHistory = [videoUrl, ...searchHistory.slice(0, 9)]
      setSearchHistory(newHistory)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      
      toast.success('Region availability checked successfully!')
    } catch (err) {
      setError('Failed to check region availability. Please try again.')
    }

    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    checkAvailability()
  }

  const handleReset = () => {
    setVideoUrl('')
    setAvailability(null)
    setVideoDetails(null)
    setError('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleShare = () => {
    if (videoUrl) {
      navigator.clipboard.writeText(window.location.origin + '?video=' + encodeURIComponent(videoUrl))
      toast.success('Link copied to clipboard!')
    }
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
    toast.success('Search history cleared!')
  }

  return (
    <ToolLayout
      title="YouTube Region Restriction Finder"
      description="Check the availability of a YouTube video across different regions"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-6xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Check Video Availability</CardTitle>
          <CardDescription>Enter a YouTube video URL to check its regional availability</CardDescription>
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
                      {loading ? 'Checking...' : 'Check Availability'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Check video availability in {countries.length} regions</p>
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
              {videoUrl && (
                <Button
                  type="button"
                  onClick={handleShare}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Share2 className="mr-2" size={20} />
                  Share
                </Button>
              )}
            </div>
          </form>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-md mb-6 flex items-center">
              <AlertCircle className="mr-2 flex-shrink-0" size={20} />
              <span>{error}</span>
            </div>
          )}

          {videoDetails && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <img 
                    src={videoDetails.thumbnail} 
                    alt={videoDetails.title}
                    className="rounded-lg w-full md:w-48 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{videoDetails.title}</h3>
                    <p className="text-gray-500 mb-1">Channel: {videoDetails.channelTitle}</p>
                    <p className="text-gray-500 mb-1">Views: {videoDetails.viewCount}</p>
                    <p className="text-gray-500">Published: {videoDetails.publishedAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {availability && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>World Map Availability</CardTitle>
                  <CardDescription>Colored map showing video availability by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <WorldMap availability={availability} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detailed Country Availability</CardTitle>
                  <CardDescription>Comprehensive list of video availability by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <CountryList availability={availability} countries={countries} />
                </CardContent>
              </Card>
            </>
          )}

          {!availability && !error && (
            <div className="text-center text-gray-400 py-12">
              <Globe size={48} className="mx-auto mb-4" />
              <p>Enter a YouTube video URL to check region availability</p>
            </div>
          )}

          {searchHistory.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="mr-2" size={20} />
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
                      className="w-full text-left p-2 hover:bg-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
          About YouTube Region Restriction Finder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          Our YouTube Region Restriction Finder is a powerful and comprehensive tool designed to help content creators, marketers, researchers, and viewers understand the global availability of YouTube videos. This innovative tool allows you to check the accessibility of any YouTube video across numerous countries worldwide, providing valuable insights into content distribution and potential region restrictions.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/YoutubeMetadataPreview3.png?height=400&width=600" 
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
          <li>Check video availability across multiple regions by simply entering the video URL.</li>
          <li>Interactive world map visualization of video accessibility.</li>
          <li>Comprehensive list of all countries with their respective availability status.</li>
          <li>Detailed video information including title, channel, view count, and publish date.</li>
          <li>Color-coded availability status for easy interpretation (green for available, red for restricted).</li>
          <li>Search history feature for quick access to previously checked videos.</li>
          <li>Share functionality to easily distribute your findings.</li>
          <li>User-friendly interface with responsive design for all devices.</li>
          <li>No login required - use the tool directly in your browser.</li>
          <li>Fast and efficient API-based checking process.</li>
          <li>Compatible with all modern web browsers.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use YouTube Region Restriction Finder?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Copy the URL of the YouTube video you want to analyze.</li>
          <li>Paste the URL into the input field of the YouTube Region Restriction Finder.</li>
          <li>Click the "Check Availability" button to start the process.</li>
          <li>View the results in the interactive interface:</li>
          <ul className="list-disc list-inside ml-6">
            <li>World Map: See a visual representation of video availability.</li>
            <li>Country List: Check detailed availability status for each country.</li>
            <li>Video Details: View information about the checked video.</li>
          </ul>
          <li>Use the additional features:</li>
          <ul className="list-disc list-inside ml-6">
            <li>Reset: Clear the current results to check a new video.</li>
            <li>Share: Copy a link to your results for easy sharing.</li>
            <li>Recent Searches: Quickly access your previously checked videos.</li>
          </ul>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use the tool to ensure your content is available in your target markets before promoting it.</li>
          <li>Check competitor videos to understand their global reach and content strategy.</li>
          <li>If you find your video is restricted in certain regions, review your content for potential copyright issues or policy violations.</li>
          <li>Regularly recheck your videos, as region restrictions can change over time.</li>
          <li>Use the share feature to collaborate with team members or clients on content distribution strategies.</li>
          <li>Combine the region restriction data with other analytics to create comprehensive content performance reports.</li>
          <li>Pay attention to patterns in region restrictions to inform your future content creation and distribution strategies.</li>
          <li>Use the tool to troubleshoot viewer reports of inaccessible content in specific regions.</li>
          <li>Consider using a VPN in conjunction with this tool to verify results from different locations.</li>
          <li>Keep in mind that some restrictions may be temporary due to ongoing reviews or appeals.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Share2 className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><Globe className="inline-block w-4 h-4 mr-2" /> Global Content Strategy: Optimize your content distribution for international audiences.</li>
          <li><LockIcon className="inline-block w-4 h-4 mr-2" /> Copyright Compliance: Ensure your content adheres to regional copyright laws and licensing agreements.</li>
          <li><Search className="inline-block w-4 h-4 mr-2" /> Market Research: Analyze the global reach of viral videos or trending content.</li>
          <li><BarChart className="inline-block w-4 h-4 mr-2" /> Competitive Analysis: Compare your video availability with competitors in key markets.</li>
          <li><Globe className="inline-block w-4 h-4 mr-2" /> Localization Planning: Identify regions where your content is restricted to plan localized versions.</li>
          <li><LockIcon className="inline-block w-4 h-4 mr-2" /> Troubleshooting: Quickly identify and address region-specific playback issues.</li>
          <li><Search className="inline-block w-4 h-4 mr-2" /> Educational Research: Study the impact of region restrictions on the spread of educational content.</li>
          <li><BarChart className="inline-block w-4 h-4 mr-2" /> Marketing Campaigns: Ensure promotional videos are accessible in target markets before launching campaigns.</li>
          <li><Globe className="inline-block w-4 h-4 mr-2" /> Content Acquisition: Evaluate the global availability of content before purchasing rights or partnering with creators.</li>
          <li><LockIcon className="inline-block w-4 h-4 mr-2" /> Policy Compliance: Verify that your content meets platform policies and guidelines across different regions.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          The YouTube Region Restriction Finder is an invaluable tool for anyone working with YouTube content on a global scale. It provides crucial insights into content availability, helping you make informed decisions about your video distribution strategy. Whether you're a content creator, marketer, researcher, or simply a curious viewer, this tool offers a window into the complex world of international content distribution on YouTube. Start exploring the global reach of YouTube videos today and unlock new opportunities for your content!
        </p>
      </CardContent>
    </Card>

      
    </ToolLayout>
  )
}

