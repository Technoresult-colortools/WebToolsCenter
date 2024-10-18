'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Sparkles, Home } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

export default function NotFoundPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden flex-grow flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
        <div 
          className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            4<span className="text-blue-400">0</span>4
            <span className="inline-block ml-3">
              <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-3xl md:text-4xl font-bold text-white mb-8">
            Oops! This Page is <span className="text-blue-400">Coming Soon</span>
          </p>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            We're working hard to bring you something amazing. Check back later!
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity duration-300"
            >
              <Home className="mr-2 w-5 h-5" />
              Go Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors duration-300"
            >
              Contact Us
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Rocket */}
      <div className="fixed bottom-10 right-10 animate-bounce">
        <FontAwesomeIcon icon={faRocket} className="text-6xl text-blue-400" />
      </div>

      {/* Coming Soon Countdown */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center">
              <Sparkles className="mr-3 text-yellow-400" />
              Launching Soon
            </h2>
            <div className="flex justify-center space-x-8">
              {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit, index) => (
                <div key={unit} className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {index === 0 ? '07' : '00'}
                  </div>
                  <div className="text-gray-400">{unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}