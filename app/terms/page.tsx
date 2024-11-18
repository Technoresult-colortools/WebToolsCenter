'use client'
import React, { useState, useEffect } from 'react'
import { FileText, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsAndConditionsPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10" />
        <div 
          className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Terms of <span className="text-green-400">Service</span>
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Please read these terms carefully before using our tools.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileText className="mr-3 text-green-400" />
            Terms of Service
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>Last updated: November 18, 2024</p>
            
            <p>
              Welcome to WebToolsCenter. By accessing our website, you agree to these terms of service. Please read them carefully.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Services</h3>
            <p>
              WebToolsCenter provides various online tools for text manipulation, image processing, CSS generation, coding utilities, color tools, and social media tools. All tools operate client-side within your browser.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Use License</h3>
            <p>
              Our tools are provided free of charge for personal and commercial use, subject to these terms. You agree to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Use the services legally and responsibly</li>
              <li>Not attempt to bypass any technical limitations</li>
              <li>Not use the services to process illegal or harmful content</li>
              <li>Not redistribute our tools or claim them as your own</li>
              <li>Accept our use of cookies as described in our Cookie Policy</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. No Warranties</h3>
            <p>
              Our services are provided "as is" without any warranties. While we strive for accuracy, we cannot guarantee:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Uninterrupted service availability</li>
              <li>Complete accuracy of results</li>
              <li>Suitability for any particular purpose</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Limitation of Liability</h3>
            <p>
              WebToolsCenter shall not be liable for any damages arising from the use of our services. Since all processing occurs client-side, you are responsible for:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Backing up your data before processing</li>
              <li>Verifying results for your specific needs</li>
              <li>Ensuring compliance with applicable laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">5. Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">6. Contact</h3>
            <p>
              For questions about these terms, please contact:
            </p>
            <p className="mt-2">
              Email: technoresult@gmail.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}