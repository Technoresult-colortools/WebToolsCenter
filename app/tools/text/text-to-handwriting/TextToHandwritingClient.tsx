'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import  Input from "@/components/ui/Input"

import { Textarea } from "@/components/ui/textarea"

import ToolLayout from '@/components/ToolLayout'
import { Label } from "@/components/ui/label"
import { Toaster, toast } from 'react-hot-toast'
import { Download, ChevronLeft, ChevronRight, RefreshCw, Info, BookOpen, Settings, ArrowRightLeft, Lightbulb } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { Select } from '@/components/ui/select1';

declare const Image: {
  new (): HTMLImageElement;
};

// Standard US Letter size in pixels (at 96 DPI)
const PAGE_WIDTH = 816 // 8.5 inches
const PAGE_HEIGHT = 1056 // 11 inches
const MARGIN_LEFT = 72 // 0.75 inch margin

// Updated Handwriting fonts with more reliable web fonts
const HANDWRITING_FONTS = [
  { name: "Caveat", url: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" },
  { name: "Kalam", url: "https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap" },
  { name: "Architects Daughter", url: "https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap" },
  { name: "Patrick Hand", url: "https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" },
  { name: "Indie Flower", url: "https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" },
  { name: "Permanent Marker", url: "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" },
  { name: "Shadows Into Light", url: "https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" },
  { name: "Comic Neue", url: "https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap" },
  { name: "Handlee", url: "https://fonts.googleapis.com/css2?family=Handlee&display=swap" },
  { name: "Rock Salt", url: "https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap" }
]

const PEN_TYPE_STYLES = {
  BALLPOINT: {
    lineWidth: 0.8,
    lineCap: 'butt',
    shadowBlur: 0,
    opacity: 0.9
  },
  FOUNTAIN: {
    lineWidth: 1.5,
    lineCap: 'round',
    shadowBlur: 1,
    opacity: 0.85
  },
  GEL: {
    lineWidth: 1.2,
    lineCap: 'round',
    shadowBlur: 0.5,
    opacity: 0.8
  },
  MARKER: {
    lineWidth: 2.5,
    lineCap: 'square',
    shadowBlur: 2,
    opacity: 0.75
  }
}

const INK_COLORS = {
  BLUE: '#0000FF',
  BLACK: '#000000',
  RED: '#FF0000',
  GREEN: '#008000',
  PURPLE: '#800080'
}

const PAGE_BACKGROUNDS = {
  RULED: '/Images/Ruled.jpg',
  RULED1: '/Images/Ruled1.jpg',
  GRID: '/Images/Grid.jpg',
  BLANK: '/Images/Blank.jpg',
  OLDRUSTY: '/Images/OldRusty.jpg',
  VINTAGE: '/Images/Vintage.jpg'
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
  penType: keyof typeof PEN_TYPE_STYLES
  pages: Page[]
  currentPage: number
  customBackground: string | null
}

const initialState: AppState = {
  inputText: '',
  selectedFont: HANDWRITING_FONTS[0].name,
  fontSize: 24,
  lineHeight: 1.5,
  letterSpacing: 0.5,
  horizontalOffset: 65,
  verticalOffset: 45,
  pageBackground: PAGE_BACKGROUNDS.RULED,
  inkColor: INK_COLORS.BLUE,
  penType: 'BALLPOINT',
  pages: [{ text: '', background: PAGE_BACKGROUNDS.RULED }],
  currentPage: 0,
  customBackground: null
}

export default function TextToHandwriting() {
  const [state, setState] = useState<AppState>(initialState)
  const [key, setKey] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  const fontLoadedRef = useRef<{[key: string]: boolean}>({})

  // Load fonts
  useEffect(() => {
    HANDWRITING_FONTS.forEach(font => {
      const link = document.createElement('link')
      link.href = font.url
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      
      // Use a simple timeout to simulate font loading
      setTimeout(() => {
        fontLoadedRef.current[font.name] = true
        renderPage()
      }, 1000)
    })
  }, [])

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext('2d')
      if (ctx.current) {
        ctx.current.textAlign = 'left'
        ctx.current.textBaseline = 'top'
      }
    }
  }, [key])

  // Improved text splitting with better page break logic
  const splitTextIntoPages = (text: string): string[] => {
    if (!ctx.current) return [text]

    const words = text.split(' ')
    const pages: string[] = []
    let currentPage = ''
    let currentLine = ''
    let lineCount = 0
    const maxLines = Math.floor((PAGE_HEIGHT - 2 * state.verticalOffset) / (state.fontSize * state.lineHeight))

    const addLineToPage = (line: string) => {
      currentPage += (currentPage ? '\n' : '') + line
      lineCount++
    }

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      
      ctx.current!.font = `${state.fontSize}px "${state.selectedFont}", sans-serif`
      const lineWidth = ctx.current!.measureText(testLine).width

      if (lineWidth > (PAGE_WIDTH - 2 * MARGIN_LEFT - state.horizontalOffset)) {
        if (currentLine) addLineToPage(currentLine)
        currentLine = word

        if (lineCount >= maxLines) {
          pages.push(currentPage)
          currentPage = ''
          currentLine = word
          lineCount = 0
        }
      } else {
        currentLine = testLine
      }
    })

    if (currentLine) {
      addLineToPage(currentLine)
    }

    if (currentPage) {
      pages.push(currentPage)
    }

    return pages
  }

  // Render page with more precise control
  const renderPage = () => {
    if (!ctx.current || !canvasRef.current) return

    if (!fontLoadedRef.current[state.selectedFont]) return

    ctx.current.clearRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT)

    const img = new Image()
    img.onload = () => {
      ctx.current!.drawImage(img, 0, 0, PAGE_WIDTH, PAGE_HEIGHT)
      
      ctx.current!.font = `${state.fontSize}px "${state.selectedFont}", sans-serif`
      ctx.current!.fillStyle = state.inkColor

      const penStyle = PEN_TYPE_STYLES[state.penType]
      ctx.current!.lineWidth = penStyle.lineWidth
      ctx.current!.lineCap = penStyle.lineCap as CanvasLineCap
      ctx.current!.shadowBlur = penStyle.shadowBlur
      ctx.current!.globalAlpha = penStyle.opacity

      const pageText = state.pages[state.currentPage].text
      const lineHeight = state.fontSize * state.lineHeight
      let currentY = state.verticalOffset

      const lines = pageText.split('\n')
      
      lines.forEach((line) => {
        let currentX = MARGIN_LEFT + state.horizontalOffset
        
        for (let i = 0; i < line.length; i++) {
          ctx.current!.fillText(
            line[i],
            currentX,
            currentY
          )
          currentX += ctx.current!.measureText(line[i]).width + state.letterSpacing
        }
        
        currentY += lineHeight
      })

      ctx.current!.globalAlpha = 1
    }
    img.src = state.customBackground || state.pages[state.currentPage].background
  }

  // Update pages when input changes
  useEffect(() => {
    if (state.inputText) {
      const pageTexts = splitTextIntoPages(state.inputText)
      setState(prevState => ({
        ...prevState,
        pages: pageTexts.map(text => ({
          text,
          background: prevState.pageBackground
        })),
        currentPage: 0
      }))
    }
  }, [state.inputText, state.fontSize, state.lineHeight, state.letterSpacing, state.horizontalOffset, state.pageBackground])

  // Render page on state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      renderPage()
    }, 100)
    return () => clearTimeout(timer)
  }, [state, key])

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

  const handleFontChange = (value: string) => {
    setState(prevState => ({ ...prevState, selectedFont: value }))
    setKey(prevKey => prevKey + 1)
  }

  const handlePenTypeChange = (value: keyof typeof PEN_TYPE_STYLES) => {
    setState(prevState => ({ ...prevState, penType: value }))
    setKey(prevKey => prevKey + 1)
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
              <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4">
                <canvas
                  key={key}
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
                  <Select
                    label='Select Font'
                    options={HANDWRITING_FONTS.map(font => ({ value: font.name, label: font.name }))}
                    selectedKey={state.selectedFont}
                    onSelectionChange={(value) => handleFontChange(value)}
                    placeholder="Select font"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Pen Type</Label>
                  <Select 
                    label='Select Pen'
                    options={Object.keys(PEN_TYPE_STYLES).map(type => ({ value: type, label: type.charAt(0) + type.slice(1).toLowerCase() }))}
                    selectedKey={state.penType}
                    onSelectionChange={(value) => handlePenTypeChange(value as keyof typeof PEN_TYPE_STYLES)}
                    placeholder="Select pen type"
                  />
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
                      max={48}
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
                <Select
                  label='Select InkColor'
                  options={Object.entries(INK_COLORS).map(([key, value]) => ({ value, label: key.charAt(0) + key.slice(1).toLowerCase() }))}
                  selectedKey={state.inkColor}
                  onSelectionChange={(value) => setState(prevState => ({ ...prevState, inkColor: value }))}
                  placeholder="Select ink color"
                />
              </div>

              <div className="space-y-2">
                <Label>Paper Type</Label>
                <Select
                  label='Select Paper Type'
                  options={Object.entries(PAGE_BACKGROUNDS).map(([key, value]) => ({ value, label: key.charAt(0) + key.slice(1).toLowerCase() }))}
                  selectedKey={state.pageBackground}
                  onSelectionChange={handleBackgroundChange}
                  placeholder="Select paper type"
                />
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
          </div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
        <Info className="w-6 h-6 mr-2" />
        What is the Text to Handwriting Converter?
      </h2>
      <p className="text-gray-300 mb-4">
        The Text to Handwriting Converter is an innovative tool that transforms digital text into realistic handwritten notes. It's perfect for students, teachers, designers, and anyone looking to add a personal touch to their digital content. With its <a href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</a> and extensive customization options, you can create authentic-looking handwritten documents in seconds.
      </p>
      <p className="text-gray-300 mb-4">
        Whether you're creating study materials, designing personalized notes, or adding a human touch to digital communications, our converter provides you with the flexibility and realism you need. It's like having a personal scribe right in your browser!
      </p>

      <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <BookOpen className="w-6 h-6 mr-2" />
        How to Use the Text to Handwriting Converter
      </h2>
      <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li>Enter or paste your text into the input area.</li>
        <li>Choose your preferred handwriting style from the font options.</li>
        <li>Adjust the font size, line height, and letter spacing as desired.</li>
        <li>Select the ink color and pen type for a personalized look.</li>
        <li>Pick a paper background or upload your own custom background.</li>
        <li>Fine-tune the horizontal and vertical offsets if needed.</li>
        <li>Preview your handwritten text in real-time.</li>
        <li>Download your creation as a PNG or PDF file.</li>
      </ol>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <Settings className="w-6 h-6 mr-2" />
        Key Features
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li><strong>Multiple Handwriting Styles:</strong> Choose from a variety of realistic handwriting fonts.</li>
        <li><strong>Customizable Appearance:</strong> Adjust font size, line height, letter spacing, and more.</li>
        <li><strong>Ink and Pen Options:</strong> Select different ink colors and pen types for varied effects.</li>
        <li><strong>Paper Backgrounds:</strong> Choose from preset backgrounds or upload your own.</li>
        <li><strong>Real-time Preview:</strong> See your handwritten text update instantly as you make changes.</li>
        <li><strong>Multi-page Support:</strong> Create documents with multiple pages.</li>
        <li><strong>Download Options:</strong> Save your work as PNG images or multi-page PDF documents.</li>
      </ul>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <ArrowRightLeft className="w-6 h-6 mr-2" />
        Understanding the Conversion Process
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li><strong>Font Rendering:</strong> Carefully selected fonts mimic natural handwriting styles.</li>
        <li><strong>Randomization:</strong> Slight variations in character placement create a more authentic look.</li>
        <li><strong>Ink Effects:</strong> Different pen types and ink colors simulate various writing instruments.</li>
        <li><strong>Paper Textures:</strong> Background images add realism to the final output.</li>
      </ul>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <Lightbulb className="w-6 h-6 mr-2" />
        Practical Applications
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li><strong>Education:</strong> Create personalized study materials or worksheets.</li>
        <li><strong>Design:</strong> Add a handwritten touch to graphic designs or social media content.</li>
        <li><strong>Personal Communication:</strong> Craft unique, handwritten-style digital notes or letters.</li>
        <li><strong>Marketing:</strong> Develop eye-catching, personalized marketing materials.</li>
        <li><strong>Accessibility:</strong> Convert typed text to a more readable format for those who struggle with digital fonts.</li>
        <li><strong>Creative Projects:</strong> Use in scrapbooking, journaling, or other creative digital projects.</li>
      </ul>

      <p className="text-gray-300 mt-4">
        Ready to transform your digital text into beautiful handwriting? Start using our Text to Handwriting Converter now and add a personal touch to your digital content. Whether you're a student, teacher, designer, or anyone looking to add a human element to their digital text, our tool provides the customization and realism you need. Try it out and see how it can enhance your digital communications and creative projects!
      </p>
    </div>
    </ToolLayout> 
  )
}