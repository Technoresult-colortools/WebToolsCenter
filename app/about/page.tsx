'use client'
import React, { useState, useEffect } from 'react'
import { ChevronRight, Star, Command, Wrench, Zap, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const features = [
  {
    icon: <Command className="w-8 h-8 text-blue-400" />,
    title: "All-in-One Solution",
    description: "Access a comprehensive suite of web development tools in one place."
  },
  {
    icon: <Wrench className="w-8 h-8 text-green-400" />,
    title: "User-Friendly Interface",
    description: "Intuitive design makes our tools accessible to everyone."
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    title: "Lightning Fast",
    description: "Optimized performance for quick and efficient results."
  }
]

export default function AboutUs() {
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
            About Web<span className="text-blue-400">Tools</span>Center
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Empowering developers and designers with powerful, easy-to-use web tools.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Our Mission</h2>
          <p className="text-lg text-gray-400 mb-8">
            At WebToolsCenter, our mission is to simplify web development and design processes by providing a comprehensive suite of tools that cater to developers, designers, and content creators of all skill levels. We believe that powerful tools should be accessible to everyone, which is why we've created an intuitive platform that combines functionality with ease of use.
          </p>
          <p className="text-lg text-gray-400">
            Whether you're a seasoned professional or just starting your journey in web development, our tools are designed to enhance your productivity, streamline your workflow, and bring your creative visions to life.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center justify-center">
            <Star className="mr-3 text-yellow-400" />
            Why Choose WebToolsCenter?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Our Story</h2>
          <p className="text-lg text-gray-400 mb-8">
            WebToolsCenter was born out of a simple idea: to create a single platform where web professionals could find all the tools they need. Our founders, experienced developers themselves, recognized the need for a centralized hub of efficient, user-friendly web tools.
          </p>
          <p className="text-lg text-gray-400 mb-8">
            What started as a small collection of utilities has grown into a comprehensive toolkit, constantly evolving to meet the changing needs of the web development community. Today, we're proud to offer over 80 tools across various categories, from text and image manipulation to advanced coding utilities and design helpers.
          </p>
          <p className="text-lg text-gray-400">
            Our commitment to quality, usability, and innovation drives us to continually improve and expand our offerings, ensuring that WebToolsCenter remains at the forefront of web development resources.
          </p>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Join Our Community</h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Become part of the WebToolsCenter community today. Explore our tools, enhance your projects, and connect with fellow web enthusiasts.
          </p>
          <Link href="/categories" passHref>
            <button className="inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity duration-300">
              Explore Our Tools
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}