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
            We are committed to protecting your privacy and personal information.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="mr-3 text-blue-400" />
            Our Privacy Commitment
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>Last updated: October 17, 2024</p>
            
            <p>
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
            </p>

            <p>
              We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Interpretation and Definitions</h3>
            <h4 className="text-lg font-semibold text-white mt-4 mb-2">Interpretation</h4>
            <p>
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h4 className="text-lg font-semibold text-white mt-4 mb-2">Definitions</h4>
            <p>For the purposes of this Privacy Policy:</p>
            <ul className="list-disc list-inside ml-4">
              <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to WebToolsCenter.</li>
              <li><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
              <li><strong>Country</strong> refers to: Karnataka, India</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
              <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Website</strong> refers to WebToolsCenter, accessible from <a href="https://webtoolscenter.com/" className="text-blue-400 hover:underline">https://webtoolscenter.com/</a></li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Collecting and Using Your Personal Data</h3>
            <h4 className="text-lg font-semibold text-white mt-4 mb-2">Types of Data Collected</h4>
            <h5 className="text-base font-semibold text-white mt-2 mb-1">Personal Data</h5>
            <p>
              While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Email address</li>
              <li>Usage Data</li>
            </ul>

            <h5 className="text-base font-semibold text-white mt-4 mb-1">Usage Data</h5>
            <p>
              Usage Data is collected automatically when using the Service. It may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>

            {/* Add more sections here following the same pattern */}

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, You can contact us:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>By email: technoresult@gmail.com</li>
              <li>By visiting this page on our website: <a href="https://webtoolscenter.com/contact" className="text-blue-400 hover:underline">https://webtoolscenter.com/contact</a></li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}