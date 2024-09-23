'use client'

import React, { useState, useRef, ChangeEvent } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { Download, Maximize2, Upload, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as prismStyles from 'react-syntax-highlighter/dist/esm/styles/prism'
import html2canvas from 'html2canvas'

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'swift', label: 'Swift' },
]

const themes = [
  { value: 'atomDark', label: 'Atom Dark' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'solarizedlight', label: 'Solarized Light' },
  { value: 'ghcolors', label: 'GitHub' },
  { value: 'vscDarkPlus', label: 'VS Code Dark+' },
  { value: 'okaidia', label: 'Okaidia' },
  { value: 'coy', label: 'Coy' },
  { value: 'funky', label: 'Funky' },
  { value: 'twilight', label: 'Twilight' },
  { value: 'tomorrow', label: 'Tomorrow' },
]

const gradients = [
  { value: 'sunset', label: 'Sunset', classes: 'from-orange-500 via-red-500 to-purple-500' },
  { value: 'ocean', label: 'Ocean', classes: 'from-blue-400 via-teal-500 to-indigo-500' },
  { value: 'forest', label: 'Forest', classes: 'from-green-400 via-lime-500 to-emerald-600' },
  { value: 'candy', label: 'Candy', classes: 'from-pink-400 via-purple-500 to-indigo-500' },
  { value: 'midnight', label: 'Midnight', classes: 'from-blue-900 via-purple-900 to-indigo-900' },
]

type BackgroundType = 'none' | 'gradient' | 'solid' | 'image'

export default function CodeToImageConverter() {
  const [language, setLanguage] = useState(languages[0].value)
  const [theme, setTheme] = useState(themes[0].value)
  const [fileName, setFileName] = useState('example.js')
  const [code, setCode] = useState('// Write your code here\nfunction greet() {\n  console.log("Hello, World!");\n}\n\ngreet();')
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('gradient')
  const [gradient, setGradient] = useState(gradients[0].value)
  const [solidColor, setSolidColor] = useState('#ffffff')
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [layout, setLayout] = useState('wide')
  const [watermark, setWatermark] = useState(false)
  const [watermarkText, setWatermarkText] = useState('Generated by Code to Image Converter')
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const codeContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    if (codeContainerRef.current) {
      try {
        const canvas = await html2canvas(codeContainerRef.current)
        const image = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = image
        link.download = `${fileName.split('.')[0]}_code.png`
        link.click()
        toast.success('Image exported successfully!')
      } catch (error) {
        console.error('Error exporting image:', error)
        toast.error('Failed to export image. Please try again.')
      }
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getThemeStyle = (themeName: string) => {
    return (prismStyles as Record<string, any>)[themeName] || prismStyles.atomDark
  }

  const handleBackgroundImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string)
        setBackgroundType('image')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundImageURL = (event: ChangeEvent<HTMLInputElement>) => {
    setBackgroundImage(event.target.value)
    setBackgroundType('image')
  }

  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'gradient':
        return `bg-gradient-to-br ${gradients.find(g => g.value === gradient)?.classes}`
      case 'solid':
        return `bg-[${solidColor}]`
      case 'image':
        return `bg-cover bg-center`
      default:
        return 'bg-transparent'
    }
  }

  const getWatermarkPosition = () => {
    switch (watermarkPosition) {
      case 'top-left': return 'top-4 left-4'
      case 'top-right': return 'top-4 right-4'
      case 'bottom-left': return 'bottom-4 left-4'
      case 'bottom-right': return 'bottom-4 right-4'
      default: return 'bottom-4 right-4'
    }
  }

  const renderCodePreview = () => (
    <div
      ref={codeContainerRef}
      className={`overflow-hidden rounded-lg shadow-lg ${getBackgroundStyle()} p-8`}
      style={backgroundType === 'image' ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className={`bg-gray-800 rounded-lg overflow-hidden ${layout === 'compact' ? 'w-full' : layout === 'square' ? 'aspect-square' : 'w-full aspect-video'}`}>
        <div className="flex items-center justify-start px-4 py-2 bg-gray-700">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="ml-4 text-sm text-gray-400">{fileName}</span>
        </div>
        <SyntaxHighlighter
          language={language}
          style={getThemeStyle(theme)}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {watermark && (
        <div className={`absolute ${getWatermarkPosition()} text-white text-sm opacity-50`}>
          {watermarkText}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Code to Image Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="space-y-8">
            {/* Preview Section */}
            <div className="relative">
              {renderCodePreview()}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button onClick={toggleFullscreen} className="bg-blue-600 hover:bg-blue-700">
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen Preview
              </Button>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export Image
              </Button>
            </div>

            {/* Settings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code" className="text-white mb-2 block">Code</Label>
                  <textarea
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    placeholder="Enter your code here..."
                  />
                </div>
                <div>
                  <Label htmlFor="language" className="text-white mb-2 block">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theme" className="text-white mb-2 block">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme" className="w-full bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                      {themes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fileName" className="text-white mb-2 block">File Name</Label>
                  <Input
                    id="fileName"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backgroundType" className="text-white mb-2 block">Background Type</Label>
                  <Select value={backgroundType} onValueChange={(value) => setBackgroundType(value as BackgroundType)}>
                    <SelectTrigger id="backgroundType" className="w-full bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select background type" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="solid">Solid Color</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {backgroundType === 'gradient' && (
                  <div>
                    <Label htmlFor="gradient" className="text-white mb-2 block">Gradient</Label>
                    <Select value={gradient} onValueChange={setGradient}>
                      <SelectTrigger id="gradient" className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select gradient" />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                        {gradients.map((g) => (
                          <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {backgroundType === 'solid' && (
                  <div>
                    <Label htmlFor="solidColor" className="text-white mb-2 block">Solid Color</Label>
                    <Input
                      id="solidColor"
                      type="color"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="w-full h-10 bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                )}
                {backgroundType === 'image' && (
                  <div className="space-y-2">
                    <Label htmlFor="backgroundImageUpload" className="text-white mb-2 block">Background Image</Label>
                    <input
                      id="backgroundImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                    <Input
                      type="text"
                      placeholder="Or enter image URL"
                      onChange={handleBackgroundImageURL}
                      className="w-full bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="layout" className="text-white mb-2 block">Layout</Label>
                  <Select value={layout} onValueChange={setLayout}>
                    <SelectTrigger id="layout" className="w-full bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                      <SelectItem value="wide">Wide</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="watermark"
                      checked={watermark}
                      onCheckedChange={setWatermark}
                    />
                    <Label htmlFor="watermark" className="text-white">Add Watermark</Label>
                  </div>
                  {watermark && (
                    <>
                      <Input
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Watermark text"
                        className="w-full bg-gray-700 text-white border-gray-600"
                      />
                      <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
                        <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Watermark position" />
                        </SelectTrigger>
                        <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter or paste your code in the code input area.</li>
            <li>Customize your image settings:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Select the programming language for syntax highlighting.</li>
              <li>Choose a theme for the code display.</li>
              <li>Enter a file name for your code snippet.</li>
              <li>Select a background type (none, gradient, solid color, or image).</li>
              <li>Customize the layout (wide, compact, or square).</li>
              <li>Optionally add a watermark to the image and customize its text and position.</li>
            </ul>
            <li>Use the fullscreen preview to see how your image will look.</li>
            <li>Click the "Export Image" button to download your code as an image.</li>
          </ol>
        </div>
      </main>
      <Footer />

      {/* Fullscreen Preview Popup */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl">
            <Button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
            {renderCodePreview()}
          </div>
        </div>
      )}
    </div>
  )
}