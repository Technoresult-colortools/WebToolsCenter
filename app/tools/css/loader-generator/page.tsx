'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ChevronLeft, ChevronRight, Copy, Settings, Code } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Type definitions
interface LoaderCustomization {
  size: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  speed: number;
}

interface LoaderCustomizations {
  [key: string]: LoaderCustomization;
}

interface LoaderCategory {
  [key: string]: string;
}

interface LoaderCategories {
  [key: string]: LoaderCategory;
}
// Categorized loader types
const loaderCategories: LoaderCategories = {
  'Spinners': {
    'Basic': `
      .spinner-basic {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 9px solid;
        border-color: #dbdcef;
        border-right-color: #474bff;
        animation: spinner-basic 1s infinite linear;
      }
      @keyframes spinner-basic {
        to {
          transform: rotate(1turn);
        }
      }
    `,
    'Comet': `
      .spinner-comet {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: radial-gradient(farthest-side,#474bff 94%,#0000) top/9px 9px no-repeat,
               conic-gradient(#0000 30%,#474bff);
        -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 9px),#000 0);
        animation: spinner-comet 1s infinite linear;
      }
      @keyframes spinner-comet {
        100% {
          transform: rotate(1turn);
        }
      }
    `,
    'Orbit': `
      .spinner-orbit {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        position: relative;
        animation: spinner-orbit 1.5s linear infinite;
      }
      .spinner-orbit::before {
        content: '';
        width: 24px;
        height: 24px;
        background: #474bff;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      @keyframes spinner-orbit {
        100% {
          transform: rotate(360deg);
        }
      }
    `,
    'Ripple': `
      .spinner-ripple {
        width: 56px;
        height: 56px;
        position: relative;
        background: transparent;
      }
      .spinner-ripple::before, .spinner-ripple::after {
        content: '';
        position: absolute;
        border: 4px solid #474bff;
        border-radius: 50%;
        animation: ripple 1.2s infinite ease-in-out;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      .spinner-ripple::after {
        animation-delay: 0.6s;
      }
      @keyframes ripple {
        0% {
          transform: scale(0.1);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    `,
    'DualRing': `
  .spinner-dualring {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    position: relative;
  }
  .spinner-dualring::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 6px solid #474bff;
    border-radius: 50%;
    border-top-color: transparent;
    border-right-color: transparent;
    animation: spin 1.2s linear infinite;
  }
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`,

  },
  
  'Bars': {
    'Progress': `
      .spinner-progress {
        width: 56px;
        height: 8px;
        background: #dbdcef;
        position: relative;
        overflow: hidden;
      }
      .spinner-progress::after {
        content: '';
        width: 40%;
        height: 100%;
        background: #474bff;
        position: absolute;
        left: -20%;
        animation: bar-progress 1s linear infinite;
      }
      @keyframes bar-progress {
        to {
          transform: translateX(300%);
        }
      }
    `,
    'Equalizer': `
      .spinner-equalizer {
        width: 56px;
        height: 26px;
        display: flex;
        gap: 4px;
      }
      .spinner-equalizer::after,
      .spinner-equalizer::before {
        content: "";
        height: 100%;
        width: 25%;
        background: #474bff;
        animation: eq-bars 1s ease-in-out infinite alternate;
      }
      .spinner-equalizer::before {
        animation-delay: -1s;
      }
      @keyframes eq-bars {
        0% { height: 100%; }
        100% { height: 20%; }
      }
    `,
  },
  'Dots': {
    'Pulse': `
      .spinner-pulse {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #474bff;
        animation: pulse-dot 1s infinite ease-in-out;
      }
      @keyframes pulse-dot {
        0% { transform: scale(0.3); opacity: 0.3; }
        50% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(0.3); opacity: 0.3; }
      }
    `,
    'Bounce': `
      .spinner-bounce {
        width: 56px;
        height: 13.6px;
        background: radial-gradient(circle closest-side,#474bff 90%,#0000) 0%   50%,
               radial-gradient(circle closest-side,#474bff 90%,#0000) 50%  50%,
               radial-gradient(circle closest-side,#474bff 90%,#0000) 100% 50%;
        background-size: calc(100%/3) 100%;
        background-repeat: no-repeat;
        animation: bounce-dots 1s infinite linear;
      }
      @keyframes bounce-dots {
        20% { background-position: 0%   0%, 50%  50%, 100% 50%; }
        40% { background-position: 0% 100%, 50%   0%, 100% 50%; }
        60% { background-position: 0%  50%, 50% 100%, 100%  0%; }
        80% { background-position: 0%  50%, 50%  50%, 100% 100%; }
      }
    `,
  }
}

const defaultCustomization: LoaderCustomization = {
  size: 56,
  primaryColor: '#474bff',
  secondaryColor: '#dbdcef',
  backgroundColor: '#ffffff',
  speed: 1
}


