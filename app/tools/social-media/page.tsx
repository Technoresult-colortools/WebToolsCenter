'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Sparkles, Star } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInstagram, 
  faTwitter, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';

const socialMediaTools = [
  { 
    name: 'Instagram Filters', 
    href: '/tools/social-media/instagram-filters', 
    icon: faInstagram, 
    gradient: 'from-pink-500 to-yellow-500' 
  },
  { 
    name: 'Instagram Post Generator', 
    href: '/tools/social-media/instagram-post-generator', 
    icon: faInstagram, 
    gradient: 'from-purple-500 to-pink-500' 
  },
  { 
    name: 'Instagram Photo Downloader', 
    href: '/tools/social-media/instagram-photo-downloader', 
    icon: faInstagram, 
    gradient: 'from-indigo-500 to-blue-500' 
  },
  { 
    name: 'Tweet Generator', 
    href: '/tools/social-media/tweet-generator', 
    icon: faTwitter, 
    gradient: 'from-blue-500 to-teal-500' 
  },
  { 
    name: 'Tweet to Image Converter', 
    href: '/tools/social-media/tweet-to-image-converter', 
    icon: faTwitter, 
    gradient: 'from-green-500 to-teal-500' 
  },
  { 
    name: 'YouTube Thumbnail Downloader', 
    href: '/tools/social-media/youtube-thumbnail-downloader', 
    icon: faYoutube, 
    gradient: 'from-red-500 to-orange-500' 
  },
];

export default function SocialMediaToolsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
            Social Media<span className="text-blue-400"> Tools</span>
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Powerful tools to enhance your social media content creation workflow.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {socialMediaTools.map((tool, index) => (
            <Link
              key={tool.name}
              href={tool.href}
              className={`group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={tool.icon} className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Use the {tool.name.toLowerCase()} to boost your social media presence.
                  </p>
                </div>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300">
                    Try it now
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center">
              <Star className="mr-3 text-yellow-400" />
              Need a Custom Social Media Tool?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Can't find the tool you're looking for? Let us know and we'll build it for you!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity duration-300"
            >
              Request a Tool
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
