'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2,
  Share2,
  Grid,
  Info,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent } from "@/components/ui/Card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Popover } from  "@/components/ui/popover"

interface DisplayMetrics {
  physicalWidth: number
  physicalHeight: number
  logicalWidth: number
  logicalHeight: number
  availWidth: number
  availHeight: number
  pixelRatio: number
  colorDepth: number
  colorGamut: string
  orientation: string
  deviceType: string
  aspectRatio: string
  scalingFactor: number
  refreshRate: number
  monitors: number
  currentMonitor: number
  touchPoints: number
  hdrCapable: boolean
  preferredColorScheme: string
  reducedMotion: boolean
  standardWidth: number
  standardHeight: number
  roundedAvailWidth: number
  roundedAvailHeight: number
}

const initialMetrics: DisplayMetrics = {
  physicalWidth: 0,
  physicalHeight: 0,
  logicalWidth: 0,
  logicalHeight: 0,
  availWidth: 0,
  availHeight: 0,
  pixelRatio: 1,
  colorDepth: 0,
  colorGamut: '',
  orientation: '',
  deviceType: '',
  aspectRatio: '',
  scalingFactor: 100,
  refreshRate: 0,
  monitors: 1,
  currentMonitor: 1,
  touchPoints: 0,
  hdrCapable: false,
  preferredColorScheme: 'light',
  reducedMotion: false,
  standardWidth: 0,
  standardHeight: 0,
  roundedAvailWidth: 0,
  roundedAvailHeight: 0
}

