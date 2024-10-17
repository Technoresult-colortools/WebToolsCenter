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
            Terms and <span className="text-green-400">Conditions</span>
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileText className="mr-3 text-green-400" />
            Our Terms and Conditions
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>
              Last updated: [Date]
            </p>
            
            <p>
              Welcome to WebToolsCenter. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not use our services.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Use of Our Services</h3>
            <p>
              You must use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation</li>
              <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Intellectual Property</h3>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of WebToolsCenter and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of WebToolsCenter.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. User Accounts</h3>
            <p>
              When you create an account with us, you guarantee that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Termination</h3>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">5. Limitation of Liability</h3>
            <p>
              In no event shall WebToolsCenter, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">6. Changes to Terms</h3>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">7. Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              Email: technoresult@gmail.com<br />
              Address: 5th Main Rd, Sarakki Industrial Layout, 3rd Phase, J. P. Nagar, Bangalore, India
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}