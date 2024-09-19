import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const socialMediaTools = [
  { name: 'Instagram Filters', href: '/tools/social-media/instagram-filters', icon: faInstagram, description: 'Apply filters to your Instagram photos.' },
  { name: 'Instagram Post Generator', href: '/tools/social-media/instagram-post-generator', icon: faInstagram, description: 'Create engaging Instagram posts.' },
  { name: 'Instagram Photo Downloader', href: '/tools/social-media/instagram-photo-downloader', icon: faInstagram, description: 'Download Instagram photos easily.' },
  { name: 'Tweet Generator', href: '/tools/social-media/tweet-generator', icon: faTwitter, description: 'Generate tweets for Twitter.' },
  { name: 'Tweet to Image Converter', href: '/tools/social-media/tweet-to-image-converter', icon: faTwitter, description: 'Convert tweets into images.' },
  { name: 'YouTube Thumbnail Downloader', href: '/tools/social-media/youtube-thumbnail-downloader', icon: faYoutube, description: 'Download YouTube video thumbnails.' },
];

export default function SocialMediaToolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Social Media Tools Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {socialMediaTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <FontAwesomeIcon icon={tool.icon} className="text-2xl text-blue-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
                <p className="text-gray-400 mb-4">{tool.description}</p>
              </div>
              <span className="text-blue-400 font-semibold hover:text-blue-300 inline-flex items-center mt-2">
                Try it now
                <ChevronRight size={20} className="ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
