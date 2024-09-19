// ./app/tools/social-media/youtube-thumbnail-downloader/page.tsx

'use client'

import React, { useState, useRef } from 'react'
import { Search, Download, RefreshCw, Clipboard, Check, AlertCircle, Image as ImageIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ThumbnailQuality {
  url: string
  width: number
  height: number
}

function YouTubeThumbnailDownloader() {
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
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyA0PxWAlxu6KE9o9bkn1K5mjlbtBFiSmes`)
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const thumbnailsData = data.items[0].snippet.thumbnails
        const thumbnailQualities: ThumbnailQuality[] = Object.values(thumbnailsData)
          .map((thumb: any) => ({
            url: thumb.url,
            width: thumb.width,
            height: thumb.height
          }))
          .sort((a, b) => b.width - a.width)

        setThumbnails(thumbnailQualities)
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
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">YouTube Thumbnail Downloader</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex items-center mb-4">
              <input
                ref={inputRef}
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter YouTube video URL"
                className="flex-grow px-4 py-2 rounded-l-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 transition duration-300 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="animate-spin mr-2" size={20} />
                ) : (
                  <Search className="mr-2" size={20} />
                )}
                {loading ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center mx-auto"
            >
              <RefreshCw className="mr-2" size={20} />
              Reset
            </button>
          </form>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-md mb-4 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              {error}
            </div>
          )}

          {thumbnails.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Available Thumbnails</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thumbnails.map((thumb, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <img
                      src={thumb.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-auto rounded-md mb-2"
                    />
                    <p className="text-white mb-2">
                      Quality: {thumb.width}x{thumb.height}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadThumbnail(thumb.url, `${thumb.width}x${thumb.height}`)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
                      >
                        <Download className="mr-2" size={16} />
                        Download
                      </button>
                      <button
                        onClick={() => copyToClipboard(thumb.url)}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300 flex items-center"
                      >
                        {copied ? (
                          <Check className="mr-2" size={16} />
                        ) : (
                          <Clipboard className="mr-2" size={16} />
                        )}
                        {copied ? 'Copied!' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!thumbnails.length && !error && (
            <div className="text-center text-gray-400 py-12">
              <ImageIcon size={48} className="mx-auto mb-4" />
              <p>Enter a YouTube video URL to fetch thumbnails</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About YouTube Thumbnail Downloader</h2>
              <p className="text-white">
                This advanced YouTube Thumbnail Downloader allows you to easily fetch and download thumbnails from YouTube videos in various qualities. 
                Simply paste the YouTube video URL, and the tool will retrieve all available thumbnail sizes for you to download or copy.
              </p>          
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
              <p className="text-white">
                1. Paste a valid YouTube video URL into the input field.<br />
                2. Click the "Fetch" button to retrieve available thumbnails.<br />
                3. Once thumbnails are loaded, you can download them or copy their URLs.<br />
                4. Use the "Reset" button to clear the input and start over.<br />
                5. The tool supports various YouTube URL formats, including shortened URLs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="list-disc list-inside text-white">
                <li>Supports multiple YouTube URL formats</li>
                <li>Fetches thumbnails in all available qualities</li>
                <li>Option to download thumbnails directly</li>
                <li>Copy thumbnail URLs to clipboard</li>
                <li>Responsive design for various screen sizes</li>
                <li>Error handling for invalid URLs or API issues</li>
                <li>Loading indicator during thumbnail fetching</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default YouTubeThumbnailDownloader