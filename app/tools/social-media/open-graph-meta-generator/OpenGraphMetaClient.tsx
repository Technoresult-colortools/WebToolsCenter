'use client'

import React, { useState } from 'react'
import { Copy, RefreshCw, Share2, Globe, Newspaper, Book, User, Music, Film, Tv, Radio, PlayCircle, FileText, Info, Lightbulb, BookOpen, Eye} from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'

const ogTypes = [
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'article', label: 'Article', icon: Newspaper },
  { value: 'book', label: 'Book', icon: Book },
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'music.song', label: 'Song', icon: Music },
  { value: 'music.album', label: 'Album', icon: Music },
  { value: 'music.playlist', label: 'Playlist', icon: Music },
  { value: 'music.radio_station', label: 'Radio Station', icon: Radio },
  { value: 'video.movie', label: 'Movie', icon: Film },
  { value: 'video.episode', label: 'Episode', icon: PlayCircle },
  { value: 'video.tv_show', label: 'TV Show', icon: Tv },
  { value: 'video.other', label: 'Other Video', icon: Film }
]

export default function OpenGraphGenerator() {
  const [type, setType] = useState('website')
  const [metadata, setMetadata] = useState({
    title: '',
    url: '',
    image: '',
    description: '',
    siteName: '',
    locale: 'en_US',
    determiner: 'auto',
    videoUrl: '',
    audioUrl: '',
    // Article specific
    author: '',
    publishedTime: '',
    modifiedTime: '',
    section: '',
    tags: '',
    // Book specific
    isbn: '',
    bookReleaseDate: '',
    bookAuthor: '',
    // Profile specific
    firstName: '',
    lastName: '',
    username: '',
    gender: '',
    // Music specific
    musicDuration: '',
    album: '',
    musician: '',
    // Video specific
    actors: '',
    director: '',
    writer: '',
    videoDuration: '',
    videoReleaseDate: '',
    series: ''
  })
  const [showOptional, setShowOptional] = useState(false)

  const handleChange = (name: string, value: string) => {
    setMetadata(prev => ({ ...prev, [name]: value }))
  }

  const generateMetaTags = () => {
    let tags = `<meta property="og:type" content="${type}" />\n`
    tags += `<meta property="og:title" content="${metadata.title}" />\n`
    tags += `<meta property="og:url" content="${metadata.url}" />\n`
    tags += `<meta property="og:image" content="${metadata.image}" />\n`
    
    if (metadata.description) {
      tags += `<meta property="og:description" content="${metadata.description}" />\n`
    }
    if (metadata.siteName) {
      tags += `<meta property="og:site_name" content="${metadata.siteName}" />\n`
    }
    if (metadata.locale) {
      tags += `<meta property="og:locale" content="${metadata.locale}" />\n`
    }
    if (metadata.determiner !== 'auto') {
      tags += `<meta property="og:determiner" content="${metadata.determiner}" />\n`
    }
    if (metadata.videoUrl) {
      tags += `<meta property="og:video" content="${metadata.videoUrl}" />\n`
    }
    if (metadata.audioUrl) {
      tags += `<meta property="og:audio" content="${metadata.audioUrl}" />\n`
    }

    // Type-specific meta tags
    switch (type) {
      case 'article':
        if (metadata.author) tags += `<meta property="article:author" content="${metadata.author}" />\n`
        if (metadata.publishedTime) tags += `<meta property="article:published_time" content="${metadata.publishedTime}" />\n`
        if (metadata.modifiedTime) tags += `<meta property="article:modified_time" content="${metadata.modifiedTime}" />\n`
        if (metadata.section) tags += `<meta property="article:section" content="${metadata.section}" />\n`
        if (metadata.tags) {
          metadata.tags.split(',').forEach(tag => {
            tags += `<meta property="article:tag" content="${tag.trim()}" />\n`
          })
        }
        break
      case 'book':
        if (metadata.isbn) tags += `<meta property="book:isbn" content="${metadata.isbn}" />\n`
        if (metadata.bookReleaseDate) tags += `<meta property="book:release_date" content="${metadata.bookReleaseDate}" />\n`
        if (metadata.bookAuthor) tags += `<meta property="book:author" content="${metadata.bookAuthor}" />\n`
        break
      case 'profile':
        if (metadata.firstName) tags += `<meta property="profile:first_name" content="${metadata.firstName}" />\n`
        if (metadata.lastName) tags += `<meta property="profile:last_name" content="${metadata.lastName}" />\n`
        if (metadata.username) tags += `<meta property="profile:username" content="${metadata.username}" />\n`
        if (metadata.gender) tags += `<meta property="profile:gender" content="${metadata.gender}" />\n`
        break
      case 'video.movie':
      case 'video.episode':
      case 'video.tv_show':
      case 'video.other':
        if (metadata.actors) tags += `<meta property="video:actor" content="${metadata.actors}" />\n`
        if (metadata.director) tags += `<meta property="video:director" content="${metadata.director}" />\n`
        if (metadata.videoDuration) tags += `<meta property="video:duration" content="${metadata.videoDuration}" />\n`
        if (metadata.videoReleaseDate) tags += `<meta property="video:release_date" content="${metadata.videoReleaseDate}" />\n`
        if (metadata.series) tags += `<meta property="video:series" content="${metadata.series}" />\n`
        break
      case 'music.song':
      case 'music.album':
      case 'music.playlist':
        if (metadata.musician) tags += `<meta property="music:musician" content="${metadata.musician}" />\n`
        if (metadata.musicDuration) tags += `<meta property="music:duration" content="${metadata.musicDuration}" />\n`
        if (metadata.album) tags += `<meta property="music:album" content="${metadata.album}" />\n`
        break
    }

    return tags
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMetaTags())
    toast.success('Meta tags copied to clipboard!')
  }

  const resetForm = () => {
    setMetadata({
      title: '',
      url: '',
      image: '',
      description: '',
      siteName: '',
      locale: 'en_US',
      determiner: 'auto',
      videoUrl: '',
      audioUrl: '',
      author: '',
      publishedTime: '',
      modifiedTime: '',
      section: '',
      tags: '',
      isbn: '',
      bookReleaseDate: '',
      bookAuthor: '',
      firstName: '',
      lastName: '',
      username: '',
      gender: '',
      musicDuration: '',
      album: '',
      musician: '',
      actors: '',
      director: '',
      writer: '',
      videoDuration: '',
      videoReleaseDate: '',
      series: ''
    })
    setType('website')
    toast.success('Form reset successfully!')
  }

  return (
    <ToolLayout
      title="Open Graph Meta Generator"
      description="Generate Open Graph meta tags for your website to control how your content appears when shared on social media"
    >
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-gray-800 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Share2 className="w-6 h-6" />
              Open Graph Meta Tags Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm text-gray-300">Content Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type" className="w-full bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {ogTypes.map(({ value, label, icon: Icon }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm text-gray-300">Title<span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={metadata.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm text-gray-300">URL<span className="text-red-500">*</span></Label>
                <Input
                  id="url"
                  value={metadata.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm text-gray-300">Image URL<span className="text-red-500">*</span></Label>
                <Input
                  id="image"
                  value={metadata.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-sm text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={metadata.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-white min-h-[80px]"
                  placeholder="Enter description"
                />
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="show-optional"
                  checked={showOptional}
                  onCheckedChange={setShowOptional}
                  className="data-[state=checked]:bg-blue-500"
                />
                <Label htmlFor="show-optional" className="text-sm text-gray-300 font-normal">
                  {showOptional ? 'Hide' : 'Show'} Optional Fields
                </Label>
              </div>

              {showOptional && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="text-sm text-gray-300">Site Name</Label>
                    <Input
                      id="siteName"
                      value={metadata.siteName}
                      onChange={(e) => handleChange('siteName', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                      placeholder="Your Site Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locale" className="text-sm text-gray-300">Locale</Label>
                    <Input
                      id="locale"
                      value={metadata.locale}
                      onChange={(e) => handleChange('locale', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                      placeholder="en_US"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="determiner" className="text-sm text-gray-300">Determiner</Label>
                    <Select value={metadata.determiner} onValueChange={(value) => handleChange('determiner', value)}>
                      <SelectTrigger id="determiner" className="w-full bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Auto" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="an">An</SelectItem>
                        <SelectItem value="the">The</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl" className="text-sm text-gray-300">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={metadata.videoUrl}
                      onChange={(e) => handleChange('videoUrl', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audioUrl" className="text-sm text-gray-300">Audio URL</Label>
                    <Input
                      id="audioUrl"
                      value={metadata.audioUrl}
                      onChange={(e) => handleChange('audioUrl', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                      placeholder="https://example.com/audio.mp3"
                    />
                  </div>
                </>
              )}

              {/* Conditional fields based on type */}
              {type === 'article' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm text-gray-300">Author</Label>
                    <Input
                      id="author"
                      value={metadata.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishedTime" className="text-sm text-gray-300">Published Time</Label>
                    <Input
                      id="publishedTime"
                      type="datetime-local"
                      value={metadata.publishedTime}
                      onChange={(e) => handleChange('publishedTime', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modifiedTime" className="text-sm text-gray-300">Modified Time</Label>
                    <Input
                      id="modifiedTime"
                      type="datetime-local"
                      value={metadata.modifiedTime}
                      onChange={(e) => handleChange('modifiedTime', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section" className="text-sm text-gray-300">Section</Label>
                    <Input
                      id="section"
                      value={metadata.section}
                      onChange={(e) => handleChange('section', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="tags" className="text-sm text-gray-300">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={metadata.tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </>
              )}

              {/* Add more conditional fields for other types */}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={resetForm} variant="destructive" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Copy className="w-4 h-4 mr-2" />
                Copy Meta Tags
              </Button>
            </div>

            <Alert className="bg-gray-700 border-gray-600">
              <AlertDescription className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {generateMetaTags()}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-600 rounded-lg p-4 space-y-4">
              {metadata.image && (
                <img
                  src={metadata.image}
                  alt="OG Preview"
                  className="w-full max-w-lg mx-auto rounded-lg"
                />
              )}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{metadata.title || 'Your Title Here'}</h3>
                <p className="text-gray-400 text-sm">{metadata.description || 'Your description will appear here'}</p>
                <p className="text-gray-500 text-xs">{metadata.url || 'https://example.com'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About section */}
        <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Open Graph Meta Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              The Open Graph Meta Generator is a powerful tool designed to help you create accurate and comprehensive Open Graph meta tags for your web content. These meta tags control how your content appears when shared on social media platforms, ensuring your links look great and attract more clicks.
            </p>

            <div className="my-8">
              <Image 
                src="/Images/OpenGraphMetaPreview.png?height=400&width=600" 
                alt="Screenshot of the Open Graph Meta Generator interface showing input fields and preview" 
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
              <li>Support for various content types including websites, articles, books, profiles, music, and videos.</li>
              <li>Easy-to-use interface for inputting essential Open Graph properties.</li>
              <li>Optional fields for more detailed meta tags.</li>
              <li>Real-time preview of how your content will appear when shared.</li>
              <li>One-click copying of generated meta tags.</li>
              <li>Responsive design for use on any device.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Open Graph Meta Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Select the content type that best matches your page from the dropdown menu.</li>
              <li>Fill in the required fields: Title, URL, and Image URL. These are marked with a red asterisk (*).</li>
              <li>Add a description to provide context for your shared content.</li>
              <li>Toggle the "Show Optional Fields" switch to access additional properties like Site Name, Locale, Determiner, Video URL, and Audio URL.</li>
              <li>Fill in any relevant optional fields based on your content type. For example, if you selected "Article", you'll see fields for Author, Published Time, Modified Time, Section, and Tags.</li>
              <li>As you fill in the fields, watch the preview update in real-time to see how your content will appear when shared.</li>
              <li>Review the generated meta tags in the code box below the form.</li>
              <li>Click the "Copy Meta Tags" button to copy the generated tags to your clipboard.</li>
              <li>Paste the meta tags into the &lt;head&gt; section of your HTML document.</li>
              <li>Use the "Reset" button to clear all fields and start over if needed.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              Tips for Effective Open Graph Tags
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use high-quality, relevant images that are at least 1200x630 pixels for best results on most social platforms.</li>
              <li>Keep your title concise and compelling, ideally under 60 characters to prevent truncation.</li>
              <li>Write clear, informative descriptions that summarize your content in 2-4 sentences.</li>
              <li>Use the appropriate content type to ensure the most relevant meta tags are generated for your page.</li>
              <li>Include optional fields like site name and locale for more comprehensive tags and better representation of your content.</li>
              <li>For articles, books, and other types with specific fields, fill in as much information as possible for rich previews.</li>
              <li>Regularly update your Open Graph tags, especially for dynamic content or pages that change frequently.</li>
              <li>Test your tags using social media platform debugging tools (like the Facebook Sharing Debugger) to ensure they appear correctly.</li>
              <li>Remember that some platforms may have specific requirements or preferences for Open Graph tags, so research the platforms where you frequently share content.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Share2 className="w-6 h-6 mr-2" />
              Applications and Use Cases
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Social Media Marketing: Enhance the appearance of shared links on platforms like Facebook, Twitter, and LinkedIn.</li>
              <li>SEO Optimization: Improve click-through rates from social media platforms, indirectly boosting your SEO efforts.</li>
              <li>E-commerce: Create attractive product previews when sharing items on social media.</li>
              <li>Content Marketing: Ensure your blog posts and articles look professional and engaging when shared.</li>
              <li>Personal Branding: Customize how your personal website or portfolio appears in social media shares.</li>
              <li>Event Promotion: Create eye-catching previews for event pages to increase attendance.</li>
              <li>App Marketing: Improve the appearance of app store links when shared on social platforms.</li>
              <li>Video Content: Customize video previews for better engagement on social media.</li>
              <li>News and Media: Ensure news articles and media content are presented accurately and attractively when shared.</li>
              <li>Educational Resources: Improve the visibility and appeal of online courses or educational content.</li>
            </ul>

            <p className="text-gray-300 mt-6">
              The Open Graph Meta Generator is an essential tool for anyone looking to optimize their web content for social media sharing. By creating accurate and comprehensive Open Graph meta tags, you can significantly improve how your content appears across various platforms, leading to increased engagement and traffic. Start using this tool today to ensure your content stands out in the crowded social media landscape!
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}