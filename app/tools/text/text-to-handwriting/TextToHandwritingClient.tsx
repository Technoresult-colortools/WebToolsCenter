'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import ToolLayout from '@/components/ToolLayout'
import { Label } from "@/components/ui/label"
import { Toaster, toast } from 'react-hot-toast'
import { Download, ChevronLeft, ChevronRight, RefreshCw, Info, BookOpen, Lightbulb } from 'lucide-react'
import { jsPDF } from 'jspdf'

// Standard US Letter size in pixels (at 96 DPI)
const PAGE_WIDTH = 816 // 8.5 inches
const PAGE_HEIGHT = 1056 // 11 inches
const MARGIN_LEFT = 72 // 0.75 inch margin


// Handwriting font families with their URLs
const HANDWRITING_FONTS = [
  { name: "MyHappyEnding", url: "URL_TO_FONT" },
  { name: "Xiomara", url: "URL_TO_FONT" },
  { name: "BiteChocolate", url: "URL_TO_FONT" },
  { name: "BitterRobusta", url: "URL_TO_FONT" },
  { name: "AlwaysInMyHeart", url: "URL_TO_FONT" },
  { name: "Lofty Goals", url: "URL_TO_FONT" },
  { name: "Caveat Tomatoes", url: "URL_TO_FONT" },
  { name: "Meddon", url: "https://fonts.googleapis.com/css2?family=Meddon&display=swap" },
  { name: "Permanent Marker", url: "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" },
  { name: "Handlee", url: "https://fonts.googleapis.com/css2?family=Handlee&display=swap" },
  { name: "Coming Soon", url: "https://fonts.googleapis.com/css2?family=Coming+Soon&display=swap" },
  { name: "Swanky and Moo Moo", url: "https://fonts.googleapis.com/css2?family=Swanky+and+Moo+Moo&display=swap" },
  { name: "Crafty Girls", url: "https://fonts.googleapis.com/css2?family=Crafty+Girls&display=swap" },
  { name: "Indie Flower", url: "https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" },
  { name: "Satisfy", url: "https://fonts.googleapis.com/css2?family=Satisfy&display=swap" },
  { name: "Schoolbell", url: "https://fonts.googleapis.com/css2?family=Schoolbell&display=swap" },
  { name: "Gloria Hallelujah", url: "https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap" },
  { name: "Homemade Apple", url: "https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap" },
  { name: "Cedarville Cursive", url: "https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap" }
]

const PAGE_BACKGROUNDS = {
  RULED: "/Images/Ruled.jpg",
  RULED1: "/Images/Ruled1.jpg",
  GRID: "/Images/Grid.jpg",
  BLANK: "/Images/Blank.jpg",
  OLDRUSTY: "/Images/OldRusty.jpg"
}

const INK_COLORS = {
  BLUE: "#000080",
  BLACK: "#000000",
  RED: "#880000",
  GREEN: "#005500",
  PURPLE: "#4B0082"
}

const PEN_TYPES = {
  BALLPOINT: "Ballpoint",
  FOUNTAIN: "Fountain",
  GEL: "Gel",
  MARKER: "Marker"
}

interface Page {
  text: string
  background: string
}

interface AppState {
  inputText: string
  selectedFont: string
  fontSize: number
  lineHeight: number
  letterSpacing: number
  horizontalOffset: number
  verticalOffset: number
  pageBackground: string
  inkColor: string
  penType: string
  pages: Page[]
  currentPage: number
  customBackground: string | null
}

const initialState: AppState = {
  inputText: '',
  selectedFont: HANDWRITING_FONTS[0].name,
  fontSize: 16,
  lineHeight: 2,
  letterSpacing: 0,
  horizontalOffset: 0,
  verticalOffset: 0,
  pageBackground: PAGE_BACKGROUNDS.RULED,
  inkColor: INK_COLORS.BLUE,
  penType: PEN_TYPES.BALLPOINT,
  pages: [{ text: '', background: PAGE_BACKGROUNDS.RULED }],
  currentPage: 0,
  customBackground: null
}

