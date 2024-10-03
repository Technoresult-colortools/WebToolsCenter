'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const separators = [
  { value: 'hyphen', label: 'Hyphen (-)', char: '-' },
  { value: 'underscore', label: 'Underscore (_)', char: '_' },
  { value: 'none', label: 'None', char: '' },
]

const casings = [
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'capitalize', label: 'Capitalize' },
]

export default function URLSlugCreator() {
  const [input, setInput] = useState('')
  const [slug, setSlug] = useState('')
  const [separator, setSeparator] = useState('hyphen')
  const [casing, setCasing] = useState('lowercase')
  const [maxLength, setMaxLength] = useState(50)
  const [removeStopWords, setRemoveStopWords] = useState(true)
  const [customReplacements, setCustomReplacements] = useState('')

  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']

  useEffect(() => {
    generateSlug()
  }, [input, separator, casing, maxLength, removeStopWords, customReplacements])

  const generateSlug = () => {
    let result = input.toLowerCase()
    const separatorChar = separators.find(sep => sep.value === separator)?.char || ''
  
    // Remove HTML tags
    result = result.replace(/<[^>]*>/g, '')
  
    // Handle custom replacements
    const replacements = customReplacements.split('\n').filter(line => line.includes(':'))
    replacements.forEach(replacement => {
      const [from, to] = replacement.split(':').map(s => s.trim())
      result = result.replace(new RegExp(from, 'g'), to)
    })
  
    // Remove stop words
    if (removeStopWords) {
      result = result.split(' ').filter(word => !stopWords.includes(word)).join(' ')
    }
  
    // Replace non-alphanumeric characters with separator
    // Allow period if the selected separator is a period
    if (separatorChar === '.') {
      result = result.replace(/[^a-z0-9.]+/g, separatorChar) // Allow dots
    } else if (separatorChar) {
      result = result.replace(/[^a-z0-9]+/g, separatorChar)
    } else {
      result = result.replace(/[^a-z0-9]+/g, '')
    }
  
    // Remove leading/trailing separators
    if (separatorChar) {
      result = result.replace(new RegExp(`^${separatorChar}+|${separatorChar}+$`, 'g'), '')
    }
  
    // Apply casing
    if (casing === 'uppercase') {
      result = result.toUpperCase()
    } else if (casing === 'capitalize') {
      result = result.split(separatorChar).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(separatorChar)
    }
  
    // Truncate to max length
    if (result.length > maxLength) {
      result = result.slice(0, maxLength)
      if (separatorChar) {
        result = result.replace(new RegExp(`${separatorChar}+$`), '')
      }
    }
  
    setSlug(result)
  }
  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slug).then(() => {
      toast.success('Slug copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy slug. Please try again.')
    })
  }

  const handleRandomize = () => {
    const randomWords = ['quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'lorem', 'ipsum', 'dolor', 'sit', 'amet']
    const randomInput = Array.from({ length: 5 }, () => randomWords[Math.floor(Math.random() * randomWords.length)]).join(' ')
    setInput(randomInput)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">URL Slug Creator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mb-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="input" className="text-white mb-2 block">Input Text</Label>
              <div className="flex space-x-2">
                <Input
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow bg-gray-700 text-white border-gray-600"
                  placeholder="Enter text to convert to a slug"
                />
                <Button onClick={handleRandomize} className="bg-purple-600 hover:bg-purple-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Randomize
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="slug" className="text-white mb-2 block">Generated Slug</Label>
              <div className="flex space-x-2">
                <Input
                  id="slug"
                  value={slug}
                  readOnly
                  className="flex-grow bg-gray-700 text-white border-gray-600"
                />
                <Button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="separator" className="text-white mb-2 block">Separator</Label>
                <Select value={separator} onValueChange={setSeparator}>
                  <SelectTrigger id="separator" className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                    {separators.map((sep) => (
                      <SelectItem key={sep.value} value={sep.value}>{sep.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="casing" className="text-white mb-2 block">Casing</Label>
                <Select value={casing} onValueChange={setCasing}>
                  <SelectTrigger id="casing" className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select casing" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                    {casings.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="maxLength" className="text-white mb-2 block">Maximum Length: {maxLength}</Label>
              <Slider
                id="maxLength"
                min={10}
                max={100}
                step={1}
                value={maxLength}
                onChange={(value) => setMaxLength(value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="removeStopWords"
                checked={removeStopWords}
                onCheckedChange={setRemoveStopWords}
              />
              <Label htmlFor="removeStopWords" className="text-white">Remove Stop Words</Label>
            </div>

            <div>
              <Label htmlFor="customReplacements" className="text-white mb-2 block">Custom Replacements</Label>
              <textarea
                id="customReplacements"
                value={customReplacements}
                onChange={(e) => setCustomReplacements(e.target.value)}
                className="w-full h-24 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                placeholder="Enter custom replacements (one per line)&#10;Example:&#10;& : and&#10;@ : at"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">About URL to Slug Creator</h2>
            <p className="text-gray-300">
              The URL to Slug Creator is a handy tool designed to convert any text into a clean, SEO-friendly URL slug. Whether you're building websites, blogs, or e-commerce platforms, this tool ensures your slugs are optimized for search engines and easy to read. Customize the output to fit your preferences with options for separators, case settings, and more.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Key Features of URL to Slug Creator</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Automatic slug generation from text input</li>
              <li>Choose from different separator options (hyphen, underscore, dot, none, or custom)</li>
              <li>Adjust case (lowercase, uppercase, capitalize) for slug</li>
              <li>Maximum length control for slug output</li>
              <li>Option to remove common stop words for cleaner slugs</li>
              <li>Custom character/word replacement feature</li>
              <li>Random input generation for testing</li>
              <li>One-click copy to clipboard functionality</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">How to Use URL to Slug Creator?</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Enter or paste your text in the input field.</li>
              <li>The slug is automatically generated based on your settings.</li>
              <li>Customize your slug with the following options:</li>
              <ul className="list-disc list-inside text-gray-300 ml-8">
                <li>Select a separator character (hyphen, underscore, dot, none, or custom).</li>
                <li>Choose between lowercase, uppercase, or capitalize casing.</li>
                <li>Adjust the slug length using the slider for a maximum length limit.</li>
                <li>Toggle the option to remove common stop words for cleaner slugs.</li>
                <li>Add custom replacements for specific characters or words.</li>
              </ul>
              <li>Click the "Randomize" button to generate a random slug for testing.</li>
              <li>Click "Copy" to copy the slug to your clipboard.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">Tips and Tricks</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Use hyphens for SEO-friendly slugs as search engines prefer them.</li>
              <li>Capitalize the slug for titles or headers to make them stand out visually.</li>
              <li>Remove stop words like "and", "the", or "of" to create shorter, cleaner slugs.</li>
              <li>Set a maximum length for slugs to ensure URLs remain user-friendly.</li>
              <li>Test various separators to see which fits your site's style or branding best.</li>
              <li>Use custom replacements to maintain consistency in branding or style (e.g., replacing "&" with "and").</li>
            </ul>
          </section>
        </div>


        <div className="bg-gray-800 rounded-xl mt-4 shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4">Custom Separator Explanation</h2>
          
          <p className="text-gray-300 mb-4">
            The custom separator feature allows you to define your own unique separator for the URL slug. This gives you more flexibility in how words are separated in the final slug.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-4">How It Works</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>In the "Separator" dropdown, select "Custom".</li>
            <li>A new input field will appear labeled "Custom Separator".</li>
            <li>Enter any character or string you want to use as a separator in this field.</li>
            <li>The slug generator will use this custom separator to join words in the slug.</li>
          </ol>

          <h3 className="text-xl font-semibold text-white mt-6 mb-4">Examples</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Using "|" as a custom separator:
              <br />Input: "This is a test"
              <br />Output: "this|is|a|test"
            </li>
            <li>Using "+" as a custom separator:
              <br />Input: "Custom separator example"
              <br />Output: "custom+separator+example"
            </li>
            <li>Using "--" as a custom separator:
              <br />Input: "Multiple character separator"
              <br />Output: "multiple--character--separator"
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-4">Important Notes</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>The custom separator can be any character or string, including special characters and spaces.</li>
            <li>Be cautious when using special characters, as some may not be URL-friendly.</li>
            <li>The custom separator is used in place of spaces and other non-alphanumeric characters in the input text.</li>
            <li>Leading and trailing occurrences of the custom separator are removed from the final slug.</li>
            <li>The custom separator is respected when applying casing options (lowercase, uppercase, or capitalize).</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-4">Use Cases</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Creating slugs for systems that require specific separators.</li>
            <li>Generating unique identifiers with custom formatting.</li>
            <li>Adapting to different URL structures or naming conventions.</li>
          </ul>

          <p className="text-gray-300 mt-4">
            Remember, while custom separators offer flexibility, it's important to consider URL best practices and ensure your chosen separator doesn't conflict with URL parsing or cause issues with your target system.
          </p>
        </div>

      </main>
      <Footer />
    </div>
  )
}