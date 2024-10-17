import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons'
import { 
  faPalette, 
  faCode, 
  faLightbulb, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

      {/* Main Footer Content */}
      <div className="max-w-[1920px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link 
              href="/" 
              className="text-3xl font-bold text-white inline-flex items-center group"
            >
              <FontAwesomeIcon 
                icon={faPalette} 
                className="mr-3 text-blue-400 group-hover:rotate-12 transition-transform duration-300" 
              />
              Web<span className="text-blue-400">Tools</span>Center
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering designers and developers with cutting-edge web tools for seamless creation and innovation.
            </p>
            {/* Newsletter Signup */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-400" />
                Stay Updated
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-700"
                />
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-r-lg transition duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center">
              <FontAwesomeIcon icon={faCode} className="mr-3 text-blue-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.path} 
                    className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 mr-2 transition-colors duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center">
              <FontAwesomeIcon icon={faLightbulb} className="mr-3 text-blue-400" />
              Popular Tools
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Image Color Picker', path: '/tools/color/image-color-picker' },
                { name: 'CSS Gradient Generator', path: '/tools/css/gradient-generator' },
                { name: 'Image Resizer', path: '/tools/image/image-resizer' },
                { name: 'JSON Validator', path: '/tools/coding/json-validator' },
                { name: 'Lorem Ipsum Generator', path: '/tools/text/lorem-ipsum-generator' }
              ].map((tool, index) => (
                <li key={index}>
                  <Link 
                    href={tool.path} 
                    className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 mr-2 transition-colors duration-200"></span>
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Connect With Us</h3>
            <div className="grid grid-cols-5 gap-4">
              {[
                { icon: faFacebookF, color: 'hover:bg-[#1877f2]' },
                { icon: faTwitter, color: 'hover:bg-[#1da1f2]' },
                { icon: faInstagram, color: 'hover:bg-[#e4405f]' },
                { icon: faLinkedinIn, color: 'hover:bg-[#0077b5]' },
                { icon: faGithub, color: 'hover:bg-[#333]' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 ${social.color} transition-all duration-300 hover:scale-110`}
                >
                  <FontAwesomeIcon icon={social.icon} className="text-gray-300 hover:text-white" />
                </a>
              ))}
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-400">
                Need help? Contact us at:
                <a href="mailto:support@webtoolscenter.com" className="block text-blue-400 hover:underline mt-1">
                  technoresult@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 p-2 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} WebToolsCenter. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <Link href="/sitemap.xml" className="text-sm text-gray-400 hover:text-blue-400 transition duration-200">
                Sitemap
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-blue-400 transition duration-200">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="text-sm text-gray-400 hover:text-blue-400 transition duration-200">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}