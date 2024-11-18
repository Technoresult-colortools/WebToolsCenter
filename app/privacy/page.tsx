'use client'
import React, { useState, useEffect } from 'react'
import { Shield, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPolicyPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
            Privacy<span className="text-blue-400">Policy</span>
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Your privacy is important to us. All processing happens in your browser.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="mr-3 text-blue-400" />
            Privacy Statement
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>Last updated: November 18, 2024</p>
            
            <p>
              WebToolsCenter is committed to protecting your privacy. This Privacy Policy explains our data practices.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">No Data Collection</h3>
            <p>
              WebToolsCenter operates as a client-side application, which means:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>All tools and operations run directly in your browser</li>
              <li>We do not collect, store, or process any of your personal data</li>
              <li>Files and content you process using our tools remain on your device</li>
              <li>We do not use cookies or tracking mechanisms</li>
              <li>We do not require user accounts or registration</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Tools We Offer</h3>
            <p>
              Our website provides various online utilities including text tools, image tools, CSS tools, coding tools, color tools, and social media tools. All these tools operate entirely within your browser, ensuring your data never leaves your device.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Third-Party Services</h3>
            <p>
              Our website may use basic third-party services for:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Content delivery networks (CDN) to serve static assets</li>
              <li>Analytics to understand site usage patterns (if implemented in the future, we will update this policy)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Cookies and Local Storage</h3>
            <p>
              Our website uses cookies and local storage to enhance your experience:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Essential cookies for website functionality</li>
              <li>Analytical cookies to understand site usage (if implemented)</li>
              <li>Functional cookies to remember your preferences</li>
            </ul>
            <p className="mt-4">
              You can control cookie preferences through your browser settings. For more information, please see our <a href="/cookies" className="text-blue-400 hover:underline">Cookie Policy</a>.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Changes to This Policy</h3>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, you can contact us:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>By email: technoresult@gmail.com</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}