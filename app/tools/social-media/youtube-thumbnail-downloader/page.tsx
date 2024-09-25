'use client'
import React, { useState, useRef } from 'react'
import { Search, Download, RefreshCw, Clipboard, Check, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">YouTube Thumbnail Downloader</h1>
        
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

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-6">
            <li>Enter a valid YouTube video URL in the input field.</li>
            <li>Click the "Fetch" button to retrieve available thumbnails.</li>
            <li>Once thumbnails are loaded, you can download them or copy their URLs.</li>
            <li>Use the "Reset" button to clear the input and start over.</li>
          </ol>

          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Supports multiple YouTube URL formats</li>
            <li>Fetches thumbnails in all available qualities</li>
            <li>Option to download thumbnails directly</li>
            <li>Copy thumbnail URLs to clipboard</li>
            <li>Responsive design for various screen sizes</li>
            <li>Error handling for invalid URLs or API issues</li>
            <li>Loading indicator during thumbnail fetching</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}