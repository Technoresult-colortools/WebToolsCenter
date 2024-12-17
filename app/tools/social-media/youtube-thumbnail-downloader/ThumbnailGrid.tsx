'use client'

import React, { useState } from 'react'
import { Download, Clipboard, Check } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { toast } from 'react-hot-toast'

interface ThumbnailQuality {
  url: string
  width: number
  height: number
}

interface ThumbnailGridProps {
  thumbnails: ThumbnailQuality[]
}

const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({ thumbnails }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [downloadFormat, setDownloadFormat] = useState<string>('jpg')

  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedIndex(index)
      toast.success('URL copied to clipboard!')
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  const downloadThumbnail = async (url: string, quality: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `youtube_thumbnail_${quality}.${downloadFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
      toast.success(`Thumbnail downloaded as ${downloadFormat.toUpperCase()}!`)
    } catch (error) {
      toast.error('Failed to download thumbnail')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Available Thumbnails</h2>
      <div className="mb-4">
        <Select value={downloadFormat} onValueChange={setDownloadFormat}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent className=' bg-gray-700 text-white border-gray-600'>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
                Download {downloadFormat.toUpperCase()}
              </Button>
              <Button
                onClick={() => copyToClipboard(thumb.url, index)}
                className="bg-purple-500 hover:bg-purple-600 text-white flex-1"
              >
                {copiedIndex === index ? (
                  <Check className="mr-2" size={16} />
                ) : (
                  <Clipboard className="mr-2" size={16} />
                )}
                {copiedIndex === index ? 'Copied!' : 'Copy URL'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ThumbnailGrid