'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select1"
import ToolLayout from '@/components/ToolLayout'
import { Label } from "@/components/ui/label"
import NextImage from 'next/image'
import { Toaster, toast } from 'react-hot-toast'
import { Download, ChevronLeft, ChevronRight, RefreshCw, Info, BookOpen, Settings, ArrowRightLeft, Lightbulb } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { HexColorPicker } from "react-colorful"
import { 
  PAGE_WIDTH, 
  PAGE_HEIGHT, 
  MARGIN_LEFT, 
  HANDWRITING_FONTS, 
  PEN_TYPE_STYLES, 
  INK_COLORS,
  PAPER_STYLES,
  FONT_SIZES,
  PaperStyleKey,
  PenTypeKey,
  InkColorKey
} from './constants'
import { loadFonts, fitTextBetweenLines, preloadImage, splitTextIntoPages } from './utils'
import DownloadDialog from './DownloadDialog'

interface Page {
  text: string
  background: string
}

interface AppState {
  inputText: string
  selectedFont: string
  fontSize: number
  letterSpacing: number
  horizontalOffset: number
  verticalOffset: number
  lineHeight: number
  inkColor: InkColorKey
  penType: PenTypeKey
  pages: Page[]
  currentPage: number
  paperStyle: PaperStyleKey
  customBackground: string | null
  customInkColor: string
}

const initialState: AppState = {
  inputText: '',
  selectedFont: HANDWRITING_FONTS[0].name,
  fontSize: PAPER_STYLES.RULED_BLUE.defaultFontSize,
  letterSpacing: 0.5,
  horizontalOffset: PAPER_STYLES.RULED_BLUE.marginLeft,
  verticalOffset: 40,
  lineHeight: PAPER_STYLES.RULED_BLUE.lineHeight,
  inkColor: 'BLUE',
  penType: 'BALLPOINT',
  pages: [{ text: '', background: PAPER_STYLES.RULED_BLUE.src }],
  currentPage: 0,
  paperStyle: 'RULED_BLUE',
  customBackground: null,
  customInkColor: '#000000'
}

export default function TextToHandwriting() {
  const [state, setState] = useState<AppState>(initialState)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [key, setKey] = useState(0)
  const [fontLoadingErrors, setFontLoadingErrors] = useState<string[]>([])
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)

  // Initialize fonts
  useEffect(() => {
    const initializeFonts = async () => {
      try {
        const success = await loadFonts(HANDWRITING_FONTS)
        setFontsLoaded(success)
        if (!success) {
          const errorMessage = "Some fonts failed to load. The converter may not display all handwriting styles correctly."
          setFontLoadingErrors(prev => [...prev, errorMessage])
          toast.error(errorMessage)
        }
      } catch (error) {
        console.error('Error loading fonts:', error)
        const errorMessage = "Failed to load fonts. The converter may not work as expected."
        setFontLoadingErrors(prev => [...prev, errorMessage])
        toast.error(errorMessage)
      }
    }
    initializeFonts()
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

  useEffect(() => {
    if (state.inputText) {
      if (ctx.current) {
        const pageTexts = splitTextIntoPages(
          ctx.current,
          state.inputText,
          state.fontSize,
          state.lineHeight,
          PAGE_WIDTH - 2 * MARGIN_LEFT - state.horizontalOffset,
          PAGE_HEIGHT - 2 * state.verticalOffset
        )
        setState(prevState => ({
          ...prevState,
          pages: pageTexts.map(text => ({
            text,
            background: state.customBackground || PAPER_STYLES[state.paperStyle].src
          })),
          currentPage: 0
        }))
      }
    }
  }, [state.inputText, state.fontSize, state.letterSpacing, state.horizontalOffset, state.paperStyle, state.customBackground])

  useEffect(() => {
    const timer = setTimeout(() => {
      renderPage()
    }, 100)
    return () => clearTimeout(timer)
  }, [state, fontsLoaded, key])

  const renderPage = async () => {
    if (!ctx.current || !canvasRef.current || !fontsLoaded) return

    try {
      const backgroundSrc = state.customBackground || PAPER_STYLES[state.paperStyle].src
      const backgroundImage = await preloadImage(backgroundSrc)
      
      ctx.current.clearRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT)
      ctx.current.drawImage(backgroundImage, 0, 0, PAGE_WIDTH, PAGE_HEIGHT)
      
      ctx.current.font = `${state.fontSize}px "${state.selectedFont}", sans-serif`
      ctx.current.fillStyle = state.inkColor === 'CUSTOM' ? state.customInkColor : INK_COLORS[state.inkColor]

      const penStyle = PEN_TYPE_STYLES[state.penType]
      ctx.current.lineWidth = penStyle.lineWidth
      ctx.current.lineCap = penStyle.lineCap as CanvasLineCap
      ctx.current.shadowBlur = penStyle.shadowBlur
      ctx.current.globalAlpha = penStyle.opacity

      const pageText = state.pages[state.currentPage].text
      const effectiveLineHeight = state.lineHeight || PAPER_STYLES[state.paperStyle].lineHeight
      const maxWidth = PAGE_WIDTH - 2 * MARGIN_LEFT - state.horizontalOffset

      fitTextBetweenLines(
        ctx.current,
        pageText,
        MARGIN_LEFT + state.horizontalOffset,
        state.verticalOffset,
        maxWidth,
        effectiveLineHeight,
        state.fontSize
      )

      ctx.current.globalAlpha = 1
    } catch (error) {
      console.error('Error rendering page:', error)
      toast.error('Error rendering page. Please try again.')
    }
  }

  const createHighResCanvas = (dpi: number): HTMLCanvasElement => {
    const scaleFactor = dpi / 96; // 96 is default screen DPI
    const canvas = document.createElement('canvas');
    canvas.width = PAGE_WIDTH * scaleFactor;
    canvas.height = PAGE_HEIGHT * scaleFactor;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Scale everything to match the new DPI
      context.scale(scaleFactor, scaleFactor);
      context.textAlign = 'left';
      context.textBaseline = 'top';
    }
    
    return canvas;
  };

  const renderToCanvas = async (canvas: HTMLCanvasElement, page: Page): Promise<void> => {
    const context = canvas.getContext('2d');
    if (!context) return;

    try {
      // Draw background
      const backgroundSrc = state.customBackground || PAPER_STYLES[state.paperStyle].src;
      const backgroundImage = await preloadImage(backgroundSrc);
      context.drawImage(backgroundImage, 0, 0, PAGE_WIDTH, PAGE_HEIGHT);

      // Set text properties
      context.font = `${state.fontSize}px "${state.selectedFont}", sans-serif`;
      context.fillStyle = state.inkColor === 'CUSTOM' ? state.customInkColor : INK_COLORS[state.inkColor];

      // Apply pen style
      const penStyle = PEN_TYPE_STYLES[state.penType];
      context.lineWidth = penStyle.lineWidth;
      context.lineCap = penStyle.lineCap as CanvasLineCap;
      context.shadowBlur = penStyle.shadowBlur;
      context.globalAlpha = penStyle.opacity;

      // Render text
      const effectiveLineHeight = state.lineHeight || PAPER_STYLES[state.paperStyle].lineHeight;
      const maxWidth = PAGE_WIDTH - 2 * MARGIN_LEFT - state.horizontalOffset;

      fitTextBetweenLines(
        context,
        page.text,
        MARGIN_LEFT + state.horizontalOffset,
        state.verticalOffset,
        maxWidth,
        effectiveLineHeight,
        state.fontSize
      );

      context.globalAlpha = 1;
    } catch (error) {
      console.error('Error rendering to high-res canvas:', error);
      throw error;
    }
  };

  const handleDownload = async (options: { dpi: number; format: 'png' | 'pdf'; quality: number }) => {
    try {
      const { dpi, format, quality } = options;
      
      if (format === 'png') {
        // Create high-resolution canvas
        const highResCanvas = createHighResCanvas(dpi);
        await renderToCanvas(highResCanvas, state.pages[state.currentPage]);

        // Create download link with quality settings
        const link = document.createElement('a');
        link.download = `handwritten_page_${state.currentPage + 1}_${dpi}dpi.png`;
        link.href = highResCanvas.toDataURL('image/png', quality);
        link.click();
        
        toast.success(`Downloaded high-quality PNG at ${dpi} DPI`);
      } else if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [PAGE_WIDTH * (dpi / 96), PAGE_HEIGHT * (dpi / 96)]
        });

        for (let i = 0; i < state.pages.length; i++) {
          if (i > 0) pdf.addPage();
          
          const highResCanvas = createHighResCanvas(dpi);
          await renderToCanvas(highResCanvas, state.pages[i]);
          
          const imgData = highResCanvas.toDataURL('image/png', quality);
          pdf.addImage(imgData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        }

        pdf.save(`handwritten_document_${dpi}dpi.pdf`);
        toast.success(`Downloaded high-quality PDF at ${dpi} DPI`);
      }
    } catch (error) {
      console.error('Error during download:', error);
      toast.error('Failed to download. Please try again.');
    }
  };

  const handlePaperStyleChange = (value: PaperStyleKey) => {
    const paperStyle = PAPER_STYLES[value]
    setState(prevState => ({
      ...prevState,
      paperStyle: value,
      customBackground: null,
      fontSize: paperStyle.defaultFontSize,
      lineHeight: paperStyle.lineHeight,
      horizontalOffset: paperStyle.marginLeft
    }))
  }

  const handleCustomBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === 'string') {
          setState(prevState => ({
            ...prevState,
            customBackground: result,
            paperStyle: 'CUSTOM' as PaperStyleKey
          }))
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

  const handlePenTypeChange = (value: PenTypeKey) => {
    setState(prevState => ({ ...prevState, penType: value }))
    setKey(prevKey => prevKey + 1)
  }

  // Group paper styles by category for the select component
  const paperStyleOptions = Object.entries(PAPER_STYLES).map(([key, value]) => ({
    value: key,
    label: value.name
  }))

  return (
    <ToolLayout
      title="Text to Handwriting Converter"
      description="Transform your text into handwritten notes with customizable styles"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-8">
        <Toaster position="top-right" />
        
        {fontLoadingErrors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Font Loading Error:</strong>
            <ul className="mt-2 list-disc list-inside">
              {fontLoadingErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Preview Section */}
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

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <DownloadDialog handleDownload={handleDownload} />
                <Button
                  onClick={() => handleDownload({ dpi: 96, format: 'png', quality: 0.8 })}
                  className="w-full sm:w-auto flex-1"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Quick PNG
                </Button>
                <Button
                  onClick={() => handleDownload({ dpi: 96, format: 'pdf', quality: 0.8 })}
                  className="w-full sm:w-auto flex-1"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Quick PDF
                </Button>
              </div>
            </div>

            {/* Controls Section */}
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
                    onSelectionChange={(value) => handlePenTypeChange(value as PenTypeKey)}
                    placeholder="Select pen type"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      label='Select Font Size'
                      options={FONT_SIZES.map(size => ({ value: size.toString(), label: `${size}px` }))}
                      selectedKey={state.fontSize.toString()}
                      onSelectionChange={(value) => setState(prevState => ({ ...prevState, fontSize: parseInt(value, 10) }))}
                      placeholder="Select font size"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Line Height</Label>
                    <Input
                      type="number"
                      value={state.lineHeight}
                      onChange={(e) => setState((prevState) => ({ 
                        ...prevState, 
                        lineHeight: Number(e.target.value)
                      }))}
                      min={20}
                      max={100}
                      className="bg-gray-800 border-gray-700 w-full p-2 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label>Horizontal Offset</Label>
                    <Input
                      type="number"
                      value={state.horizontalOffset}
                      onChange={(e) => setState((prevState) => ({ ...prevState, horizontalOffset: Number(e.target.value) }))}
                      min={0}
                      max={150}
                      className="bg-gray-800 border-gray-700 w-full p-2 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Vertical Offset</Label>
                  <Input
                    type="number"
                    value={state.verticalOffset}
                    onChange={(e) => setState((prevState) => ({ ...prevState, verticalOffset: Number(e.target.value) }))}
                    min={0}
                    max={100}
                    className="bg-gray-800 border-gray-700 w-full p-2 rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ink Color</Label>
                <Select
                  label='Select Ink Color'
                  options={[
                    ...Object.entries(INK_COLORS).map(([key]) => ({ value: key, label: key.charAt(0) + key.slice(1).toLowerCase() })),
                    { value: 'CUSTOM', label: 'Custom' }
                  ]}
                  selectedKey={state.inkColor}
                  onSelectionChange={(value) => setState(prevState => ({ ...prevState, inkColor: value as InkColorKey }))}
                  placeholder="Select ink color"
                />
                {state.inkColor === 'CUSTOM' && (
                  <div className="mt-2">
                    <HexColorPicker 
                      color={state.customInkColor} 
                      onChange={(color) => setState(prevState => ({ ...prevState, customInkColor: color }))} 
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Paper Style</Label>
                <Select
                  label='Select Paper Style'
                  options={paperStyleOptions}
                  selectedKey={state.paperStyle}
                  onSelectionChange={(value) => handlePaperStyleChange(value as PaperStyleKey)}
                  placeholder="Select paper style"
                />
              </div>

              <div className="space-y-2 space-x-2">
                <Label>Custom Background</Label>
                <Input
                  type="file"
                  onChange={handleCustomBackgroundUpload}
                  accept="image/*"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <Button onClick={handleReset} className="w-full" variant="default">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is a Text to Handwriting Converter?
          </h2>
          <p className="text-gray-300 mb-4">
            Text to Handwriting Converter is an innovative tool that transforms virtual text content into realistic handwritten notes. Perfect for college students, teachers, designers, and anyone seeking to add a personal touch to their digital content, this tool combines user-friendly interface with powerful customization options to create authentic-looking handwritten documents in seconds.
          </p>
          <p className="text-gray-300 mb-4">
            Whether you're creating personal journal entries, designing educational materials, or adding a human touch to digital communications, our converter provides the flexibility and realism you need. It's like having a personal scribe right in your browser!
          </p>
          <div className="my-8">
          <NextImage 
            src="/Images/TextToHandwritingPreview.png?height=400&width=600" 
            alt="Screenshot of the Code to Image Converter interface showing code input area and customization options" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use the Text to Handwriting Converter?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter or paste your text in the input field</li>
            <li>Select your desired handwriting style from the font options</li>
            <li>Adjust font size, line height, and letter spacing as needed</li>
            <li>Choose your preferred ink color and pen type</li>
            <li>Select a paper background or upload your own custom design</li>
            <li>Fine-tune the horizontal and vertical offsets if desired</li>
            <li>Preview your handwritten content in real-time</li>
            <li>Download your creation as a PNG or PDF file</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Various Handwriting Styles:</strong> Choose from a diverse collection of realistic handwriting fonts</li>
            <li><strong>Customizable Appearance:</strong> Fine-tune font size, line height, letter spacing, and more</li>
            <li><strong>Ink and Pen Options:</strong> Select from different ink colors and pen types for varied effects</li>
            <li><strong>Paper Backgrounds:</strong> Use preset backgrounds or upload your own custom designs</li>
            <li><strong>Real-time Preview:</strong> See instant updates as you modify your text and settings</li>
            <li><strong>Multi-page Support:</strong> Create documents spanning multiple pages</li>
            <li><strong>Download Options:</strong> Save your work as PNG images or multi-page PDF documents</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <ArrowRightLeft className="w-6 h-6 mr-2" />
            Understanding the Process
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Font Selection:</strong> Each font is carefully chosen to mimic natural handwriting styles</li>
            <li><strong>Text Rendering:</strong> Advanced algorithms ensure proper text placement and spacing</li>
            <li><strong>Customization:</strong> Multiple options allow you to achieve the perfect handwritten look</li>
            <li><strong>Background Integration:</strong> Seamless integration of text with your chosen paper style</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Practical Applications
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Education:</strong> Create personalized study materials and assignments</li>
            <li><strong>Personal Use:</strong> Design unique journal entries and notes</li>
            <li><strong>Professional:</strong> Add a personal touch to business communications</li>
            <li><strong>Creative:</strong> Enhance digital art and design projects</li>
            <li><strong>Social Media:</strong> Create engaging, personalized content</li>
            <li><strong>Documentation:</strong> Generate handwritten-style documentation</li>
          </ul>

          <p className="text-gray-300 mt-6">
            Ready to transform your digital text into beautiful handwriting? Start using our Text to Handwriting Converter now and discover how it can enhance your digital content with a personal, handwritten touch. Whether you're a student, professional, or creative individual, our tool provides the perfect balance of customization and authenticity for your needs.
          </p>
        </div>
    </ToolLayout> 
  )
}

