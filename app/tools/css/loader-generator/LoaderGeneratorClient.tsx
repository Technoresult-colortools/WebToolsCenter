'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Image from 'next/image'
import Link from 'next/link'
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Card, CardContent } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Settings, Code, Copy, Info, Lightbulb, BookOpen, ChevronLeft, ChevronRight, X, Palette, Sliders, Zap, Eye } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { 
  loaderCategories, 
  getDefaultCategory, 
  getDefaultLoader,
  getLoaderData,
  isValidCategory,
} from './loaderCategories';

interface CustomizationOptions {
  size: number
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  speed: number
}

interface CustomizationsState {
  [key: string]: CustomizationOptions
}

const defaultCustomization: CustomizationOptions = {
  size: 56,
  primaryColor: '#3b82f6',
  secondaryColor: '#93c5fd',
  backgroundColor: '#ffffff',
  speed: 1
}

interface LoaderPreviewProps {
  category: string
  type: string
  customization: CustomizationOptions
}

const LoaderPreview: React.FC<LoaderPreviewProps> = ({ category, type, customization }) => {
  const [previewId] = useState(`loader-${Math.random().toString(36).substr(2, 9)}`)
  const loaderData = getLoaderData(loaderCategories, category, type)

  useEffect(() => {
    if (!loaderData) return

    try {
      const styleElement = document.createElement('style')
      const css = loaderData.css
        .replace(/\.loader/g, `.${previewId}`)
        .replace(/56px/g, `${customization.size}px`)
        .replace(/#3b82f6/g, customization.primaryColor)
        .replace(/#93c5fd/g, customization.secondaryColor)
        .replace(/1s/g, `${customization.speed}s`)
      
      styleElement.textContent = css
      document.head.appendChild(styleElement)
      
      return () => {
        document.head.removeChild(styleElement)
      }
    } catch (error) {
      console.error('Error applying loader styles:', error)
    }
  }, [previewId, category, type, customization, loaderData])

  if (!loaderData) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Loader not found
      </div>
    )
  }

  return (
    <div 
      className="w-full h-full flex items-center justify-center rounded-md" 
      style={{ backgroundColor: customization.backgroundColor }}
    >
      <div 
        dangerouslySetInnerHTML={{ 
          __html: loaderData.html.replace(/class="loader"/, `class="${previewId}"`) 
        }} 
      />
    </div>
  )
}


