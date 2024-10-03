import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faPalette, faCode, faLightbulb } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-white inline-flex items-center">
              <FontAwesomeIcon icon={faPalette} className="mr-2 text-blue-400" />
              Web<span className="text-blue-400">Tools</span>Center
            </Link>
            <p className="text-gray-400">Empowering designers and developers with cutting-edge web tools.</p>
            <div className="flex space-x-4">
              {[faFacebookF, faTwitter, faInstagram, faLinkedinIn, faGithub].map((icon, index) => (
                <a key={index} href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                  <FontAwesomeIcon icon={icon} size="lg" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faCode} className="mr-2 text-blue-400" />
              Quick Links
            </h3>
            <ul className="text-gray-400 space-y-2">
              <li><Link href="/" className="hover:text-blue-400 transition duration-200">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition duration-200">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition duration-200">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition duration-200">Privacy Policy</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-blue-400 transition duration-200">Sitemap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faLightbulb} className="mr-2 text-blue-400" />
              Popular Tools
            </h3>
            <ul className="text-gray-400 space-y-2">
              <li><Link href="/tools/color/image-color-picker" className="hover:text-blue-400 transition duration-200">Image Color Picker</Link></li>
              <li><Link href="/tools/css/gradient-generator" className="hover:text-blue-400 transition duration-200">CSS Gradient Generator</Link></li>
              <li><Link href="/tools/image/image-resizer" className="hover:text-blue-400 transition duration-200">Image Resizer</Link></li>
              <li><Link href="/tools/coding/json-validator" className="hover:text-blue-400 transition duration-200">JSON Validator</Link></li>
              <li><Link href="/tools/text/lorem-ipsum-generator" className="hover:text-blue-400 transition duration-200">Lorem Ipsum Generator</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center text-gray-400">
            <p className="mb-4 italic">"The only way to do great work is to love what you do." - Steve Jobs</p>
            <p>&copy; {new Date().getFullYear()} WebToolsCenter. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}