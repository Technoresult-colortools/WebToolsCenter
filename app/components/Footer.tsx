import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <Link href="/" className="text-lg font-bold text-white">
              Web<span className="text-blue-400">Tools</span>Center
            </Link>
            <p className="text-gray-400">Empowering designers and developers with cutting-edge color tools.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Quick Links</h3>
            <ul className="text-gray-400 space-y-2">
              <li><Link href="/" className="hover:text-blue-400 transition duration-200">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition duration-200">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition duration-200">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              {[faFacebookF, faTwitter, faInstagram, faLinkedinIn].map((icon, index) => (
                <a key={index} href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                  <FontAwesomeIcon icon={icon} size="1x" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-400">
          &copy; {new Date().getFullYear()} ColorTools. All rights reserved.
        </div>
      </div>
    </footer>
  )
}