export default function LoaderGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    try {
      return getDefaultCategory(loaderCategories);
    } catch (error) {
      console.error(error);
      return '';
    }
  });
  const [selectedLoader, setSelectedLoader] = useState<string | null>(() => {
    try {
      return selectedCategory ? getDefaultLoader(loaderCategories, selectedCategory) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'customize' | 'code'>('customize')
  const [customizations, setCustomizations] = useState<CustomizationsState>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const loadersPerPage = 6

  const handleCustomize = (loaderType: string, tab: 'customize' | 'code') => {
    setSelectedLoader(loaderType)
    setActiveTab(tab)
    setDialogOpen(true)
  }

  const updateCustomization = (loaderType: string, updates: Partial<CustomizationOptions>) => {
    setCustomizations(prev => ({
      ...prev,
      [loaderType]: {
        ...(prev[loaderType] || defaultCustomization),
        ...updates
      }
    }))
  }

  const getCustomization = (loaderType: string): CustomizationOptions => {
    return customizations[loaderType] || defaultCustomization
  }

  const generateLoaderCSS = useCallback((
    category: string,
    type: string,
    customization: CustomizationOptions
  ): string => {
    const loaderData = getLoaderData(loaderCategories, category, type)
    if (!loaderData) {
      return ''
    }

    try {
      const css = loaderData.css
        .replace(/56px/g, `${customization.size}px`)
        .replace(/#3b82f6/g, customization.primaryColor)
        .replace(/#93c5fd/g, customization.secondaryColor)
        .replace(/1s/g, `${customization.speed}s`)

      return `.loader-container {
        background-color: ${customization.backgroundColor};
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }

      ${css}`
    } catch (error) {
      console.error('Error generating CSS:', error)
      return ''
    }
  }, [])

  const copyToClipboard = (css: string): void => {
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard!')
  }

  // Modified category change handler
 const handleCategoryChange = (category: string) => {
  if (isValidCategory(loaderCategories, category)) {
    setSelectedCategory(category);
    try {
      const defaultLoader = getDefaultLoader(loaderCategories, category);
      setSelectedLoader(defaultLoader);
    } catch (error) {
      console.error(error);
      setSelectedLoader(null);
    }
    setCurrentPage(1);
  }
};


  const categoryLoaders = selectedCategory ? Object.keys(loaderCategories[selectedCategory] || {}) : [];
  const totalPages = Math.ceil(categoryLoaders.length / loadersPerPage)
  const paginatedLoaders = categoryLoaders.slice(
    (currentPage - 1) * loadersPerPage,
    currentPage * loadersPerPage
  )

  useEffect(() => {
    // Force re-render of loaders on initial load
    setCustomizations({...customizations})
  }, [])

  return (
    <ToolLayout
      title="CSS Loader Generator"
      description="Create customizable CSS loaders for your web projects"
    >
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 lg:p-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <Select 
              value={selectedCategory} 
              onValueChange={handleCategoryChange}
            >
                <SelectTrigger className="w-full sm:w-48 bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {Object.keys(loaderCategories).map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="text-gray-300 text-sm font-medium">
                {categoryLoaders.length} loaders available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedLoaders.map((type) => (
                <Card key={type} className="group overflow-hidden bg-gray-800 border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-4 relative">
                    <h3 className="text-sm text-center font-semibold text-white mt-2 mb-2">{type}</h3>
                    <div className="w-full h-40 flex items-center justify-center bg-gray-900 rounded-md overflow-hidden mb-4">
                      <LoaderPreview
                        category={selectedCategory}
                        type={type}
                        customization={getCustomization(type)}
                      />
                    </div>
                  
                    <div className="flex flex-col gap-2 absolute inset-0 bg-gray-800 bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 justify-center">
                      <Button
                        onClick={() => handleCustomize(type, 'customize')}
                        className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-xs py-1"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Customize
                      </Button>
                      <Button
                        onClick={() => handleCustomize(type, 'code')}
                        className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-xs py-1 delay-75"
                      >
                        <Code className="w-4 h-4 mr-1" />
                        Get Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "destructive"}
                      onClick={() => setCurrentPage(page)}
                      className={`w-2 h-2 p-0 rounded-full ${
                        currentPage === page 
                          ? 'bg-blue-600' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      <span className="sr-only">Page {page}</span>
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="destructive"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the CSS Loader Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The CSS Loader Generator is your go-to tool for creating eye-catching, customizable loading animations using pure CSS. Whether you're a seasoned developer or just starting out, our <Link href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</Link> makes it a breeze to design stunning loaders that will keep your users engaged while your content loads.
            </p>
            <p className="text-gray-300 mb-4">
              With a wide variety of loader types across different categories, you can create anything from simple spinners to complex, multi-element animations. It's like having a digital animation studio at your fingertips, but without the complexity!
            </p>

            <div className="my-8">
              <Image 
                src="/Images/LoaderGeneratorPreview.png?height=400&width=600" 
                alt="Screenshot of the CSS Loader Generator interface showing various loader options and customization controls" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>

            <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the CSS Loader Generator
            </h2>
            <p className="text-gray-300 mb-4">
              Creating your perfect loader is as easy as 1-2-3. Here's a step-by-step guide to get you started:
            </p>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Start by selecting a <Link href="#categories" className="text-blue-400 hover:underline">loader category</Link> from the dropdown menu. We've got everything from spinners to progress bars!</li>
              <li>Browse through the available loaders in the grid view. Hover over a loader to see the "Customize" and "Get Code" options.</li>
              <li>Click "Customize" to open the <Link href="#customization" className="text-blue-400 hover:underline">customization dialog</Link>. Here, you can tweak various aspects of your loader.</li>
              <li>Use the sliders and color pickers to adjust the size, colors, and animation speed of your loader.</li>
              <li>Watch your changes come to life in the real-time preview window.</li>
              <li>Happy with your creation? Click the "Get Code" tab to view the generated CSS.</li>
              <li>Copy the CSS code with a single click and paste it into your project. Voilà! Your custom loader is ready to go.</li>
            </ol>

            <h2 id="categories" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Palette className="w-6 h-6 mr-2" />
              Loader Categories
            </h2>
            <p className="text-gray-300 mb-4">
              Our CSS Loader Generator offers a wide range of categories to suit every need:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><Link href="#spinners" className="text-blue-400 hover:underline">Spinners</Link>: Classic rotating loaders</li>
              <li><Link href="#bars" className="text-blue-400 hover:underline">Bars</Link>: Linear progress indicators</li>
              <li><Link href="#dots" className="text-blue-400 hover:underline">Dots</Link>: Pulsating or bouncing dot animations</li>
              <li><Link href="#circular" className="text-blue-400 hover:underline">Circular</Link>: Ring-shaped progress indicators</li>
              <li><Link href="#custom" className="text-blue-400 hover:underline">Custom</Link>: Unique and creative loader designs</li>
            </ul>

            <h2 id="customization" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Sliders className="w-6 h-6 mr-2" />
              Customization Options
            </h2>
            <p className="text-gray-300 mb-4">
              Make each loader truly yours with our extensive customization options:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>Size</strong>: Adjust the dimensions to fit your design perfectly</li>
              <li><strong>Colors</strong>: Choose primary, secondary, and background colors</li>
              <li><strong>Speed</strong>: Fine-tune the animation speed for the perfect pace</li>
              <li><strong>Preview</strong>: See your changes in real-time</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features That'll Make You Go "Wow!"
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><Zap className="w-4 h-4 inline-block mr-1" /> <strong>Lightning-fast previews</strong>: See your changes instantly</li>
              <li><Palette className="w-4 h-4 inline-block mr-1" /> <strong>Extensive loader library</strong>: Dozens of loader types to choose from</li>
              <li><Sliders className="w-4 h-4 inline-block mr-1" /> <strong>Fine-grained control</strong>: Customize every aspect of your loader</li>
              <li><Code className="w-4 h-4 inline-block mr-1" /> <strong>One-click code copy</strong>: Get your CSS with a single click</li>
              <li><Eye className="w-4 h-4 inline-block mr-1" /> <strong>Responsive design</strong>: Create loaders that look great on any device</li>
            </ul>

            <p className="text-gray-300 mt-4">
              Ready to revolutionize your loading experience? Dive in and start creating with our CSS Loader Generator. Remember, in the world of web design, even waiting can be an art form. Let's make your loaders as captivating as your content!
            </p>
          </div>
        </div>
      </div>
      {selectedLoader && (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-h-[90vh] md:max-h-[85vh] md:w-[600px] lg:w-[800px] bg-gray-900 text-white border-gray-700 p-0 overflow-hidden rounded-xl">
            <button
              onClick={() => setDialogOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-white" />
              <span className="sr-only">Close</span>
            </button>

            <div className="p-6 pt-8 overflow-y-auto max-h-[calc(90vh-4rem)] md:max-h-[calc(85vh-4rem)]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{selectedLoader}</DialogTitle>
              </DialogHeader>
              
              <Tabs 
                value={activeTab} 
                onValueChange={(value: string) => {
                  if (value === 'customize' || value === 'code') {
                    setActiveTab(value);
                  }
                }}
                className="mt-4"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger value="customize" className="data-[state=active]:bg-gray-700">
                    Customize
                  </TabsTrigger>
                  <TabsTrigger value="code" className="data-[state=active]:bg-gray-700">
                    Get Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="customize" className="h-[calc(90vh-16rem)] md:h-auto overflow-y-auto">
                  <div className="flex flex-col lg:flex-row gap-6 mt-4">
                    <div className="w-full lg:w-1/2">
                      <div className="bg-gray-800 rounded-lg p-4 h-[200px] lg:h-[300px] flex items-center justify-center">
                        <LoaderPreview
                          category={selectedCategory}
                          type={selectedLoader}
                          customization={getCustomization(selectedLoader)}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-4 pb-4">
                      <div className='space-y-1'>
                        <Label className="text-white">Size</Label>
                        <Slider
                          min={20}
                          max={100}
                          step={1}
                          value={getCustomization(selectedLoader).size}
                          onChange={(value) => 
                            updateCustomization(selectedLoader, { size: value })
                          }
                          className="bg-gray-800"
                        />
                        <span className="text-sm text-gray-400">
                          {getCustomization(selectedLoader).size}px
                        </span>
                      </div>
                      
                      <div className='space-y-1'>
                        <Label className="text-white">Primary Color</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            value={getCustomization(selectedLoader).primaryColor}
                            onChange={(e) => 
                              updateCustomization(selectedLoader, { primaryColor: e.target.value })
                            }
                            className="w-16 h-8 bg-gray-800 border border-gray-700"
                          />
                          <Input
                            type="text"
                            value={getCustomization(selectedLoader).primaryColor}
                            onChange={(e) =>
                              updateCustomization(selectedLoader, { primaryColor: e.target.value })
                            }
                            className="flex-1 bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>

                      <div className='space-y-1'>
                        <Label className="text-white">Secondary Color</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            value={getCustomization(selectedLoader).secondaryColor}
                            onChange={(e) =>
                              updateCustomization(selectedLoader, { secondaryColor: e.target.value })
                            }
                            className="w-16 h-8 bg-gray-800 border border-gray-700"
                          />
                          <Input
                            type="text"
                            value={getCustomization(selectedLoader).secondaryColor}
                            onChange={(e) =>
                              updateCustomization(selectedLoader, { secondaryColor: e.target.value })
                            }
                            className="flex-1 bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>

                      <div className='space-y-1'>
                        <Label className="text-white">Background Color</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            value={getCustomization(selectedLoader).backgroundColor}
                            onChange={(e) =>
                              updateCustomization(selectedLoader, { backgroundColor: e.target.value })
                            }
                            className="w-16 h-8 bg-gray-800 border border-gray-700"
                          />
                          <Input
                            type="text"
                            value={getCustomization(selectedLoader).backgroundColor}
                            onChange={(e) =>
                              updateCustomization(selectedLoader, { backgroundColor: e.target.value })
                            }
                            className="flex-1 bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>

                      <div className='space-y-1'>
                        <Label className="text-white">Animation Speed (seconds)</Label>
                        <Slider
                          min={0.1}
                          max={3}
                          step={0.1}
                          value={getCustomization(selectedLoader).speed}
                          onChange={(value) =>
                            updateCustomization(selectedLoader, { speed: value })
                          }
                          className="bg-gray-800"
                        />
                        <span className="text-sm text-gray-400">
                          {getCustomization(selectedLoader).speed}s
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code">
                  <div className="space-y-4 mt-4">
                    <div className="relative">
                      <div className="max-h-[400px] overflow-auto rounded-lg">
                        <SyntaxHighlighter
                          language="css"
                          style={atomDark}
                          customStyle={{
                            backgroundColor: '#1f2937',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                          }}
                          wrapLines={true}
                          wrapLongLines={true}
                        >
                          {`/* CSS */
      ${generateLoaderCSS(
        selectedCategory,
        selectedLoader,
        getCustomization(selectedLoader)
      )}

      /* HTML */
      <div class="loader-container">
        ${loaderCategories[selectedCategory][selectedLoader].html}
      </div>`}
                        </SyntaxHighlighter>
                      </div>
                      <Button
                        onClick={() =>
                          copyToClipboard(
                            `${generateLoaderCSS(
                              selectedCategory,
                              selectedLoader,
                              getCustomization(selectedLoader)
                            )}

      <div class="loader-container">
        ${loaderCategories[selectedCategory][selectedLoader].html}
      </div>`
                          )
                        }
                        className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ToolLayout>
  )
}