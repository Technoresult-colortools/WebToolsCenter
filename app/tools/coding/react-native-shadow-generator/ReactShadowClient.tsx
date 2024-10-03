'use client'

import React, { useState } from 'react'
import Slider from "@/components/ui/Slider"
import { Label } from "@/components/ui/label"
import  Input  from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/Card"
import { Smartphone, Copy, TabletSmartphone, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ShadowGenerator() {
  const [shadowColor, setShadowColor] = useState("#000000")
  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(0)
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(2)
  const [shadowOpacity, setShadowOpacity] = useState(0.25)
  const [shadowRadius, setShadowRadius] = useState(3.84)
  const [elevation, setElevation] = useState(5)
  const [androidColor, setAndroidColor] = useState("#000000")
  const [androidBackgroundColor, setAndroidBackgroundColor] = useState("#FFFFFF")
  const [activeTab, setActiveTab] = useState("ios")

  // Get the CSS shadow style for preview
  const getShadowStyle = () => {
    if (activeTab === "android") {
      return {
        boxShadow: `0px ${elevation * 0.5}px ${elevation * 1.5}px ${androidColor}${Math.round(0.3 * 255).toString(16).padStart(2, '0')}`,
        backgroundColor: androidBackgroundColor
      }
    } else {
      const colorHex = `${Math.round(shadowOpacity * 255).toString(16).padStart(2, '0')}`
      return {
        boxShadow: `${shadowOffsetWidth}px ${shadowOffsetHeight}px ${shadowRadius}px ${shadowColor}${colorHex}`
      }
    }
  }

  const copyToClipboard = () => {
    let code = ''
    
    if (activeTab === "ios") {
      code = `// iOS Shadow Style
  {
    shadowColor: "${shadowColor}",
    shadowOffset: {
      width: ${shadowOffsetWidth},
      height: ${shadowOffsetHeight}
    },
    shadowOpacity: ${shadowOpacity.toFixed(2)},
    shadowRadius: ${shadowRadius.toFixed(2)}
  }`
    } else {
      code = `// Android Shadow Style
  {
    elevation: ${elevation},
    shadowColor: "${androidColor}",
    backgroundColor: "${androidBackgroundColor}", // Required for Android shadows
    overflow: "hidden", // Recommended for Android to clip shadow properly
  }`
    }
  
    // Add Platform-specific implementation
    const platformCode = `// Cross-platform shadow implementation
  import { Platform } from 'react-native';
  
  const styles = {
    shadowBox: {
      backgroundColor: "${androidBackgroundColor}", // Required for Android
      ...Platform.select({
        ios: {
          shadowColor: "${shadowColor}",
          shadowOffset: {
            width: ${shadowOffsetWidth},
            height: ${shadowOffsetHeight}
          },
          shadowOpacity: ${shadowOpacity.toFixed(2)},
          shadowRadius: ${shadowRadius.toFixed(2)}
        },
        android: {
          elevation: ${elevation},
          shadowColor: "${androidColor}",
          overflow: "hidden"
        }
      })
    }
  }`
  
    // Combine `code` and `platformCode` and copy to clipboard
    navigator.clipboard.writeText(`${code}\n\n${platformCode}`);
    toast.success('Shadow style copied to clipboard!');
  }
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">React Native Shadow Generator</h1>

        {/* Preview Card */}
        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="ios" className="w-full" onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="ios">
                  <Smartphone className="w-4 h-4 mr-2" />
                  iOS
                </TabsTrigger>
                <TabsTrigger value="android">
                  <TabletSmartphone className="w-4 h-4 mr-2" />
                  Android
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ios">
                <div className="bg-gray-200 p-8 rounded-lg flex justify-center items-center">
                  <div className="w-32 h-32 bg-white rounded-lg" style={getShadowStyle()}></div>
                </div>
              </TabsContent>
              <TabsContent value="android">
                <div className="bg-gray-200 p-8 rounded-lg flex justify-center items-center">
                  <div className="w-32 h-32 bg-white rounded-lg" style={getShadowStyle()}></div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Shadow Properties Form */}
        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              {activeTab === "ios" ? (
                <>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="color-picker" className="text-white">Shadow Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="color-input"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                      <input
                        id="color-picker"
                        type="color"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="w-10 h-10 p-1 rounded"
                      />
                    </div>
                  </div>

                  {/* iOS Shadow Properties */}
                  {[
                    { id: "shadowOffsetWidth", label: "Offset Width", value: shadowOffsetWidth, min: -20, max: 20, onChange: setShadowOffsetWidth },
                    { id: "shadowOffsetHeight", label: "Offset Height", value: shadowOffsetHeight, min: -20, max: 20, onChange: setShadowOffsetHeight },
                    { id: "shadowOpacity", label: "Opacity", value: shadowOpacity, min: 0, max: 1, step: 0.01, onChange: setShadowOpacity },
                    { id: "shadowRadius", label: "Blur Radius", value: shadowRadius, min: 0, max: 20, step: 0.1, onChange: setShadowRadius }
                  ].map((slider) => (
                    <div key={slider.id} className="space-y-2">
                      <Label htmlFor={slider.id} className="text-white">{slider.label}: {slider.value.toFixed(2)}</Label>
                      <Slider
                        id={slider.id}
                        min={slider.min}
                        max={slider.max}
                        step={slider.step || 1}
                        value={slider.value}
                        onChange={(value) => slider.onChange(value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {/* Android Elevation */}
                  <div className="space-y-2">
                    <Label htmlFor="elevation" className="text-white">Elevation: {elevation}</Label>
                    <Slider
                      id="elevation"
                      min={0}
                      max={24}
                      step={1}
                      value={elevation}
                      onChange={(value) => setElevation(value)}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-400 mt-2 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      Android elevation ranges from 0 to 24dp
                    </p>
                  </div>

                  {/* Android Shadow Color */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="android-color-picker" className="text-white">Shadow Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="android-color-input"
                        value={androidColor}
                        onChange={(e) => setAndroidColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                      <input
                        id="android-color-picker"
                        type="color"
                        value={androidColor}
                        onChange={(e) => setAndroidColor(e.target.value)}
                        className="w-10 h-10 p-1 rounded"
                      />
                    </div>
                  </div>

                  {/* Android Background Color */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="android-bg-picker" className="text-white">Background Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="android-bg-input"
                        value={androidBackgroundColor}
                        onChange={(e) => setAndroidBackgroundColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                      <input
                        id="android-bg-picker"
                        type="color"
                        value={androidBackgroundColor}
                        onChange={(e) => setAndroidBackgroundColor(e.target.value)}
                        className="w-10 h-10 p-1 rounded"
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      Background color is required for Android shadows to work
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
          
        {/* Generated Code Section */}
        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">React Native Shadow Style</h3>
              <pre className="bg-gray-900 p-4 rounded text-sm text-white overflow-x-auto">
                {`import { Platform } from 'react-native';

const styles = {
  shadowBox: {
    ...Platform.select({
      ios: {
        shadowColor: "${shadowColor}",
        shadowOffset: {
          width: ${shadowOffsetWidth},
          height: ${shadowOffsetHeight}
        },
        shadowOpacity: ${shadowOpacity.toFixed(2)},
        shadowRadius: ${shadowRadius.toFixed(2)}
      },
      android: {
        elevation: ${elevation}
      }
    })
  }
}`}
              </pre>
              <Button onClick={copyToClipboard} className="w-full bg-blue-600 hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">About React Native Shadow Generator</h2>
            <p className="text-gray-300">
              The <strong>React Native Shadow Generator</strong> is a tool designed to streamline the process of creating and customizing shadow styles for both iOS and Android in React Native. It provides a user-friendly interface to visualize and adjust shadow properties, ensuring that your designs look consistent across platforms.
            </p>
          </section>
          <section className='mb-6'>
                <h2 className="text-xl font-semibold text-white mb-2">Platform Differences</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>iOS uses a complete shadow API with color, offset, opacity, and radius</li>
                  <li>Android simplifies shadows to a single elevation value (0-24dp)</li>
                  <li>The preview may look slightly different from actual mobile rendering</li>
                </ul>
              </section>

              <section className='mb-6'>
                <h2 className="text-xl font-semibold text-white mb-2">Recommended Values</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Light shadow: iOS (radius: 2-3, opacity: 0.2) / Android (elevation: 2-3)</li>
                  <li>Medium shadow: iOS (radius: 3-5, opacity: 0.25) / Android (elevation: 4-6)</li>
                  <li>Strong shadow: iOS (radius: 6-8, opacity: 0.35) / Android (elevation: 8-12)</li>
                </ul>
              </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Key Features of React Native Shadow Generator</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Generate shadows for both iOS and Android platforms.</li>
              <li>Customize shadow color, offset, opacity, and radius for iOS.</li>
              <li>Adjust elevation, shadow color, and background color for Android.</li>
              <li>Real-time shadow preview for accurate visual representation.</li>
              <li>Platform-specific code generation (iOS and Android).</li>
              <li>Instantly copy the generated React Native shadow code to clipboard.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">How to Use React Native Shadow Generator?</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Choose the platform (iOS or Android) for which you want to generate shadows.</li>
              <li>For iOS, customize the following options:</li>
              <ul className="list-disc list-inside text-gray-300 ml-8">
                <li>Set the shadow color using the color picker or input field.</li>
                <li>Adjust the offset width and height to position the shadow.</li>
                <li>Modify the shadow opacity for transparency control.</li>
                <li>Set the shadow radius for blur effects.</li>
              </ul>
              <li>For Android, customize these options:</li>
              <ul className="list-disc list-inside text-gray-300 ml-8">
                <li>Adjust the elevation for depth control.</li>
                <li>Set the shadow color and background color (required for Android shadows).</li>
              </ul>
              <li>Preview the shadow on the mockup device to see real-time changes.</li>
              <li>Click "Copy Code" to copy the generated React Native shadow code to your clipboard.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">Tips and Tricks</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>For iOS, use lower shadow opacity for a more subtle shadow effect.</li>
              <li>On Android, always set a background color to ensure the shadow displays properly.</li>
              <li>Use the platform-specific code option to ensure consistent styling across devices.</li>
              <li>Experiment with different shadow radii and offsets to create distinct effects.</li>
              <li>Test different elevation levels on Android to achieve the desired depth.</li>
              <li>Preview shadows on various devices to ensure they look good across all screen sizes.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}