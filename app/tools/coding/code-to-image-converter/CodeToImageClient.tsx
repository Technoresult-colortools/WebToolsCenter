'use client'

import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { Download, Maximize2, X, Copy, RefreshCw, Info, BookOpen, Zap, Lightbulb } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as prismStyles from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toPng } from 'html-to-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Slider from "@/components/ui/Slider"
import Sidebar from '@/components/sidebarTools'

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
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'scala', label: 'Scala' },
  { value: 'haskell', label: 'Haskell' },
  { value: 'lua', label: 'Lua' },
  { value: 'dart', label: 'Dart' },
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
  { value: 'synthwave84', label: 'Synthwave 84' },
  { value: 'coldarkCold', label: 'Coldark Cold' },
  { value: 'nightOwl', label: 'Night Owl' },
  { value: 'materialLight', label: 'Material Light' },
  { value: 'nord', label: 'Nord' },
]

const gradients = [
  { value: 'sunset', label: 'Sunset', classes: 'from-orange-500 via-red-500 to-purple-500' },
  { value: 'ocean', label: 'Ocean', classes: 'from-blue-400 via-teal-500 to-indigo-500' },
  { value: 'forest', label: 'Forest', classes: 'from-green-400 via-lime-500 to-emerald-600' },
  { value: 'candy', label: 'Candy', classes: 'from-pink-400 via-purple-500 to-indigo-500' },
  { value: 'midnight', label: 'Midnight', classes: 'from-blue-900 via-purple-900 to-indigo-900' },
  { value: 'sunrise', label: 'Sunrise', classes: 'from-yellow-400 via-orange-500 to-red-500' },
  { value: 'coral', label: 'Coral', classes: 'from-pink-500 via-orange-400 to-yellow-400' },
  { value: 'lava', label: 'Lava', classes: 'from-red-600 via-orange-600 to-yellow-500' },
  { value: 'aurora', label: 'Aurora', classes: 'from-green-300 via-teal-400 to-blue-500' },
  { value: 'peach', label: 'Peach', classes: 'from-pink-300 via-rose-400 to-orange-400' },
]