export default function AdvancedScreenChecker() {
  const [metrics, setMetrics] = useState<DisplayMetrics>(initialMetrics)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [copied, setCopied] = useState(false)

  const detectHDRCapability = async (): Promise<boolean> => {
    if (window.matchMedia('(dynamic-range: high)').matches) return true
    try {
      const support = await (window.screen as any).isHDRAvailable
      return !!support
    } catch {
      return false
    }
  }

  const getStandardResolution = (width: number, height: number): { width: number, height: number } => {
    const standardResolutions = [
      { width: 7680, height: 4320 }, // 8K
      { width: 3840, height: 2160 }, // 4K UHD
      { width: 2560, height: 1440 }, // 2K QHD
      { width: 1920, height: 1080 }, // Full HD
      { width: 1680, height: 1050 }, // WSXGA+
      { width: 1600, height: 900 },  // HD+
      { width: 1440, height: 900 },  // WXGA+
      { width: 1366, height: 768 },  // HD
      { width: 1280, height: 720 },  // HD
      { width: 1024, height: 768 },  // XGA
    ]

    // Find the closest standard resolution
    const closest = standardResolutions.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.width - width) + Math.abs(prev.height - height)
      const currDiff = Math.abs(curr.width - width) + Math.abs(curr.height - height)
      return currDiff < prevDiff ? curr : prev
    })

    return closest
  }

  const detectTouchPoints = (): number => {
    return navigator.maxTouchPoints || 0
  }

  const calculateTotalPixels = (width: number, height: number): string => {
    const total = (width * height) / 1000000
    return total.toFixed(4)
  }

  const detectPreferences = () => {
    return {
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }

  const calculateDisplayMetrics = async () => {
    const screen = window.screen
    const dpr = window.devicePixelRatio || 1
  
    const availWidth = screen.availWidth
    const availHeight = screen.availHeight
  
    const standardRes = getStandardResolution(availWidth, availHeight)
    
    const prefs = detectPreferences()
    const hdrCapable = await detectHDRCapability()
    
    setMetrics({
      standardWidth: standardRes.width,
      standardHeight: standardRes.height,
      physicalWidth: screen.width * dpr,
      physicalHeight: screen.height * dpr,
      logicalWidth: window.innerWidth,
      logicalHeight: window.innerHeight,
      availWidth,
      availHeight,
      roundedAvailWidth: standardRes.width,
      roundedAvailHeight: standardRes.height,
      pixelRatio: dpr,
      colorDepth: screen.colorDepth,
      colorGamut: detectColorGamut(),
      orientation: screen.orientation?.type || 'unknown',
      deviceType: detectDeviceType(),
      aspectRatio: calculateAspectRatio(standardRes.width, standardRes.height),
      scalingFactor: Math.round(dpr * 100),
      refreshRate: await detectRefreshRate(),
      monitors: await detectMonitorCount(),
      currentMonitor: getCurrentMonitor(),
      touchPoints: detectTouchPoints(),
      hdrCapable,
      preferredColorScheme: prefs.colorScheme,
      reducedMotion: prefs.reducedMotion
    })
  }

  const detectRefreshRate = async (): Promise<number> => {
    if ('getScreenDetails' in window) {
      try {
        const screenDetails = await (window as any).getScreenDetails()
        const rate = screenDetails.currentScreen.refreshRate
        if (rate && rate > 0) return Math.round(rate)
      } catch {
        // Fallback to other methods
      }
    }
    
    return new Promise(resolve => {
      let frames = 0
      let prevTime = performance.now()

      function count(time: number) {
        frames++
        if (time - prevTime >= 1000) {
          resolve(Math.round(frames))
        } else {
          requestAnimationFrame(count)
        }
      }

      requestAnimationFrame(count)
    })
  }

  const detectMonitorCount = async (): Promise<number> => {
    if ('getScreenDetails' in window) {
      try {
        const screenDetails = await (window as any).getScreenDetails()
        return screenDetails.screens.length
      } catch {
        return estimateMonitorCount()
      }
    }
    return estimateMonitorCount()
  }

  const estimateMonitorCount = (): number => {
    const totalWidth = window.screen.availWidth
    const primaryWidth = window.screen.width
    return Math.max(1, Math.round(totalWidth / primaryWidth))
  }

  const getCurrentMonitor = (): number => {
    const screenLeft = window.screenLeft || (window as any).screenX
    const screenWidth = window.screen.width
    return Math.max(1, Math.floor(screenLeft / screenWidth) + 1)
  }

  const detectColorGamut = (): string => {
    if (window.matchMedia('(color-gamut: rec2020)').matches) return 'Rec. 2020'
    if (window.matchMedia('(color-gamut: p3)').matches) return 'Display P3'
    if (window.matchMedia('(color-gamut: srgb)').matches) return 'sRGB'
    return 'Standard'
  }

  const detectDeviceType = (): string => {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet'
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile'
    }
    return 'Desktop'
  }

  const calculateAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
    const divisor = gcd(width, height)
    return `${width/divisor}:${height/divisor}`
  }

  const getDeviceIcon = () => {
    const icons = {
      Mobile: <Smartphone className="w-8 h-8 text-blue-500" />,
      Tablet: <Tablet className="w-8 h-8 text-green-500" />,
      Desktop: metrics.physicalWidth > 1440 ? 
        <Monitor className="w-8 h-8 text-purple-500" /> : 
        <Laptop className="w-8 h-8 text-yellow-500" />
    }
    return icons[metrics.deviceType as keyof typeof icons] || icons.Desktop
  }

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyDetails = () => {
    const info = Object.entries(metrics)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    copyToClipboard(info)
  }

  const shareToSocialMedia = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const text = `Check out my screen information: ${metrics.roundedAvailWidth}x${metrics.roundedAvailHeight}, ${metrics.deviceType}, ${metrics.colorGamut} color gamut`
    const url = encodeURIComponent(window.location.href)
    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(text)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent('My Screen Information')}&summary=${encodeURIComponent(text)}`
        break
    }

    window.open(shareUrl, '_blank')
  }

  useEffect(() => {
    const handleResize = () => {
      calculateDisplayMetrics()
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      calculateDisplayMetrics()
    }

    calculateDisplayMetrics()

    window.addEventListener('resize', handleResize)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <ToolLayout
      title="Screen Resolution Checker"
      description="Analyze your screen properties and display capabilities"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-8">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* First Column */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="bg-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    {getDeviceIcon()}
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              onClick={() => setShowGrid(!showGrid)}
                              variant="outline"
                              size="sm"
                            >
                              <Grid className={showGrid ? "text-green-500" : "text-gray-500"} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Toggle Pixel Grid
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button onClick={toggleFullscreen} variant="outline" size="sm">
                        <Maximize2 className="mr-2" size={16} />
                        {isFullscreen ? 'Exit' : 'Fullscreen'}
                      </Button>

                      <Button onClick={() => calculateDisplayMetrics()} variant="outline" size="sm">
                        <RefreshCw className="mr-2" size={16} />
                        Refresh
                      </Button>
                    </div>
                  </div>

                  {/* Resolution Display */}
                  <div className="mb-8 text-center p-8 border-2 border-gray-700 rounded-xl">
                    <h2 className="text-4xl font-bold mb-6">
                      {metrics.roundedAvailWidth} × {metrics.roundedAvailHeight}
                    </h2>
                    <div className="space-y-2 text-lg">
                      <p>
                        Available Resolution: <span className="font-semibold text-blue-400">{metrics.availWidth} × {metrics.availHeight}</span>
                      </p>
                      <p>
                        Standard Resolution: <span className="font-semibold text-gray-400">{metrics.standardWidth} × {metrics.standardHeight}</span>
                      </p>
                      <p className="text-xl mt-4">
                        Total pixels on your screen is{' '}
                        <span className="font-semibold text-green-400">
                          {calculateTotalPixels(metrics.roundedAvailWidth, metrics.roundedAvailHeight)} million
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Display Resolution</h3>
                      <ul className="space-y-2">
                        <li>Rounded: {metrics.roundedAvailWidth} × {metrics.roundedAvailHeight}</li>
                        <li>Available: {metrics.availWidth} × {metrics.availHeight}</li>
                        <li>Aspect Ratio: {metrics.aspectRatio}</li>
                        <li>Pixel Density: {metrics.pixelRatio.toFixed(2)}x</li>
                        <li>Refresh Rate: {metrics.refreshRate}Hz</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Logical Display</h3>
                      <ul className="space-y-2">
                        <li>Window: {metrics.logicalWidth} × {metrics.logicalHeight}</li>
                        <li>Physical: {metrics.physicalWidth} × {metrics.physicalHeight}</li>
                        <li>Scaling: {metrics.scalingFactor}%</li>
                        <li>Touch Points: {metrics.touchPoints}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Color Properties</h3>
                      <ul className="space-y-2">
                        <li>Depth: {metrics.colorDepth}-bit</li>
                        <li>Gamut: {metrics.colorGamut}</li>
                        <li>Scheme: {metrics.preferredColorScheme}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">System Info</h3>
                      <ul className="space-y-2">
                        <li>Device: {metrics.deviceType}</li>
                        <li>Monitors: {metrics.currentMonitor} of {metrics.monitors}</li>
                        <li>Reduced Motion: {metrics.reducedMotion ? 'Yes' : 'No'}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-6">
                    <Button onClick={handleCopyDetails} className="flex-1">
                      {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                      {copied ? 'Copied!' : 'Copy Details'}
                    </Button>
                    <Popover
                      trigger={
                        <Button variant="outline" className="flex-1">
                          <Share2 size={16} className="mr-2" />
                          Share
                        </Button>
                      }
                      content={
                        <div className="grid gap-4">
                          <div className="flex items-center gap-4">
                            <Button onClick={() => shareToSocialMedia('facebook')} variant="outline" size="sm">
                              <Facebook className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => shareToSocialMedia('twitter')} variant="outline" size="sm">
                              <Twitter className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => shareToSocialMedia('linkedin')} variant="outline" size="sm">
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Column */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="bg-gray-800 text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Visual Display</h3>
                  
                  <div className="relative mb-6 border-2 border-gray-600 rounded-lg overflow-hidden">
                    <div
                      className="relative mx-auto bg-gray-700 p-4 aspect-video w-full"
                      style={{
                        backgroundImage: showGrid ? 
                          'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)' : 
                          'none',
                        backgroundSize: showGrid ? '8px 8px' : 'auto'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold mb-2">{metrics.roundedAvailWidth} × {metrics.roundedAvailHeight}</p>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                            <span>{metrics.aspectRatio} aspect ratio</span>
                            <ArrowRight className="w-4 h-4" />
                            <span>{calculateTotalPixels(metrics.roundedAvailWidth, metrics.roundedAvailHeight)}M pixels</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display Information Alerts */}
                  <div className="space-y-2">
                    {metrics.hdrCapable && (
                      <Alert>
                        <AlertDescription>
                          HDR is available on this display
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {metrics.pixelRatio !== 1 && (
                      <Alert>
                        <AlertDescription>
                          Display scaling is set to {metrics.scalingFactor}%
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {metrics.touchPoints > 0 && (
                      <Alert>
                        <AlertDescription>
                          Touch input available with {metrics.touchPoints} touch points
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {metrics.monitors > 1 && (
                      <Alert>
                        <AlertDescription>
                          Multi-monitor setup detected ({metrics.monitors} displays)
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is Screen Resolution Checker?
        </h2>
        <p className="text-gray-300 mb-4">
          The Screen Resolution Checker is a comprehensive tool designed to provide detailed information about your display and device capabilities. It offers insights into physical and logical display properties, color characteristics, and system information, making it invaluable for developers, designers, and tech enthusiasts.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Screen Resolution Checker?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Open the tool on the device you want to analyze.</li>
          <li>View the comprehensive display information in the main panel.</li>
          <li>Use the "Refresh" button to update the information if needed.</li>
          <li>Toggle the pixel grid for a visual representation of your display.</li>
          <li>Enter fullscreen mode for a more accurate analysis.</li>
          <li>Copy all screen details to your clipboard with one click.</li>
          <li>Share your screen information on social media platforms.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features:
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Detailed physical and logical display information</li>
          <li>Color depth and gamut detection</li>
          <li>Device type identification</li>
          <li>Multi-monitor support</li>
          <li>HDR capability detection</li>
          <li>Refresh rate measurement</li>
          <li>Touch input detection</li>
          <li>Pixel density calculation</li>
          <li>Visual display representation with adjustable grid</li>
          <li>One-click copy of all screen information</li>
          <li>Fullscreen mode for accurate measurements</li>
          <li>Social media sharing functionality</li>
          <li>Responsive design for use on any device</li>
        </ul>
      </div>
    </ToolLayout>
  )
}