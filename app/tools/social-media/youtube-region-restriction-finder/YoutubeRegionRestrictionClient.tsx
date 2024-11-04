'use client'

import React, { useState, useRef } from 'react'
import { Search, RefreshCw, AlertCircle, Globe, Info, Lightbulb, BookOpen, Check, X } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'

interface RegionAvailability {
  [key: string]: boolean
}

const regions = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'RU', name: 'Russia' },
]

export default function YouTubeRegionRestrictionFinder() {
  const [videoUrl, setVideoUrl] = useState('')
  const [availability, setAvailability] = useState<RegionAvailability | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const checkAvailability = async () => {
    setError('')
    setAvailability(null)
    setLoading(true)

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setError('Invalid YouTube URL')
      setLoading(false)
      return
    }

    try {
      const availabilityData: RegionAvailability = {}
      for (const region of regions) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&regionCode=${region.code}&key=AIzaSyA0PxWAlxu6KE9o9bkn1K5mjlbtBFiSmes`
        )
        const data = await response.json()
        availabilityData[region.code] = data.items && data.items.length > 0
      }
      setAvailability(availabilityData)
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
    setError('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <ToolLayout
      title="YouTube Region Restriction Finder"
      description="Check the availability of a YouTube video across different regions"
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
              {loading ? 'Checking...' : 'Check Availability'}
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

        {availability && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Region Availability</h2>
            <div className="bg-gray-700 rounded-lg p-4 shadow-md mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {regions.map((region) => (
                  <div key={region.code} className="flex items-center space-x-2">
                    {availability[region.code] ? (
                      <Check className="text-green-500" size={20} />
                    ) : (
                      <X className="text-red-500" size={20} />
                    )}
                    <span className="text-white">{region.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!availability && !error && (
          <div className="text-center text-gray-400 py-12">
            <Globe size={48} className="mx-auto mb-4" />
            <p>Enter a YouTube video URL to check region availability</p>
          </div>
        )}
      </div>

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