'use client'

import React, { useState } from 'react'
import { Cookie } from 'lucide-react'

interface CookieConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(true)

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
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Decline
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

export default CookieConsentBanner
