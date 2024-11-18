'use client'

import React, { useState, useEffect } from 'react'
import { CookieIcon, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsentBanner from '@/components/CookieConsentBanner'

const CookiesPolicyPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    setIsVisible(true)
    const date = new Date()
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    setFormattedDate(formatted)
  }, [])

  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
  }

  const handleCookieDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div 
          className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Cookies<span className="text-blue-400">Policy</span>
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Understanding how we use cookies to improve your experience.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <CookieIcon className="mr-3 text-blue-400" />
            Our Cookie Policy
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>Last updated: {formattedDate}</p>
            
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">What Are Cookies?</h3>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us make your experience better by remembering your preferences and providing essential features.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Types of Cookies We Use</h3>
            <ul className="list-disc list-inside ml-4 space-y-4">
              <li>
                <strong className="text-white">Essential Cookies</strong>
                <p className="mt-2">These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</p>
              </li>
              <li>
                <strong className="text-white">Analytical Cookies</strong>
                <p className="mt-2">We use analytical cookies to understand how visitors interact with our website. This helps us improve our website's functionality and user experience.</p>
              </li>
              <li>
                <strong className="text-white">Functional Cookies</strong>
                <p className="mt-2">These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced features.</p>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Managing Your Cookie Preferences</h3>
            <p>
              You can control and/or delete cookies as you wish through your browser settings. You can delete all existing cookies and block new ones from being placed. However, please note that some website features may not work properly if you disable cookies.
            </p>

            <h4 className="text-lg font-semibold text-white mt-4 mb-2">Browser Settings</h4>
            <p>You can manage cookies through the following browsers:</p>
            <ul className="list-disc list-inside ml-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Microsoft Edge</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Your Consent</h3>
            <p>
              When you first visit our website, we will ask for your consent to use cookies. You can choose to accept all cookies or customize your preferences. You can change your choices at any time through our cookie settings.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Updates to This Policy</h3>
            <p>
              We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Contact Us</h3>
            <p>
              If you have any questions about our Cookies Policy, you can contact us:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>By email: technoresult@gmail.com</li>
              <li>By visiting this page on our website: <a href="https://webtoolscenter.com/contact" className="text-blue-400 hover:underline">https://webtoolscenter.com/contact</a></li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner 
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />
    </div>
  )
}

export default CookiesPolicyPage