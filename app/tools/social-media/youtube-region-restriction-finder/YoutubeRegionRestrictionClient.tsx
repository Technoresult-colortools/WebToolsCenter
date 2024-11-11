'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, RefreshCw, AlertCircle, Globe, Info, Lightbulb, BookOpen, Check, X, Clock, Share2, History } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
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

const regions = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' }
]

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
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=AIzaSyA0PxWAlxu6KE9o9bkn1K5mjlbtBFiSmes`
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
      const checkPromises = regions.map(async (region) => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&regionCode=${region.code}&key=AIzaSyA0PxWAlxu6KE9o9bkn1K5mjlbtBFiSmes`
          )
          const data = await response.json()
          availabilityData[region.code] = {
            available: data.items && data.items.length > 0,
            lastChecked: new Date().toISOString()
          }
        } catch (err) {
          availabilityData[region.code] = {
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

  return (
    <ToolLayout
      title="YouTube Region Restriction Finder"
      description="Check the availability of a YouTube video across different regions"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
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
                    <p>Check video availability in {regions.length} regions</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Region Availability</CardTitle>
                <CardDescription>Check marks indicate where the video is available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {regions.map((region) => (
                    <TooltipProvider key={region.code}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 text-black dark:bg-gray-800">
                            <span>{region.flag}</span>
                            {availability[region.code]?.available ? (
                              <Check className="text-green-500" size={20} />
                            ) : (
                              <X className="text-red-500" size={20} />
                            )}
                            <span>{region.name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Last checked: {new Date(availability[region.code]?.lastChecked).toLocaleString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                <CardTitle className="flex items-center">
                  <History className="mr-2" size={20} />
                  Recent Searches
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

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About YouTube Region Restriction Finder
        </h2>
        <p className="text-gray-300 mb-4">
          Our YouTube Region Restriction Finder is a powerful tool designed to help you check the availability of YouTube videos across different regions. This tool is perfect for content creators, marketers, and viewers who want to understand the global reach of a video or identify potential region restrictions.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Instantly check video availability across multiple regions by entering the video URL.</li>
          <li>View availability status for 10 major countries including the US, UK, Canada, Australia, Germany, France, Japan, India, Brazil, and Russia.</li>
          <li>Easy-to-understand visual representation of availability using checkmarks and crosses.</li>
          <li>Quick and efficient API-based checking process.</li>
          <li>Clean and user-friendly interface for a smooth experience.</li>
          <li>No login required - use the tool directly in your browser.</li>
          <li>Compatible with all devices and browsers.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use YouTube Region Restriction Finder
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Copy the URL of the YouTube video you want to check.</li>
          <li>Paste the URL into the input field of the YouTube Region Restriction Finder.</li>
          <li>Click the "Check Availability" button to start the process.</li>
          <li>View the availability status for each region in the results section.</li>
          <li>Use the "Reset" button to clear the results and check another video.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use this tool to ensure your content is available in your target markets.</li>
          <li>If you find your video is restricted in certain regions, consider reviewing your content for potential copyright issues or policy violations.</li>
          <li>For content creators, use this tool to verify the global reach of your videos after publishing.</li>
          <li>Marketers can use this tool to check competitor video availability across different regions.</li>
          <li>If you're experiencing issues viewing a video, use this tool to check if it's due to region restrictions.</li>
          <li>Remember that region restrictions can change over time, so it's worth rechecking videos periodically.</li>
          <li>Keep in mind that this tool checks a sample of major countries and may not represent all global restrictions.</li>
        </ul>
      </div>
    </ToolLayout>
  )
}