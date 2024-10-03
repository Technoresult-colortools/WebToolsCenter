'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input  from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, Link, RefreshCw, Trash2, BarChart } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Footer from '@/components/Footer';
import Header from '@/components/Header';

// Simulated API call for shortening the URL
const shortenURL = async (url: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
  return 'http://short.url/' + Math.random().toString(36).substr(2, 6)
}

interface ShortenedURL {
  original: string
  shortened: string
  clicks: number
}

export default function URLShortener() {
  const [url, setUrl] = useState('')
  const [shortenedURLs, setShortenedURLs] = useState<ShortenedURL[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedURLs = localStorage.getItem('shortenedURLs')
    if (savedURLs) {
      setShortenedURLs(JSON.parse(savedURLs))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('shortenedURLs', JSON.stringify(shortenedURLs))
  }, [shortenedURLs])

  const isValidURL = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleShorten = async () => {
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    if (!isValidURL(url)) {
      toast.error('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    try {
      const shortened = await shortenURL(url)
      setShortenedURLs(prev => [...prev, { original: url, shortened, clicks: 0 }])
      setUrl('')
      toast.success('URL shortened successfully!')
    } catch (error) {
      toast.error('Failed to shorten URL')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (shortened: string) => {
    navigator.clipboard.writeText(shortened)
    toast.success('Shortened URL copied to clipboard!')
  }

  const handleDelete = (shortened: string) => {
    setShortenedURLs(prev => prev.filter(item => item.shortened !== shortened))
    toast.success('URL deleted from history')
  }

  const handleClick = (shortened: string) => {
    setShortenedURLs(prev => prev.map(item => 
      item.shortened === shortened ? { ...item, clicks: item.clicks + 1 } : item
    ))
    window.open(shortened, '_blank')
  }

  const handleClearAll = () => {
    setShortenedURLs([])
    toast.success('All URLs cleared from history')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">URL Shortener</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <Label htmlFor="url" className="text-white mb-2 block">Enter URL to shorten</Label>
            <div className="flex space-x-2">
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Button onClick={handleShorten} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                {isLoading ? <RefreshCw className="animate-spin" /> : 'Shorten'}
              </Button>
            </div>
          </div>

          {shortenedURLs.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Shortened URLs</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Original URL</TableHead>
                    <TableHead className="text-white">Shortened URL</TableHead>
                    <TableHead className="text-white">Clicks</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shortenedURLs.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-gray-300 truncate max-w-xs">{item.original}</TableCell>
                      <TableCell className="text-blue-400">
                        <button onClick={() => handleClick(item.shortened)} className="hover:underline">
                          {item.shortened}
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-300">{item.clicks}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button onClick={() => handleCopy(item.shortened)} className="bg-green-500 hover:bg-green-600 p-2">
                            <Copy size={16} />
                          </Button>
                          <Button onClick={() => handleDelete(item.shortened)} className="bg-red-500 hover:bg-red-600 p-2">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={handleClearAll} className="mt-4 bg-red-500 hover:bg-red-600">
                Clear All
              </Button>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About URL Shortener</h2>
          <p className="text-gray-300 mb-4">
            Our URL Shortener is a powerful tool designed to create compact, easy-to-share links from long URLs. 
            It's perfect for social media posts, email campaigns, or any situation where you need to save space 
            or track link clicks.
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-4 mb-2">Key Features:</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li><Link className="inline-block mr-2" size={16} /> <strong>Instant Shortening:</strong> Create short URLs with just one click.</li>
            <li><Copy className="inline-block mr-2" size={16} /> <strong>Easy Copying:</strong> Copy shortened URLs to your clipboard instantly.</li>
            <li><BarChart className="inline-block mr-2" size={16} /> <strong>Click Tracking:</strong> Monitor how many times your shortened links are clicked.</li>
            <li><RefreshCw className="inline-block mr-2" size={16} /> <strong>History:</strong> Keep track of all your shortened URLs in one place.</li>
            <li><Trash2 className="inline-block mr-2" size={16} /> <strong>Management:</strong> Delete individual URLs or clear your entire history.</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-2">How to Use:</h3>
          <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
            <li>Enter the long URL you want to shorten in the input field.</li>
            <li>Click the "Shorten" button to generate a shortened URL.</li>
            <li>Your shortened URL will appear in the table below.</li>
            <li>Click the shortened URL to open it in a new tab (this will increase the click count).</li>
            <li>Use the copy button to quickly copy the shortened URL to your clipboard.</li>
            <li>Use the delete button to remove a specific URL from your history.</li>
            <li>Click "Clear All" to remove all URLs from your history.</li>
          </ol>

          <h3 className="text-xl font-semibold text-white mb-2">Tips and Tricks:</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Use shortened URLs in social media posts to save character space and make your links look cleaner.</li>
            <li>Monitor the click count to gauge the popularity of your shared links.</li>
            <li>Regularly clear your history to keep your URL list manageable.</li>
            <li>For important links, consider copying the shortened URL to a secure location as a backup.</li>
            <li>Use URL shortening for tracking clicks on links in email campaigns or marketing materials.</li>
            <li>Remember that anyone with the shortened URL can access the original link, so avoid shortening sensitive or private URLs.</li>
            <li>If you're sharing links verbally, shortened URLs are easier to communicate.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}