const fontFamilies = [
  { value: 'monospace', label: 'Monospace' },
  { value: 'source-code-pro', label: 'Source Code Pro' },
  { value: 'fira-code', label: 'Fira Code' },
  { value: 'jetbrains-mono', label: 'JetBrains Mono' },
  { value: 'ubuntu-mono', label: 'Ubuntu Mono' },
  { value: 'inconsolata', label: 'Inconsolata' },
  { value: 'roboto-mono', label: 'Roboto Mono' },
  { value: 'anonymous-pro', label: 'Anonymous Pro' },
  { value: 'space-mono', label: 'Space Mono' },
  { value: 'ibm-plex-mono', label: 'IBM Plex Mono' },
  { value: 'cascadia-code', label: 'Cascadia Code' },
  { value: 'courier-prime', label: 'Courier Prime' },
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
  const [layout, setLayout] = useState('compact')
  const [watermark, setWatermark] = useState(false)
  const [watermarkText, setWatermarkText] = useState('Generated by Code to Image Converter')
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].value)
  const [fontSize, setFontSize] = useState(14)
  const [tabSize, setTabSize] = useState(2)
  const [shadow, setShadow] = useState(true)
  const [imageQuality, setImageQuality] = useState(1)
  const [padding, setPadding] = useState(16)
  
  const codeContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = useCallback(async () => {
    if (codeContainerRef.current) {
      try {
        const dataUrl = await toPng(codeContainerRef.current, {
          quality: 1,
          pixelRatio: imageQuality,
          skipAutoScale: true,
          style: {
            transform: 'scale(1)', // Ensure no scaling is applied
            transformOrigin: 'top left',
          },
        });
        
        const link = document.createElement('a');
        link.download = `${fileName.split('.')[0]}_code.png`;
        link.href = dataUrl;
        link.click();
        toast.success('Image exported successfully!');
      } catch (error) {
        console.error('Error exporting image:', error);
        toast.error('Failed to export image. Please try again.');
      }
    }
  }, [codeContainerRef, imageQuality, fileName]);

  const handleCopyToClipboard = useCallback(async () => {
    if (codeContainerRef.current) {
      try {
        const dataUrl = await toPng(codeContainerRef.current, {
          quality: 1,
          pixelRatio: imageQuality,
          skipAutoScale: true,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          },
        });
        
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast.success('Image copied to clipboard!');
      } catch (error) {
        console.error('Error copying image to clipboard:', error);
        toast.error('Failed to copy image to clipboard. Please try again.');
      }
    }
  }, [codeContainerRef, imageQuality]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getThemeStyle = (themeName: string) => {
    return (prismStyles as Record<string, { [key: string]: React.CSSProperties }>)[themeName] || prismStyles.atomDark;
  };

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

  const handleShuffleImage = () => {
    const randomId = Math.floor(Math.random() * 1000)
    const newImageUrl = `https://picsum.photos/seed/${randomId}/600/400`
    setBackgroundImage(newImageUrl)
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

  useEffect(() => {
    // Load fonts
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap',
      'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap',
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap',
      'https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap',
      'https://fonts.googleapis.com/css2?family=Inconsolata&display=swap',
      'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap',
      'https://fonts.googleapis.com/css2?family=Anonymous+Pro&display=swap',
      'https://fonts.googleapis.com/css2?family=Space+Mono&display=swap',
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap',
      'https://fonts.googleapis.com/css2?family=Cascadia+Code&display=swap',
      'https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap',
    ]

    fontLinks.forEach(link => {
      const linkElement = document.createElement('link')
      linkElement.href = link
      linkElement.rel = 'stylesheet'
      document.head.appendChild(linkElement)
    })
  }, [])

  const renderCodePreview = () => (
    <div
      ref={codeContainerRef}
      className={`overflow-hidden rounded-lg ${shadow ? 'shadow-lg' : ''} ${getBackgroundStyle()}`}
      style={{
        padding: `${padding}px`,
        ...(backgroundType === 'image' && backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}),
        ...(backgroundType === 'solid' ? { backgroundColor: solidColor } : {}),
      }}
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
        <div className="overflow-auto max-h-[400px]">
          <SyntaxHighlighter
            language={language}
            style={getThemeStyle(theme)}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`,
            }}
            codeTagProps={{
              style: {
                fontFamily: 'inherit',
                fontSize: 'inherit',
              },
            }}
            showLineNumbers
            wrapLines
            lineProps={{
              style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
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
      <div className='flex-grow flex'>
        <aside className="bg-gray-800">
          <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                Code to Image Converter
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Share code snippets in a visually appealing format.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="space-y-8">
              <div className="relative">
                {renderCodePreview()}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button onClick={toggleFullscreen} className="bg-blue-600 hover:bg-blue-700">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fullscreen Preview
                </Button>
                <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Image
                </Button>
                <Button onClick={handleCopyToClipboard} className="bg-purple-600 hover:bg-purple-700">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>

              <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="code" className="space-y-4">
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
                      <SelectContent className="w-full bg-gray-700 text-white border-gray-600 overflow-y-auto h-40">
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
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
                </TabsContent>
                <TabsContent value="style" className="space-y-4">
                  <div>
                    <Label htmlFor="theme" className="text-white mb-2 block">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme" className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-gray-700 text-white border-gray-600 overflow-y-auto h-40 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                        {themes.map((themeOption) => (
                          <SelectItem key={themeOption.value} value={themeOption.value}>
                            {themeOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                        <SelectContent className="w-full bg-gray-700 text-white border-gray-600 overflow-y-auto h-40 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                          {gradients.map((gradientOption) => (
                            <SelectItem key={gradientOption.value} value={gradientOption.value}>
                              {gradientOption.label}
                            </SelectItem>
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
                        className="w-full bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  )}
                  {backgroundType === 'image' && (
                    <div>
                      <Label htmlFor="backgroundImage" className="text-white mb-2 block">Background Image</Label>
                      <div className="flex gap-2">
                        <Input
                          id="backgroundImage"
                          type="file"
                          onChange={handleBackgroundImageUpload}
                          className="w-full bg-gray-700 text-white border-gray-600"
                        />
                        <Button onClick={handleShuffleImage} className="bg-blue-600 hover:bg-blue-700">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Random
                        </Button>
                      </div>
                      <Input
                        type="text"
                        placeholder="Or enter image URL"
                        onChange={handleBackgroundImageURL}
                        className="w-full mt-2 bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                  <div>
                    <Label htmlFor="layout" className="text-white mb-2 block">Layout</Label>
                    <Select value={layout} onValueChange={setLayout}>
                      <SelectTrigger id="layout" className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="wide">Wide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="watermark"
                      checked={watermark}
                      onCheckedChange={setWatermark}
                    />
                    <Label htmlFor="watermark" className="text-white">Show Watermark</Label>
                  </div>
                  {watermark && (
                    <>
                      <div>
                        <Label htmlFor="watermarkText" className="text-white mb-2 block">Watermark Text</Label>
                        <Input
                          id="watermarkText"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="watermarkPosition" className="text-white mb-2 block">Watermark Position</Label>
                        <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
                          <SelectTrigger id="watermarkPosition" className="w-full bg-gray-700 text-white border-gray-600">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="fontFamily" className="text-white mb-2 block">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="fontFamily" className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-gray-700 text-white border-gray-600 overflow-y-auto h-40 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                        {fontFamilies.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fontSize" className="text-white mb-2 block">Font Size</Label>
                    <Slider
                      id="fontSize"
                      min={8}
                      max={24}
                      step={1}
                      value={fontSize}
                      onChange={(value) => setFontSize(value)}
                      className="w-full"
                    />
                    <span className="text-white mt-1 block text-right">{fontSize}px</span>
                  </div>
                  <div>
                    <Label htmlFor="tabSize" className="text-white mb-2 block">Tab Size</Label>
                    <Slider
                      id="tabSize"
                      min={2}
                      max={8}
                      step={2}
                      value={tabSize}
                      onChange={(value) => setTabSize(value)}
                      className="w-full"
                    />
                    <span className="text-white mt-1 block text-right">{tabSize} spaces</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="shadow"
                      checked={shadow}
                      onCheckedChange={setShadow}
                    />
                    <Label htmlFor="shadow" className="text-white">Show Shadow</Label>
                  </div>
                  <div>
                    <Label htmlFor="imageQuality" className="text-white mb-2 block">Image Quality</Label>
                    <Slider
                      id="imageQuality"
                      min={1}
                      max={4}
                      step={1}
                      value={imageQuality}
                      onChange={(value) => setImageQuality(value)}
                      className="w-full"
                    />
                    <span className="text-white mt-1 block text-right">{imageQuality}x</span>
                  </div>
                  <div>
                    <Label htmlFor="padding" className="text-white mb-2 block">Padding</Label>
                    <Slider
                      id="padding"
                      min={0}
                      max={64}
                      step={4}
                      value={padding}
                      onChange={(value) => setPadding(value)}
                      className="w-full"
                    />
                    <span className="text-white mt-1 block text-right">{padding}px</span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Code to Image Converter
            </h2>
            <p className="text-gray-300 mb-4">
              The Code to Image Converter is a powerful tool designed for developers, programmers, and anyone who wants to share code snippets in a visually appealing format. This tool converts your code into customizable, high-quality images, making it perfect for documentation, presentations, social media posts, or any scenario where you need to showcase your code visually.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Code to Image Converter?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter or paste your code into the provided text area.</li>
              <li>Select the programming language for proper syntax highlighting.</li>
              <li>Customize the appearance using the available options (theme, background, font, etc.).</li>
              <li>Preview your code image in real-time as you make adjustments.</li>
              <li>Click the "Export Image" button to download your code as an image file.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Support for multiple programming languages with syntax highlighting.</li>
              <li>Customizable themes, backgrounds, and layouts for personalized code images.</li>
              <li>Real-time preview of the generated image.</li>
              <li>Adjustable font size, padding, and image quality settings.</li>
              <li>Option to add custom watermarks to your code images.</li>
              <li>Easy export and clipboard copy functionality for quick sharing.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use a theme that complements your code for better readability.</li>
              <li>Experiment with different backgrounds to make your code stand out.</li>
              <li>Adjust the font size and padding for optimal presentation, especially for longer code snippets.</li>
              <li>Utilize the watermark feature to add your name or website for attribution.</li>
              <li>Try different layouts (compact, square, or wide) to best fit your code structure.</li>
            </ul>
          </div>

        </main>
       </div> 
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