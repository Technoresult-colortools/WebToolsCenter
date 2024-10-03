import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header'; 
import Footer from '@/components/Footer'; 
import { ChevronRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faRandom,
  faQrcode,
  faBarcode,
  faWeightHanging,
  faLink
} from '@fortawesome/free-solid-svg-icons'; 

const miscellaneousTools = [
  { name: 'Advance Password Generator', href: '/tools/misc/advance-password-generator', icon: faLock, description: 'Generate secure and complex passwords.' },
  { name: 'List Randomizer', href: '/tools/misc/list-randomizer', icon: faRandom, description: 'Randomly shuffle and reorder lists.' },
  { name: 'QR Code Generator', href: '/tools/misc/qr-code-generator', icon: faQrcode, description: 'Create QR codes for URLs and text.' },
  { name: 'BarCode Generator', href: '/tools/misc/barcode-generator', icon: faBarcode, description: 'Generate barcodes for various purposes.' },
  { name: 'Unit Converter', href: '/tools/misc/unit-converter', icon: faWeightHanging, description: 'Convert Between Various Units.' },
  { name: 'URL Shortener', href: '/tools/misc/url-shortener', icon: faLink, description: 'Convert Between Various Units.' },
];

const MiscellaneousToolsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Miscellaneous Tools Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {miscellaneousTools.map((tool) => (
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

export default MiscellaneousToolsPage;
