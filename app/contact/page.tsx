'use client'
import React, { useState, useEffect } from 'react'
import { Send, MessageCircle, Sparkles, Mail, PhoneCall, MapPin } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' })
    alert('Thank you for your message. We will get back to you soon!')
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
            Contact<span className="text-blue-400">Us</span>
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            We're here to help! Reach out to us with any questions, suggestions, or feedback.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MessageCircle className="mr-3 text-blue-400" />
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Send Message
                  <Send size={18} className="ml-2" />
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-blue-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Email</h3>
                  <p className="text-gray-400">technoresult@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneCall className="w-6 h-6 text-green-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Phone</h3>
                  <p className="text-gray-400">254456</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-red-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Address</h3>
                  <p className="text-gray-400">5th Main Rd ,Sarakki Industrial Layout, 3rd Phase, J. P. Nagar, Bangalore, India</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  <FontAwesomeIcon icon={faFacebookF} className="w-6 h-6" />
                </a>
                
                {/* Instagram */}
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                  <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
                </a>

                {/* GitHub */}
                <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="text-grey-500 hover:text-gray-600">
                  <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
                </a>

                {/* Twitter */}
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                  <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
                </a>

                {/* LinkedIn */}
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                  <FontAwesomeIcon icon={faLinkedinIn} className="w-6 h-6" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}