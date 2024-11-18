'use client'
import React, { useState, useEffect } from 'react'
import { Accessibility, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AccessibilityPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
        <div 
          className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <span className="text-purple-400">Accessibility</span>
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Making our tools accessible to everyone
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Accessibility className="mr-3 text-purple-400" />
            Our Commitment to Accessibility
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>
              WebToolsCenter is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Accessibility Features</h3>
            <ul className="list-disc list-inside ml-4 space-y-4">
              <li>
                <strong className="text-white">Keyboard Navigation</strong>
                <p className="mt-2">All features and tools are accessible via keyboard navigation. Use Tab to navigate between elements and Enter to activate buttons and controls.</p>
              </li>
              <li>
                <strong className="text-white">Screen Readers</strong>
                <p className="mt-2">Our website is compatible with screen readers and includes proper ARIA labels and semantic HTML.</p>
              </li>
              <li>
                <strong className="text-white">Text Contrast</strong>
                <p className="mt-2">We maintain high contrast ratios between text and background colors to ensure readability.</p>
              </li>
              <li>
                <strong className="text-white">Responsive Design</strong>
                <p className="mt-2">Our tools adapt to different screen sizes and support zoom up to 200% without loss of functionality.</p>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Keyboard Shortcuts</h3>
            <p>Common keyboard shortcuts available across our tools:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Tab: Navigate between interactive elements</li>
              <li>Shift + Tab: Navigate backward</li>
              <li>Enter/Space: Activate buttons and controls</li>
              <li>Escape: Close modals or cancel operations</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Standards Compliance</h3>
            <p>
              We strive to meet WCAG 2.1 Level AA standards and follow best practices for web accessibility, including:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Proper heading structure</li>
              <li>Alternative text for images</li>
              <li>Clear focus indicators</li>
              <li>Consistent navigation</li>
              <li>Error identification and suggestions</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Feedback and Support</h3>
            <p>
              We welcome your feedback on the accessibility of WebToolsCenter. Please let us know if you encounter accessibility barriers:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Email: technoresult@gmail.com</li>
              <li>We aim to respond to feedback within 2 business days</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Continuous Improvement</h3>
            <p>
              We are constantly working to improve the accessibility of our tools and welcome any suggestions for improvements. Our development team regularly reviews the site for accessibility issues and implements updates.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}