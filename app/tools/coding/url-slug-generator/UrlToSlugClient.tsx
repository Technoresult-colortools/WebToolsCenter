'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select } from '@/components/ui/select1';
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import { BookOpen, Copy, Info, Lightbulb, RefreshCw, Download, Eye, EyeOff, AlertTriangle, Shield, Settings } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

const separators = [
  { value: 'hyphen', label: 'Hyphen (-)', char: '-' },
  { value: 'underscore', label: 'Underscore (_)', char: '_' },
  { value: 'dot', label: 'Dot (.)', char: '.' },
  { value: 'none', label: 'None', char: '' },
  { value: 'custom', label: 'Custom', char: '' },
]

const casings = [
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'capitalize', label: 'Capitalize' },
  { value: 'camelCase', label: 'camelCase' },
]

const transliterationOptions = [
  { value: 'none', label: 'None' },
  { value: 'latin', label: 'Latin' },
  { value: 'cyrillic', label: 'Cyrillic' },
  { value: 'greek', label: 'Greek' },
]

export default function URLSlugCreator() {
  const [input, setInput] = useState('')
  const [slug, setSlug] = useState('')
  const [separator, setSeparator] = useState('hyphen')
  const [customSeparator, setCustomSeparator] = useState('')
  const [casing, setCasing] = useState('lowercase')
  const [maxLength, setMaxLength] = useState(50)
  const [removeStopWords, setRemoveStopWords] = useState(true)
  const [customReplacements, setCustomReplacements] = useState('')
  const [preserveNumbers, setPreserveNumbers] = useState(true)
  const [transliteration, setTransliteration] = useState('none')
  const [showPassword, setShowPassword] = useState(false)

  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']

  useEffect(() => {
    generateSlug()
  }, [input, separator, customSeparator, casing, maxLength, removeStopWords, customReplacements, preserveNumbers, transliteration])

  const generateSlug = () => {
    let result = input.toLowerCase()
    const separatorChar = separator === 'custom' ? customSeparator : separators.find(sep => sep.value === separator)?.char || ''
  
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
  
    // Transliteration
    if (transliteration !== 'none') {
      result = transliterateText(result, transliteration)
    }
  
    // Replace non-alphanumeric characters with separator
    const regex = preserveNumbers ? /[^a-z0-9]+/g : /[^a-z]+/g
    result = result.replace(regex, separatorChar)
  
    // Remove leading/trailing separators
    if (separatorChar) {
      result = result.replace(new RegExp(`^${escapeRegExp(separatorChar)}+|${escapeRegExp(separatorChar)}+$`, 'g'), '')
    }
  
    // Apply casing
    if (casing === 'uppercase') {
      result = result.toUpperCase()
    } else if (casing === 'capitalize') {
      result = result.split(separatorChar).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(separatorChar)
    } else if (casing === 'camelCase') {
      result = result.split(separatorChar).map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('')
    }
  
    // Truncate to max length
    if (result.length > maxLength) {
      result = result.slice(0, maxLength)
      if (separatorChar) {
        result = result.replace(new RegExp(`${escapeRegExp(separatorChar)}+$`), '')
      }
    }
  
    setSlug(result)
  }
  
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const transliterateText = (text: string, type: string): string => {
    const latinMap: { [key: string]: string } = {'á':'a', 'é':'e', 'í':'i', 'ó':'o', 'ú':'u', 'ñ':'n'}
    const cyrillicMap: { [key: string]: string } = {'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh', 'з':'z', 'и':'i', 'й':'y', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'sch', 'ъ':'', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu', 'я':'ya'}
    const greekMap: { [key: string]: string } = {'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'i', 'θ':'th', 'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'ks', 'ο':'o', 'π':'p', 'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'o'}
    
    let map: { [key: string]: string }
    switch(type) {
      case 'latin':
        map = latinMap
        break
      case 'cyrillic':
        map = cyrillicMap
        break
      case 'greek':
        map = greekMap
        break
      default:
        return text
    }
    
    return text.replace(/[^A-Za-z0-9\s]/g, a => map[a] || a)
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

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([slug], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = 'url_slug.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Slug downloaded successfully!')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string
        setInput(content)
        toast.success('File uploaded successfully!')
      }
      reader.readAsText(file)
    }
  }

  return (
    <ToolLayout
      title="URL Slug Creator"
      description="Convert any text into a clean, SEO-friendly URL slug"
    >
      <Toaster position="top-right" />
  
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-4xl mx-auto mb-8">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="input" className="text-white mb-2 block text-sm sm:text-base">Input Text</Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-grow">
                <Input
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 pr-10 text-sm sm:text-base"
                  placeholder="Enter text to convert to a slug"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />}
                </button>
              </div>
              <Button onClick={handleRandomize} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Randomize
              </Button>
            </div>
          </div>
  
          <div>
            <Label htmlFor="slug" className="text-white mb-2 block text-sm sm:text-base">Generated Slug</Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                id="slug"
                value={slug}
                readOnly
                className="flex-grow bg-gray-700 text-white border-gray-600 text-sm sm:text-base"
              />
              <div className="flex space-x-2">
                <Button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="separator" className="text-white mb-2 block text-sm sm:text-base">Separator</Label>
              <Select
                selectedKey={separator}
                onSelectionChange={setSeparator}
                label="Separator"
                options={separators.map((sep) => ({ value: sep.value, label: sep.label }))}
                placeholder="Select separator"
              />

            </div>
            {separator === 'custom' && (
              <div>
                <Label htmlFor="customSeparator" className="text-white mb-2 block text-sm sm:text-base">Custom Separator</Label>
                <Input
                  id="customSeparator"
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 text-sm sm:text-base"
                  placeholder="Enter custom separator"
                />
              </div>
            )}
            <div>
              <Label htmlFor="casing" className="text-white mb-2 block text-sm sm:text-base">Casing</Label>
              <Select
                selectedKey={casing}
                onSelectionChange={setCasing}
                label="Casing"
                options={casings.map((c) => ({ value: c.value, label: c.label }))}
                placeholder="Select casing"
              />

            </div>
            <div>
              <Label htmlFor="transliteration" className="text-white mb-2 block text-sm sm:text-base">Transliteration</Label>
              <Select
                selectedKey={transliteration}
                onSelectionChange={setTransliteration}
                label="Transliteration"
                options={transliterationOptions.map((option) => ({ value: option.value, label: option.label }))}
                placeholder="Select transliteration"
              />

            </div>
          </div>
  
          <div>
            <Label htmlFor="maxLength" className="text-white mb-2 block text-sm sm:text-base">Maximum Length: {maxLength}</Label>
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
            <Label htmlFor="removeStopWords" className="text-white text-sm sm:text-base">Remove Stop Words</Label>
          </div>
  
          <div className="flex items-center space-x-2">
            <Switch
              id="preserveNumbers"
              checked={preserveNumbers}
              onCheckedChange={setPreserveNumbers}
            />
            <Label htmlFor="preserveNumbers" className="text-white text-sm sm:text-base">Preserve Numbers</Label>
          </div>
  
          <div>
            <Label htmlFor="customReplacements" className="text-white mb-2 block text-sm sm:text-base">Custom Replacements</Label>
            <textarea
              id="customReplacements"
              value={customReplacements}
              onChange={(e) => setCustomReplacements(e.target.value)}
              className="w-full h-24 bg-gray-700 text-white border-gray-600 rounded-md p-2 text-sm sm:text-base"
              placeholder="Enter custom replacements (one per line)&#10;Example:&#10;& : and&#10;@ : at"
            />
          </div>
  
          <div>
            <Label htmlFor="fileUpload" className="text-white mb-2 block text-sm sm:text-base">Upload File</Label>
            <Input
              id="fileUpload"
              type="file"
              onChange={handleFileUpload}
              className="bg-gray-700 text-white border-gray-600 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About URL Slug Creator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          The URL Slug Creator is an advanced tool designed to convert any text into clean, SEO-friendly URL slugs. It offers a wide range of customization options to cater to various slug generation needs, making it ideal for content management systems, blogs, e-commerce platforms, and any web application requiring URL-friendly text conversion.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/URLSlugPreview.png?height=400&width=600"  
            alt="Screenshot of the URL Slug Creator interface" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Key Features of URL Slug Creator
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Convert any text input into URL-friendly slugs</li>
          <li>Multiple separator options: hyphen, underscore, dot, none, or custom</li>
          <li>Casing options: lowercase, uppercase, capitalize, or camelCase</li>
          <li>Adjustable maximum length for generated slugs</li>
          <li>Option to remove common stop words for cleaner slugs</li>
          <li>Custom character/word replacement feature</li>
          <li>Preserve numbers option for numeric content</li>
          <li>Transliteration support for Latin, Cyrillic, and Greek characters</li>
          <li>Random input generation for testing</li>
          <li>One-click copy to clipboard functionality</li>
          <li>Download generated slug as a text file</li>
          <li>File upload support for bulk processing</li>
          <li>Password visibility toggle for sensitive content</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use URL Slug Creator?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter or paste your text in the input field, or upload a file containing the text.</li>
          <li>The slug is automatically generated based on your settings.</li>
          <li>Customize your slug with the following options:</li>
          <ul className="list-disc list-inside ml-6">
            <li>Select a separator character or use a custom separator.</li>
            <li>Choose the desired casing style.</li>
            <li>Set the maximum length for the slug.</li>
            <li>Toggle options like removing stop words and preserving numbers.</li>
            <li>Select a transliteration option if needed.</li>
            <li>Add custom replacements for specific characters or words.</li>
          </ul>
          <li>Use the "Randomize" button to generate a random slug for testing.</li>
          <li>Click "Copy" to copy the slug to your clipboard or "Download" to save it as a file.</li>
          <li>For sensitive content, use the password visibility toggle to protect your input.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Best Practices and Tips
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use hyphens as separators for better SEO, as search engines prefer them.</li>
          <li>Keep slugs concise by removing stop words and using a reasonable maximum length.</li>
          <li>Use lowercase for consistency and easier readability.</li>
          <li>Preserve numbers when they carry significant meaning (e.g., product codes, years).</li>
          <li>Utilize transliteration for content with non-Latin characters to improve global accessibility.</li>
          <li>Test your slugs with different inputs to ensure they work well for various content types.</li>
          <li>Use custom replacements to maintain brand consistency (e.g., replacing "&" with "and").</li>
          <li>Consider using camelCase for programming-related content or when separators are undesired.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2" />
          Common Pitfalls and How to Avoid Them
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Overly long slugs: Set a reasonable maximum length to keep URLs manageable.</li>
          <li>Loss of meaning: Be cautious when removing stop words or shortening slugs to maintain context.</li>
          <li>Duplicate slugs: Implement a system to handle duplicate slugs (e.g., by appending numbers).</li>
          <li>Inconsistent formatting: Stick to a consistent style across your website for better user experience.</li>
          <li>Ignoring international characters: Use transliteration to handle non-Latin alphabets effectively.</li>
          <li>Overuse of custom replacements: Keep replacements minimal and meaningful to avoid confusion.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          Security Considerations
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Sanitize input to prevent XSS attacks when displaying slugs in web applications.</li>
          <li>Be cautious with file uploads and implement proper validation to prevent security risks.</li>
          <li>Use the password visibility toggle feature wisely when working with sensitive content.</li>
          <li>Implement rate limiting and other security measures to prevent abuse of the slug generation API.</li>
          <li>Regularly update and maintain the tool to address any potential security vulnerabilities.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          The URL Slug Creator is a powerful tool for generating clean, SEO-friendly URLs. By understanding its features and following best practices, you can create effective slugs that improve your website's usability and search engine performance. Remember to always consider your specific use case and adjust the settings accordingly for optimal results.
        </p>
      </CardContent>
    </Card>

    </ToolLayout>
  )
}