export default function CSSLoaderGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Spinners')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loaderCustomizations, setLoaderCustomizations] = useState<LoaderCustomizations>({})
  const [activeLoader, setActiveLoader] = useState<string | null>(null)
  const [tempCustomization, setTempCustomization] = useState<LoaderCustomization>(defaultCustomization)
  const loadersPerPage = 6

  const generateLoaderCSS = (
    category: string, 
    type: string, 
    customization: LoaderCustomization
  ): string => {
    const css = loaderCategories[category]?.[type]
    if (!css) return ''
    
    return css
      .replace(/56px/g, `${customization.size}px`)
      .replace(/#474bff/g, customization.primaryColor)
      .replace(/#dbdcef/g, customization.secondaryColor)
      .replace(/1s/g, `${customization.speed}s`)
  }

  const handleCustomization = (
    key: keyof LoaderCustomization, 
    value: string | number
  ): void => {
    setTempCustomization(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const copyToClipboard = (css: string): void => {
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard!')
  }

  const renderLoader = (category: string, type: string, customization: LoaderCustomization): JSX.Element => {
    const css = generateLoaderCSS(category, type, customization)
    const className = `spinner-${type.toLowerCase().replace(/\s+/g, '-')}`
    
    return (
      <div className="w-full h-32 flex items-center justify-center rounded-md" style={{ backgroundColor: customization.backgroundColor }}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className={className} />
      </div>
    )
  }

  const getCategoryLoaders = (category: string): string[] => {
    return Object.keys(loaderCategories[category] || {})
  }

  const categoryLoaders = getCategoryLoaders(selectedCategory)
  const totalPages = Math.ceil(categoryLoaders.length / loadersPerPage)
  const paginatedLoaders = categoryLoaders.slice(
    (currentPage - 1) * loadersPerPage,
    currentPage * loadersPerPage
  )

  const handleDialogOpen = (type: string) => {
    setActiveLoader(type)
    setTempCustomization(loaderCustomizations[type] || defaultCustomization)
  }

  const handleDialogClose = () => {
    setActiveLoader(null)
    setTempCustomization(defaultCustomization)
  }

  const handleSaveCustomization = () => {
    if (activeLoader) {
      setLoaderCustomizations(prev => ({
        ...prev,
        [activeLoader]: tempCustomization
      }))
    }
  }

  useEffect(() => {
    if (activeLoader) {
      handleSaveCustomization()
    }
  }, [tempCustomization])

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Toaster position="top-right" />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            CSS Loader Generator
          </h1>
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 lg:p-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <Select 
                value={selectedCategory} 
                onValueChange={(value: string) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-full sm:w-48 bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  {Object.keys(loaderCategories).map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="text-gray-300 text-sm font-medium">
                {categoryLoaders.length} loaders available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedLoaders.map((type) => (
                <Card key={type} className="overflow-hidden bg-gray-700 border-gray-600 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gray-600 p-3 mb-4">
                    <CardTitle className="text-lg font-semibold text-white">{type}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-3 space-y-4">
                    <div className="w-full h-32 flex items-center justify-center bg-gray-800 rounded-md">
                      {renderLoader(selectedCategory, type, loaderCustomizations[type] || defaultCustomization)}
                    </div>
                  
                    <div className="flex justify-center gap-2">
                      <Dialog onOpenChange={(open) => open ? handleDialogOpen(type) : handleDialogClose()}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 bg-gray-600 text-white hover:bg-gray-500">
                            <Settings className="w-4 h-4 mr-2" />
                            Customize
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] bg-gray-800 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-white">Customize {type}</DialogTitle>
                          </DialogHeader>
                          
                          <Tabs defaultValue="customize" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="customize">Customize</TabsTrigger>
                              <TabsTrigger value="code">Get Code</TabsTrigger>
                            </TabsList>
                            <TabsContent value="customize">
                              <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                  <Label className="text-white">Size</Label>
                                  <Slider
                                    min={20}
                                    max={100}
                                    step={1}
                                    value={tempCustomization.size}
                                    onChange={(value) => handleCustomization('size', value)}
                                    className="bg-gray-700"
                                  />
                                  <span className="text-sm text-gray-300">
                                    {tempCustomization.size}px
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-white">Primary Color</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="color"
                                      value={tempCustomization.primaryColor}
                                      onChange={(e) => handleCustomization('primaryColor', e.target.value)}
                                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                                    />
                                    <Input
                                      type="text"
                                      value={tempCustomization.primaryColor}
                                      onChange={(e) => handleCustomization('primaryColor', e.target.value)}
                                      className="flex-1 bg-gray-700 text-white border-gray-600"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-white">Secondary Color</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="color"
                                      value={tempCustomization.secondaryColor}
                                      onChange={(e) => handleCustomization('secondaryColor', e.target.value)}
                                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                                    />
                                    <Input
                                      type="text"
                                      value={tempCustomization.secondaryColor}
                                      onChange={(e) => handleCustomization('secondaryColor', e.target.value)}
                                      className="flex-1 bg-gray-700 text-white border-gray-600"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-white">Background Color</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="color"
                                      value={tempCustomization.backgroundColor}
                                      onChange={(e) => handleCustomization('backgroundColor', e.target.value)}
                                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                                    />
                                    <Input
                                      type="text"
                                      value={tempCustomization.backgroundColor}
                                      onChange={(e) => handleCustomization('backgroundColor', e.target.value)}
                                      className="flex-1 bg-gray-700 text-white border-gray-600"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-white">Speed</Label>
                                  <Slider
                                    min={0.1}
                                    max={3}
                                    step={0.1}
                                    value={tempCustomization.speed}
                                    onChange={(value) => handleCustomization('speed', value)}
                                    className="bg-gray-700"
                                  />
                                  <span className="text-sm text-gray-300">
                                    {tempCustomization.speed}s
                                  </span>
                                </div>

                                <div className="pt-4">
                                  <Label className="text-white">Preview</Label>
                                  <div className="bg-gray-800 rounded-md p-4">
                                    {renderLoader(selectedCategory, type, tempCustomization)}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="code">
                              <div className="mt-4">
                                <SyntaxHighlighter 
                                  language="css" 
                                  style={atomDark}
                                  className="rounded-md max-h-[60vh] overflow-auto"
                                >
                                  {generateLoaderCSS(selectedCategory, type, tempCustomization)}
                                </SyntaxHighlighter>
                                <Button
                                  onClick={() => copyToClipboard(generateLoaderCSS(selectedCategory, type, tempCustomization))}
                                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Code
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 p-0 ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}