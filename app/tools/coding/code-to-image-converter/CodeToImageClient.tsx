'use client'

import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select } from '@/components/ui/select1';
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { Download, Maximize2, X, Copy, RefreshCw, Info, BookOpen, Lightbulb } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as prismStyles from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toPng, toJpeg, toSvg } from 'html-to-image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Slider from "@/components/ui/Slider"
import ToolLayout from '@/components/ToolLayout'
import NextImage from 'next/image'

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
type ExportFormat = 'png' | 'jpeg' | 'svg'

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
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [customWidth, setCustomWidth] = useState(800)
  const [customHeight, setCustomHeight] = useState(600)
  const [useCustomSize, setUseCustomSize] = useState(false)
  
  const codeContainerRef = useRef<HTMLDivElement>(null)



  const handleExport = useCallback(async () => {
    if (codeContainerRef.current) {
      try {
        let dataUrl: string;
        const options = {
          quality: 1,
          pixelRatio: imageQuality,
          skipAutoScale: true,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          },
          width: useCustomSize ? customWidth : undefined,
          height: useCustomSize ? customHeight : undefined,
        };

        switch (exportFormat) {
          case 'jpeg':
            dataUrl = await toJpeg(codeContainerRef.current, options);
            break;
          case 'svg':
            dataUrl = await toSvg(codeContainerRef.current, options);
            break;
          default:
            dataUrl = await toPng(codeContainerRef.current, options);
        }
        
        const link = document.createElement('a');
        link.download = `${fileName.split('.')[0]}_code.${exportFormat}`;
        link.href = dataUrl;
        link.click();
        toast.success('Image exported successfully!');
      } catch (error) {
        console.error('Error exporting image:', error);
        toast.error('Failed to export image. Please try again.');
      }
    }
  }, [codeContainerRef, imageQuality, fileName, exportFormat, useCustomSize, customWidth, customHeight]);

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
          width: useCustomSize ? customWidth : undefined,
          height: useCustomSize ? customHeight : undefined,
        });
        
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast.success('Image copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy image to clipboard. Please try again.');
      }
    }
  }, [codeContainerRef, imageQuality, useCustomSize, customWidth, customHeight]);

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
    <ToolLayout
      title="Code to Image Converter"
      description="Share code snippets in a visually appealing format"
    >
      <Toaster position="top-right" />
  
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
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
                <Select
                  label="Language"
                  options={languages}
                  selectedKey={language}
                  onSelectionChange={setLanguage}
                  placeholder="Select language"
                  className="w-full"

                />

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
                <Select
                  label="Theme"
                  options={themes}
                  selectedKey={theme}
                  onSelectionChange={setTheme}
                  placeholder="Select theme"
                  className="w-full "
                  
                />

              </div>
              <div>
                <Label htmlFor="backgroundType" className="text-white mb-2 block">Background Type</Label>
                <Select
                  label="Background Type"
                  options={[
                    { value: "none", label: "None" },
                    { value: "gradient", label: "Gradient" },
                    { value: "solid", label: "Solid Color" },
                    { value: "image", label: "Image" },
                  ]}
                  selectedKey={backgroundType}
                  onSelectionChange={(value) => setBackgroundType(value as BackgroundType)}
                  placeholder="Select background type"
                  className="w-full "

                />

              </div>
              {backgroundType === 'gradient' && (
                <div>
                  <Label htmlFor="gradient" className="text-white mb-2 block">Gradient</Label>
                  <Select
                    label="Gradient"
                    options={gradients.map((gradientOption) => ({
                      value: gradientOption.value,
                      label: gradientOption.label,
                    }))}
                    selectedKey={gradient}
                    onSelectionChange={setGradient}
                    placeholder="Select gradient"
                    className="w-full "
                  
                  />

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
                <Select
                  label="Layout"
                  options={[
                    { value: "compact", label: "Compact" },
                    { value: "square", label: "Square" },
                    { value: "wide", label: "Wide" },
                  ]}
                  selectedKey={layout}
                  onSelectionChange={setLayout}
                  placeholder="Select layout"
                  className="w-full "

                />

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
                    <Select
                      label="Watermark Position"
                      options={[
                        { value: "top-left", label: "Top Left" },
                        { value: "top-right", label: "Top Right" },
                        { value: "bottom-left", label: "Bottom Left" },
                        { value: "bottom-right", label: "Bottom Right" },
                      ]}
                      selectedKey={watermarkPosition}
                      onSelectionChange={setWatermarkPosition}
                      placeholder="Select position"
                      className="w-full "

                    />

                  </div>
                </>
              )}
              <div>
                <Label htmlFor="fontFamily" className="text-white mb-2 block">Font Family</Label>
                <Select
                  label="Font Family"
                  options={fontFamilies.map((font) => ({
                    value: font.value,
                    label: font.label,
                  }))}
                  selectedKey={fontFamily}
                  onSelectionChange={setFontFamily}
                  placeholder="Select font family"
                  className="w-full "
                  
                />

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
            <TabsContent value="export" className="space-y-4">
              <div>
                <Label htmlFor="exportFormat" className="text-white mb-2 block">Export Format</Label>
                <Select
                  label="Export Format"
                  options={[
                    { value: 'png', label: 'PNG' },
                    { value: 'jpeg', label: 'JPEG' },
                    { value: 'svg', label: 'SVG' },
                  ]}
                  selectedKey={exportFormat}
                  onSelectionChange={(value) => setExportFormat(value as ExportFormat)}
                  placeholder="Select export format"
                  className="w-full "

                />

              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="useCustomSize"
                  checked={useCustomSize}
                  onCheckedChange={setUseCustomSize}
                />
                <Label htmlFor="useCustomSize" className="text-white">Use Custom Size</Label>
              </div>
              {useCustomSize && (
                <>
                  <div>
                    <Label htmlFor="customWidth" className="text-white mb-2 block">Custom Width (px)</Label>
                    <Input
                      id="customWidth"
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      className="w-full bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customHeight" className="text-white mb-2 block">Custom Height (px)</Label>
                    <Input
                      id="customHeight"
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      className="w-full bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </>
              )}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
  
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Code to Image Converter?
        </h2>
        <p className="text-gray-300 mb-4">
          The Code to Image Converter is a powerful tool designed to transform your code snippets into visually appealing and shareable images. It's perfect for developers, programmers, and educators who want to showcase their code in a more engaging and professional manner.
        </p>
        <p className="text-gray-300 mb-4">
          Whether you're creating tutorials, sharing on social media, or enhancing your documentation, our Code to Image Converter provides you with a range of customization options to make your code stand out.
        </p>
  
        <div className="my-8">
          <NextImage 
            src="/Images/CodeToImagePreview.png?height=400&width=600" 
            alt="Screenshot of the Code to Image Converter interface showing code input area and customization options" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>
  
        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Code to Image Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter or paste your code into the provided text area.</li>
          <li>Select the programming language for proper syntax highlighting.</li>
          <li>Choose a theme that complements your code and preferences.</li>
          <li>Customize the background, layout, and other styling options as desired.</li>
          <li>Adjust export settings such as image format, size, and quality.</li>
          <li>Preview your code image in real-time as you make adjustments.</li>
          <li>Click the "Export Image" button to download your code as an image file.</li>
          <li>Alternatively, use the "Copy to Clipboard" feature for quick sharing.</li>
        </ol>
  
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Support for multiple programming languages with syntax highlighting</li>
          <li>Wide range of themes to suit different visual preferences</li>
          <li>Customizable backgrounds including gradients, solid colors, and images</li>
          <li>Adjustable layout options (compact, square, wide)</li>
          <li>Font customization including family, size, and tab size</li>
          <li>Optional watermark with customizable text and position</li>
          <li>Export in multiple formats (PNG, JPEG, SVG) with adjustable quality</li>
          <li>Custom size export for specific dimension requirements</li>
          <li>Real-time preview of the generated image</li>
          <li>Fullscreen preview mode for detailed inspection</li>
          <li>One-click copy to clipboard functionality</li>
        </ul>
  
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Social Media Sharing:</strong> Create eye-catching code snippets for platforms like Twitter, LinkedIn, or Instagram.</li>
          <li><strong>Documentation:</strong> Enhance your technical documentation with visually appealing code examples.</li>
          <li><strong>Tutorials and Courses:</strong> Produce clear, styled code images for educational content.</li>
          <li><strong>Blog Posts:</strong> Embed attractive code snippets in your programming-related articles.</li>
          <li><strong>Presentations:</strong> Include polished code examples in your slides or demos.</li>
          <li><strong>Code Reviews:</strong> Share specific parts of your code with colleagues in a visually pleasing format.</li>
          <li><strong>Portfolio Enhancement:</strong> Showcase your coding skills with beautifully formatted code samples.</li>
          <li><strong>Bug Reporting:</strong> Clearly illustrate code-related issues when submitting bug reports.</li>
        </ul>
  
        <p className="text-gray-300 mt-6">
          Ready to transform your code into stunning, shareable images? Start using our Code to Image Converter tool now and elevate the way you present your code. Whether you're a seasoned developer or just starting out, our tool provides the perfect balance of functionality and aesthetics. Try it out and see how it can enhance your code sharing experience and make your snippets stand out from the crowd!
        </p>
      </div>
  
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
    </ToolLayout>
  )
}