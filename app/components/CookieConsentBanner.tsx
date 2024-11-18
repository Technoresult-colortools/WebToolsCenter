'use client'

import React, { useState, useEffect } from 'react'
import { Cookie } from 'lucide-react'

interface ClientCookieBannerProps {
  onAccept: () => void
  onDecline: () => void
}

const ClientCookieBanner: React.FC<ClientCookieBannerProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if we already have a cookie consent in localStorage
    const cookieConsent = localStorage.getItem('cookieConsent')
    // Only show the banner if there's no existing consent
    setIsVisible(!cookieConsent)
  }, [])

  const handleAccept = () => {
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm text-white p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Cookie className="w-6 h-6 text-blue-400" />
          <p className="text-sm">
            We use essential cookies to analyze basic site usage and improve our services. Accept all cookies to enable enhanced features and personalized content. 
            <a href="/cookies" className="ml-1 text-blue-400 hover:underline">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientCookieBanner