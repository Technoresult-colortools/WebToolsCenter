'use client'

import React, { useState, useEffect } from 'react'
import Slider from "@/components/ui/Slider"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Smartphone, Copy, TabletSmartphone, Info, Lightbulb, Settings, BookOpen, Palette, Sliders, Download, RefreshCw, Upload } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Toaster, toast } from 'react-hot-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Image from 'next/image'

export default function ReactNativeShadowGenerator() {
  const [shadowColor, setShadowColor] = useState("#000000")
  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(0)
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(2)
  const [shadowOpacity, setShadowOpacity] = useState(0.25)
  const [shadowRadius, setShadowRadius] = useState(3.84)
  const [elevation, setElevation] = useState(5)
  const [androidColor, setAndroidColor] = useState("#000000")
  const [androidBackgroundColor, setAndroidBackgroundColor] = useState("#FFFFFF")
  const [activeTab, setActiveTab] = useState("ios")
  const [presetName, setPresetName] = useState("")
  const [presets, setPresets] = useState<Record<string, any>>({}) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [previewBackground, setPreviewBackground] = useState("#F0F0F0")
  const [previewShape, setPreviewShape] = useState("square")

  useEffect(() => {
    const savedPresets = localStorage.getItem('shadowPresets')
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets))
    }
  }, [])

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

  const getPreviewShapeStyle = () => {
    switch (previewShape) {
      case "circle":
        return "rounded-full"
      case "rounded":
        return "rounded-lg"
      default:
        return ""
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
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
});`
  
    // Combine `code` and `platformCode` and copy to clipboard
    navigator.clipboard.writeText(`${code}\n\n${platformCode}`)
    toast.success('Shadow style copied to clipboard!')
  }

  const savePreset = () => {
    if (presetName) {
      const newPresets = {
        ...presets,
        [presetName]: {
          shadowColor,
          shadowOffsetWidth,
          shadowOffsetHeight,
          shadowOpacity,
          shadowRadius,
          elevation,
          androidColor,
          androidBackgroundColor
        }
      }
      setPresets(newPresets)
      localStorage.setItem('shadowPresets', JSON.stringify(newPresets))
      setPresetName("")
      toast.success('Preset saved successfully!')
    } else {
      toast.error('Please enter a preset name')
    }
  }

  const loadPreset = (name: string) => {
    const preset = presets[name]
    if (preset) {
      setShadowColor(preset.shadowColor)
      setShadowOffsetWidth(preset.shadowOffsetWidth)
      setShadowOffsetHeight(preset.shadowOffsetHeight)
      setShadowOpacity(preset.shadowOpacity)
      setShadowRadius(preset.shadowRadius)
      setElevation(preset.elevation)
      setAndroidColor(preset.androidColor)
      setAndroidBackgroundColor(preset.androidBackgroundColor)
      toast.success('Preset loaded successfully!')
    }
  }

  const exportPresets = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presets))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "shadow_presets.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    toast.success('Presets exported successfully!')
  }

  const importPresets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedPresets = JSON.parse(e.target?.result as string)
          setPresets({ ...presets, ...importedPresets })
          localStorage.setItem('shadowPresets', JSON.stringify({ ...presets, ...importedPresets }))
          toast.success('Presets imported successfully!')
        } catch (error) {
          toast.error('Error importing presets. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const resetToDefaults = () => {
    if (activeTab === "ios") {
      setShadowColor("#000000")
      setShadowOffsetWidth(0)
      setShadowOffsetHeight(2)
      setShadowOpacity(0.25)
      setShadowRadius(3.84)
    } else {
      setElevation(5)
      setAndroidColor("#000000")
      setAndroidBackgroundColor("#FFFFFF")
    }
    toast.success('Reset to default values')
  }

  return (
    <ToolLayout
      title="React Native Shadow Generator"
      description="Create and Customize shadow styles for both iOS and Android in React Native"
    >
      <Toaster position="top-right" />

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
              <div className={`p-8 rounded-lg flex justify-center items-center`} style={{ backgroundColor: previewBackground }}>
                <div className={`w-32 h-32 ${getPreviewShapeStyle()}`} style={{ ...getShadowStyle(), backgroundColor: 'white' }}></div>
              </div>
            </TabsContent>
            <TabsContent value="android">
              <div className={`p-8 rounded-lg flex justify-center items-center`} style={{ backgroundColor: previewBackground }}>
                <div className={`w-32 h-32 ${getPreviewShapeStyle()}`} style={getShadowStyle()}></div>
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

            {/* Preview Customization */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="preview-bg-picker" className="text-white">Preview Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="preview-bg-input"
                    value={previewBackground}
                    onChange={(e) => setPreviewBackground(e.target.value)}
                    className="flex-grow bg-gray-700 text-white border-gray-600"
                  />
                  <input
                    id="preview-bg-picker"
                    type="color"
                    value={previewBackground}
                    onChange={(e) => setPreviewBackground(e.target.value)}
                    className="w-10 h-10 p-1 rounded"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="preview-shape" className="text-white">Preview Shape</Label>
                <Select value={previewShape} onValueChange={setPreviewShape}>
                  <SelectTrigger id="preview-shape" className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-700 text-white border-gray-600'>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
            
      {/* Generated Code Section */}
      <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">React Native Shadow Style</h3>
            <pre className="bg-gray-900 p-4 rounded text-sm text-white overflow-x-auto">
              {`import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
});`}
            </pre>
            <Button onClick={copyToClipboard} className="w-full bg-blue-600 hover:bg-blue-700">
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Presets Section */}
      <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white mb-4">Shadow Presets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Preset Name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-grow bg-gray-700 text-white border-gray-600"
            />
            <Button onClick={savePreset} className="bg-green-600 hover:bg-green-700">
              <Palette className="w-4 h-4 mr-2" />
              Save Preset
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(presets).map((name) => (
              <Button key={name} onClick={() => loadPreset(name)} className="bg-blue-600 hover:bg-blue-700">
                <Sliders className="w-4 h-4 mr-2" />
                {name}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button onClick={exportPresets} className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Export Presets
            </Button>
            <label htmlFor="import-presets" className="flex-1">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Upload className="w-4 h-4 mr-2" />
                Import Presets
              </Button>
              <input
                id="import-presets"
                type="file"
                accept=".json"
                onChange={importPresets}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Reset to Defaults Button */}
      <div className="flex justify-center mb-8">
        <Button onClick={resetToDefaults} className="bg-red-600 hover:bg-red-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* About Section */}
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About React Native Shadow Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The React Native Shadow Generator is an advanced tool designed to streamline the process of creating and customizing shadow styles for both iOS and Android platforms in React Native. It provides a user-friendly interface to visualize and adjust shadow properties, ensuring that your designs look consistent across platforms while offering powerful features for developers and designers alike.
          </p>

          <div className="my-8">
            <Image 
              src="/Images/ReactNativePreview.png?height=400&width=600"  
              alt="Screenshot of the React Native Shadow Generator interface" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Smartphone className="w-6 h-6 mr-2" />
            Platform Differences
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>iOS uses a complete shadow API with color, offset, opacity, and radius.</li>
            <li>Android simplifies shadows to a single elevation value (0-24dp).</li>
            <li>The preview may look slightly different from actual mobile rendering due to browser limitations.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Recommended Values
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Light shadow: iOS (radius: 2-3, opacity: 0.2) / Android (elevation: 2-3).</li>
            <li>Medium shadow: iOS (radius: 3-5, opacity: 0.25) / Android (elevation: 4-6).</li>
            <li>Strong shadow: iOS (radius: 6-8, opacity: 0.35) / Android (elevation: 8-12).</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Key Features of React Native Shadow Generator
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Generate shadows for both iOS and Android platforms.</li>
            <li>Customize shadow color, offset, opacity, and radius for iOS.</li>
            <li>Adjust elevation, shadow color, and background color for Android.</li>
            <li>Real-time shadow preview with customizable background and shape.</li>
            <li>Platform-specific code generation (iOS and Android).</li>
            <li>Save and load custom presets for quick access to frequently used styles.</li>
            <li>Export and import presets for easy sharing and backup.</li>
            <li>Reset to default values for quick adjustments.</li>
            <li>Instantly copy the generated React Native shadow code to clipboard.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use React Native Shadow Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Choose the platform (iOS or Android) for which you want to generate shadows.</li>
            <li>For iOS, customize the following options:</li>
            <ul className="list-disc list-inside ml-6">
              <li>Set the shadow color using the color picker or input field.</li>
              <li>Adjust the offset width and height to position the shadow.</li>
              <li>Modify the shadow opacity for transparency control.</li>
              <li>Set the shadow radius for blur effects.</li>
            </ul>
            <li>For Android, customize these options:</li>
            <ul className="list-disc list-inside ml-6">
              <li>Adjust the elevation for depth control.</li>
              <li>Set the shadow color and background color (required for Android shadows).</li>
            </ul>
            <li>Customize the preview background color and shape for better visualization.</li>
            <li>Click "Copy Code" to copy the generated React Native shadow code to your clipboard.</li>
            <li>Save custom presets for frequently used shadow styles.</li>
            <li>Use the import/export feature to share or backup your presets.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips and Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>For iOS, use lower shadow opacity for a more subtle shadow effect.</li>
            <li>On Android, always set a background color to ensure the shadow displays properly.</li>
            <li>Use the platform-specific code option to ensure consistent styling across devices.</li>
            <li>Experiment with different shadow radii and offsets to create distinct effects.</li>
            <li>Test different elevation levels on Android to achieve the desired depth.</li>
            <li>Preview shadows on various shapes to ensure they look good on different UI elements.</li>
            <li>Create and save presets for your app's design system to maintain consistency.</li>
            <li>Use the reset feature to quickly start over when experimenting with new styles.</li>
          </ul>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

