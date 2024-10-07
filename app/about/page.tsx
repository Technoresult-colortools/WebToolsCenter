'use client'
import React from 'react'
import { ChevronRight, TextIcon, Image, Palette, Code, Share, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

const toolCategories = [
  { name: 'Text Tools', icon: <TextIcon className="w-6 h-6" />, count: 14, color: 'bg-blue-500' },
  { name: 'Image Tools', icon: <Image className="w-6 h-6" />, count: 12, color: 'bg-green-500' },
  { name: 'CSS Tools', icon: <Palette className="w-6 h-6" />, count: 10, color: 'bg-purple-500' },
  { name: 'Coding Tools', icon: <Code className="w-6 h-6" />, count: 19, color: 'bg-yellow-500' },
  { name: 'Color Tools', icon: <Palette className="w-6 h-6" />, count: 18, color: 'bg-red-500' },
  { name: 'Social Media Tools', icon: <Share className="w-6 h-6" />, count: 6, color: 'bg-pink-500' },
  { name: 'Miscellaneous Tools', icon: <Zap className="w-6 h-6" />, count: 5, color: 'bg-indigo-500' },
]

const ToolCard = ({ name, icon, count, color }: { name: string; icon: React.ReactNode; count: number; color: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="transition-all duration-300"
  >
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600">
      <CardHeader className={`${color} text-white rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between">
          {name}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <CardDescription className="text-gray-300">
          {count} tools available
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
)

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About WebToolsCenter</h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            WebToolsCenter is the ultimate platform for all your web development and design needs. With a collection of 
            versatile tools, it aims to simplify complex tasks and save valuable time. Whether you're a seasoned developer 
            or just starting out, our easy-to-use tools help you achieve your project goals efficiently. Discover our 
            extensive suite of utilities, thoughtfully categorized for maximum convenience.
          </p>
        </motion.div>

        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Our Tool Categories</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {toolCategories.map((category) => (
              <ToolCard key={category.name} {...category} />
            ))}
          </motion.div>
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-white mb-6">Why Choose WebToolsCenter?</h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Our tools are built with simplicity in mind, ensuring that even beginners can navigate and use them effortlessly.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Comprehensive Suite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  With over 80 carefully crafted tools, we offer solutions for all aspects of web development, design, and more.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Always Free</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We are committed to keeping our tools completely free to use, so you can focus on creating without any barriers.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold text-white mb-6">Start Using Our Tools Today</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            No matter what role you play in the digital world—developer, designer, or content creator—our tools are here to enhance 
            your productivity and streamline your workflows. Start exploring today and see how WebToolsCenter can make a difference 
            in your projects.
          </p>
          <Link href="/categories" passHref>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Explore All Tools
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
