'use client'

import React, { useState, useEffect } from 'react'
import Slider from "@/components/ui/Slider"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/Card"
import { Smartphone, Copy, TabletSmartphone } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ShadowGenerator() {
  const [shadowColor, setShadowColor] = useState("#000000")
  const [shadowDepth, setShadowDepth] = useState(19)
  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(0)
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(14)
  const [shadowOpacity, setShadowOpacity] = useState(0.24)
  const [shadowRadius, setShadowRadius] = useState(15.38)
  const [elevation, setElevation] = useState(19)
  const [, setActiveTab] = useState("ios")

  useEffect(() => {
    setElevation(shadowDepth)
    setShadowRadius(shadowDepth * 0.81)
  }, [shadowDepth])

  // Generate shadow style based on active tab
  const getShadowStyle = () => {
    const colorHex = `${Math.round(shadowOpacity * 255).toString(16).padStart(2, '0')}`
    const shadowStyle = {
      boxShadow: `${shadowOffsetWidth}px ${shadowOffsetHeight}px ${shadowRadius}px ${shadowColor}${colorHex}`,
    }

    // Optionally, you could modify styles based on activeTab if needed
    return shadowStyle
  }

  const copyToClipboard = () => {
    const code = `
        shadowColor: "${shadowColor}",
        shadowOffset: {
          width: ${shadowOffsetWidth},
          height: ${shadowOffsetHeight},
        },
        shadowOpacity: ${shadowOpacity.toFixed(2)},
        shadowRadius: ${shadowRadius.toFixed(2)},
        elevation: ${elevation}
    `.trim()
    navigator.clipboard.writeText(code)
    toast.success('Shadow style copied to clipboard!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">React Native Shadow Generator</h1>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="ios" className="w-full" onValueChange={setActiveTab}>
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

              {/* Slider for shadow properties */}
              {[{ id: "shadowDepth", label: "Shadow Depth", value: shadowDepth, min: 0, max: 50, onChange: setShadowDepth },
                { id: "shadowOffsetWidth", label: "Shadow Offset Width", value: shadowOffsetWidth, min: -50, max: 50, onChange: setShadowOffsetWidth },
                { id: "shadowOffsetHeight", label: "Shadow Offset Height", value: shadowOffsetHeight, min: -50, max: 50, onChange: setShadowOffsetHeight },
                { id: "shadowOpacity", label: "Shadow Opacity", value: shadowOpacity, min: 0, max: 1, step: 0.01, onChange: setShadowOpacity }]
                .map((slider) => (
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
            </div>
          </CardContent>
        </Card>

        {/* Generated Code Section */}
        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">React Native Shadow Style</h3>
              <pre className="bg-gray-900 p-4 rounded text-sm text-white overflow-x-auto">
                {`shadowColor: "${shadowColor}",
shadowOffset: {
  width: ${shadowOffsetWidth},
  height: ${shadowOffsetHeight},
},
shadowOpacity: ${shadowOpacity.toFixed(2)},
shadowRadius: ${shadowRadius.toFixed(2)},
elevation: ${elevation}`}
              </pre>
              <Button onClick={copyToClipboard} className="w-full bg-blue-600 hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mt-8 mx-auto">
          <CardContent>
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-2">About React Native Shadow Generator</h2>
                <p className="text-gray-300">
                  The React Native Shadow Generator helps you create custom shadow styles for your React Native components. You can adjust various shadow properties to achieve the desired visual effect for both iOS and Android platforms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-1">
                  <li>Adjust the shadow properties using the sliders and color picker.</li>
                  <li>Preview the shadow effect in real-time for both iOS and Android.</li>
                  <li>Copy the generated code and use it in your React Native components.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-2">Tips</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>The shadow effect may appear differently on iOS and Android.</li>
                  <li>For Android, the elevation property is used to create the shadow effect.</li>
                  <li>Experiment with different values to achieve the desired visual impact for your app's UI.</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
