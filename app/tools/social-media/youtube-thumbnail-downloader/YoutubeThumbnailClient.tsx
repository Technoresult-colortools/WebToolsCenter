'use client'
import React, { useState, useRef } from 'react'
import { Search, Download, RefreshCw, Clipboard, Check, AlertCircle, Image as ImageIcon, Info, Lightbulb, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'

interface ThumbnailQuality {
  url: string
  width: number
  height: number
}

interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}


export default function YouTubeThumbnailDownloader() {
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnails, setThumbnails] = useState<ThumbnailQuality[]>([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const fetchThumbnails = async () => {
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
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyA0PxWAlxu6KE9o9bkn1K5mjlbtBFiSmes`
      )
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const thumbnailsData = data.items[0].snippet.thumbnails
        const thumbnailQualities: ThumbnailQuality[] = (Object.values(thumbnailsData) as YouTubeThumbnail[])
          .map((thumb) => ({
            url: thumb.url,
            width: thumb.width,
            height: thumb.height,
          }))
          .sort((a, b) => b.width - a.width)


        setThumbnails(thumbnailQualities)
        toast.success('Thumbnails fetched successfully!')
      } else {
        setError('No thumbnail found for this video')
      }
    } catch (err) {
      setError('Failed to fetch thumbnail. Please try again.')
    }

    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchThumbnails()
  }

  const handleReset = () => {
    setVideoUrl('')
    setThumbnails([])
    setError('')
    setCopied(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      toast.success('URL copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const downloadThumbnail = (url: string, quality: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `youtube_thumbnail_${quality}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Thumbnail downloaded!')
  }

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader"
      description="Download high-quality thumbnails from any YouTube video"
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
                  {loading ? 'Fetching...' : 'Fetch'}
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

            {thumbnails.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Available Thumbnails</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {thumbnails.map((thumb, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-md">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={thumb.url}
                          alt={`Thumbnail ${thumb.width}x${thumb.height}`}
                          className="object-cover w-full h-full rounded-md"
                        />
                      </div>
                      <p className="text-white mb-3">
                        Quality: {thumb.width}x{thumb.height}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => downloadThumbnail(thumb.url, `${thumb.width}x${thumb.height}`)}
                          className="bg-green-500 hover:bg-green-600 text-white flex-1"
                        >
                          <Download className="mr-2" size={16} />
                          Download
                        </Button>
                        <Button
                          onClick={() => copyToClipboard(thumb.url)}
                          className="bg-purple-500 hover:bg-purple-600 text-white flex-1"
                        >
                          {copied ? (
                            <Check className="mr-2" size={16} />
                          ) : (
                            <Clipboard className="mr-2" size={16} />
                          )}
                          {copied ? 'Copied!' : 'Copy URL'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <ImageIcon size={48} className="mx-auto mb-4" />
                <p>Enter a YouTube video URL to fetch thumbnails</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About YouTube Thumbnail Downloader
            </h2>
            <p className="text-gray-300 mb-4">
              Our YouTube Thumbnail Downloader is an easy-to-use tool designed to help you download high-quality thumbnails from any YouTube video. Whether you are a content creator, marketer, or just need the perfect thumbnail for your collection, this tool provides a fast and hassle-free solution.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Instantly download any YouTube thumbnail by simply entering the video URL.</li>
              <li>Support for various thumbnail resolutions (including HD).</li>
              <li>Clean and simple interface for a smooth user experience.</li>
              <li>Download options for different thumbnail sizes (default, medium, high, standard, and max resolution).</li>
              <li>No need for any account or login, download directly.</li>
              <li>Compatible with any browser and device (mobile, tablet, desktop).</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Youtube Thumbnail Downloader?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Copy the URL of the YouTube video whose thumbnail you want to download.</li>
              <li>Paste the URL into the YouTube Thumbnail Downloader input field.</li>
              <li>Click the "Download" button to fetch the thumbnail.</li>
              <li>Choose from the available thumbnail resolutions and click to download.</li>
              <li>Your thumbnail will be saved to your device automatically.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use higher resolution thumbnails for better quality when using them in your projects.</li>
              <li>If you need a smaller file size, download the medium or standard resolution thumbnails.</li>
              <li>Always check the thumbnail resolution to match your project requirements, especially for social media or blogs.</li>
              <li>Be sure to respect YouTube’s copyright guidelines when using downloaded thumbnails for public or commercial use.</li>
              <li>Use the tool to download thumbnails for video previews, playlists, or social media promotions.</li>
            </ul>
          </div>
  </ToolLayout>
  )
}