export default function TextToHandwriting() {
  const [state, setState] = useState<AppState>(initialState)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)

  // Load fonts
  useEffect(() => {
    HANDWRITING_FONTS.forEach(font => {
      const link = document.createElement('link')
      link.href = font.url
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    })
  }, [])

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext('2d')
      if (ctx.current) {
        // Enable text wrapping
        ctx.current.textAlign = 'left'
        ctx.current.textBaseline = 'top'
      }
    }
  }, [])

  const splitTextIntoPages = (text: string): string[] => {
    if (!ctx.current) return [text]

    const words = text.split(' ')
    let currentPage = ''
    let currentLine = ''
    let currentY = state.verticalOffset
    const pages: string[] = []
    const maxWidth = PAGE_WIDTH - (MARGIN_LEFT * 2)
    const maxHeight = PAGE_HEIGHT - 100 // Leave margin at bottom

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const metrics = ctx.current!.measureText(testLine)
      
      if (metrics.width > maxWidth && currentLine) {
        currentY += state.fontSize * state.lineHeight
        if (currentY > maxHeight) {
          pages.push(currentPage.trim())
          currentPage = word
          currentY = state.verticalOffset + (state.fontSize * state.lineHeight)
        } else {
          currentPage += currentLine + '\n'
          currentLine = word
        }
      } else {
        currentLine = testLine
      }
    })

    if (currentLine) {
      currentPage += currentLine
    }
    if (currentPage) {
      pages.push(currentPage.trim())
    }

    return pages
  }


  const renderPage = () => {
    if (!ctx.current || !canvasRef.current) return

    // Clear canvas
    ctx.current.clearRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT)

    // Draw background
    const img = new Image()
    img.onload = () => {
      ctx.current!.drawImage(img, 0, 0, PAGE_WIDTH, PAGE_HEIGHT)
      
      // Set up text rendering
      ctx.current!.font = `${state.fontSize}px "${state.selectedFont}", cursive`
      ctx.current!.fillStyle = state.inkColor

      // Apply pen type effect
      switch (state.penType) {
        case PEN_TYPES.FOUNTAIN:
          ctx.current!.lineWidth = 2
          ctx.current!.lineJoin = 'round'
          break
        case PEN_TYPES.GEL:
          ctx.current!.lineWidth = 1.5
          ctx.current!.lineCap = 'round'
          break
        case PEN_TYPES.MARKER:
          ctx.current!.lineWidth = 3
          ctx.current!.lineCap = 'square'
          break
        default:
          ctx.current!.lineWidth = 1
          ctx.current!.lineCap = 'butt'
      }

      // Render text with word wrap and letter spacing
      const pageText = state.pages[state.currentPage].text
      let currentY = state.verticalOffset
      const lines = pageText.split('\n')
      
      lines.forEach(line => {
        let currentX = MARGIN_LEFT + state.horizontalOffset
        for (let i = 0; i < line.length; i++) {
          ctx.current!.fillText(
            line[i],
            currentX,
            currentY
          )
          currentX += ctx.current!.measureText(line[i]).width + state.letterSpacing
        }
        currentY += state.fontSize * state.lineHeight
      })
    }
    img.src = state.customBackground || state.pages[state.currentPage].background
  }

  useEffect(() => {
    if (state.inputText) {
      const pageTexts = splitTextIntoPages(state.inputText)
      setState(prevState => ({
        ...prevState,
        pages: pageTexts.map(text => ({
          text,
          background: prevState.pageBackground
        }))
      }))
    }
  }, [state.inputText, state.fontSize, state.lineHeight, state.letterSpacing, state.horizontalOffset, state.pageBackground])

  useEffect(() => {
    const timer = setTimeout(() => {
      renderPage()
    }, 100)
    return () => clearTimeout(timer)
  }, [state])

  const handleDownload = (format: 'png' | 'pdf') => {
    if (!canvasRef.current) return

    if (format === 'png') {
      const link = document.createElement('a')
      link.download = `handwritten_page_${state.currentPage + 1}.png`
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    } else if (format === 'pdf') {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [PAGE_WIDTH, PAGE_HEIGHT]
      })

      state.pages.forEach((page, index) => {
        if (index > 0) pdf.addPage()
        const imgData = canvasRef.current!.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT)
      })

      pdf.save('handwritten_document.pdf')
    }
  }

  const handleBackgroundChange = (value: string) => {
    setState(prevState => ({
      ...prevState,
      pageBackground: value,
      pages: prevState.pages.map(page => ({ ...page, background: value })),
      customBackground: null
    }))
  }

  const handleCustomBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === 'string') {
          setState(prevState => ({ ...prevState, customBackground: result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReset = () => {
    setState(initialState)
    toast.success('All settings have been reset')
  }

  return (
    <ToolLayout
      title="Text to Handwriting Converter"
      description="Transform your text into handwritten notes with customizable styles"
    >
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <Textarea
              value={state.inputText}
              onChange={(e) => setState(prevState => ({ ...prevState, inputText: e.target.value }))}
              className="w-full h-40 bg-gray-800 text-white border-gray-700"
              placeholder="Enter your text here..."
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font Style</Label>
                <Select value={state.selectedFont} onValueChange={(value) => setState(prevState => ({ ...prevState, selectedFont: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 h-40 overflow-y-auto">
                    {HANDWRITING_FONTS.map(font => (
                      <SelectItem key={font.name} value={font.name}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Pen Type</Label>
                <Select value={state.penType} onValueChange={(value) => setState(prevState => ({ ...prevState, penType: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select pen type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800  border-gray-700">
                    {Object.entries(PEN_TYPES).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Input
                    type="number"
                    value={state.fontSize}
                    onChange={(e) => setState((prevState) => ({ ...prevState, fontSize: Number(e.target.value) }))}
                    min={12}
                    max={32}
                    className="bg-gray-800 border-gray-700 w-full p-2 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Line Height</Label>
                  <Input
                    type="number"
                    value={state.lineHeight}
                    onChange={(e) => setState((prevState) => ({ ...prevState, lineHeight: Number(e.target.value) }))}
                    min={1}
                    max={3}
                    step={0.1}
                    className="bg-gray-800 border-gray-700 w-full p-2 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Horizontal Offset</Label>
                  <Input
                    type="number"
                    value={state.horizontalOffset}
                    onChange={(e) => setState((prevState) => ({ ...prevState, horizontalOffset: Number(e.target.value) }))}
                    min={-50}
                    max={50}
                    className="bg-gray-800 border-gray-700 w-full p-2 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vertical Offset</Label>
                  <Input
                    type="number"
                    value={state.verticalOffset}
                    onChange={(e) => setState((prevState) => ({ ...prevState, verticalOffset: Number(e.target.value) }))}
                    min={-50}
                    max={50}
                    className="bg-gray-800 border-gray-700 w-full p-2 rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Letter Spacing</Label>
                <Input
                  type="number"
                  value={state.letterSpacing}
                  onChange={(e) => setState((prevState) => ({ ...prevState, letterSpacing: Number(e.target.value) }))}
                  min={0}
                  max={10}
                  step={0.1}
                  className="bg-gray-800 border-gray-700 w-full p-2 rounded-md"
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label>Ink Color</Label>
              <Select value={state.inkColor} onValueChange={(value) => setState(prevState => ({ ...prevState, inkColor: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select ink color" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {Object.entries(INK_COLORS).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Paper Type</Label>
              <Select value={state.pageBackground} onValueChange={handleBackgroundChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select paper type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value={PAGE_BACKGROUNDS.RULED}>Ruled</SelectItem>
                  <SelectItem value={PAGE_BACKGROUNDS.RULED1}>Ruled-1</SelectItem>
                  <SelectItem value={PAGE_BACKGROUNDS.GRID}>Grid</SelectItem>
                  <SelectItem value={PAGE_BACKGROUNDS.BLANK}>Blank</SelectItem>
                  <SelectItem value={PAGE_BACKGROUNDS.OLDRUSTY}>OldRusty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Background</Label>
              <Input
                type="file"
                onChange={handleCustomBackgroundUpload}
                accept="image/*"
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <Button onClick={handleReset} className="w-full" variant="destructive">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All Settings
            </Button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4">
              <canvas
                ref={canvasRef}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                className="w-full h-auto border border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                onClick={() => setState(prevState => ({ ...prevState, currentPage: Math.max(0, prevState.currentPage - 1) }))}
                disabled={state.currentPage === 0}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Page
              </Button>
              
              <span>Page {state.currentPage + 1} of {state.pages.length}</span>
              
              <Button
                onClick={() => setState(prevState => ({ ...prevState, currentPage: Math.min(prevState.pages.length - 1, prevState.currentPage + 1) }))}
                disabled={state.currentPage === state.pages.length - 1}
                variant="outline"
              >
                Next Page
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={() => handleDownload('png')}
                className="flex-1"
                variant="default"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
              
              <Button
                onClick={() => handleDownload('pdf')}
                className="flex-1"
                variant="default"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
        <Info className="w-6 h-6 mr-2" />
        What is the Text to Handwriting Converter?
      </h2>
      <p className="text-gray-300 mb-4">
        The Text to Handwriting Converter is an innovative tool that transforms digital text into realistic handwritten notes. It's perfect for students, teachers, designers, and anyone looking to add a personal touch to their digital content. This tool offers a wide range of customization options to create authentic-looking handwritten documents.
      </p>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <BookOpen className="w-6 h-6 mr-2" />
        How to Use the Text to Handwriting Converter?
      </h2>
      <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li>Enter or paste your text in the input area.</li>
        <li>Choose your preferred handwriting style from the font options.</li>
        <li>Adjust the font size, line height, and letter spacing as desired.</li>
        <li>Select the ink color and pen type for a personalized look.</li>
        <li>Pick a paper background or upload your own custom background.</li>
        <li>Fine-tune the horizontal and vertical offsets if needed.</li>
        <li>Preview your handwritten text in real-time.</li>
        <li>Download your creation as a PNG or PDF file.</li>
      </ol>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <Lightbulb className="w-6 h-6 mr-2" />
        Customization Options
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li>Multiple handwriting fonts to choose from</li>
        <li>Adjustable font size (12-32px)</li>
        <li>Customizable line height (1-3x)</li>
        <li>Letter spacing control (0-10px)</li>
        <li>Various ink colors (blue, black, red, green, purple)</li>
        <li>Different pen types (ballpoint, fountain, gel, marker)</li>
        <li>Paper background options (ruled, grid, blank, old rusty)</li>
        <li>Custom background upload feature</li>
        <li>Horizontal and vertical offset adjustments</li>
      </ul>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <Lightbulb className="w-6 h-6 mr-2" />
        Additional Features
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li>Real-time preview of handwritten text</li>
        <li>Multi-page support for longer documents</li>
        <li>PNG download for individual pages</li>
        <li>PDF download for multi-page documents</li>
        <li>Reset button to quickly clear all settings</li>
        <li>Mobile-responsive design for on-the-go use</li>
      </ul>
    </div>
    </ToolLayout> 
  )
}