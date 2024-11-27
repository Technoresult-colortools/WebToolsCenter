'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Copy, Download, RefreshCw, BarChart2, Info, Lightbulb, BookOpen, ZapIcon, Type } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'

const MAX_CHARS = 5000

export default function LetterCounter() {
  const [text, setText] = useState('')
  const [letterCount, setLetterCount] = useState<Record<string, number>>({})
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const [paragraphCount, setParagraphCount] = useState(0)
  const [mostCommonLetter, setMostCommonLetter] = useState('')

  useEffect(() => {
    analyzeText(text)
  }, [text])

  const analyzeText = (inputText: string) => {
    const letterFrequency: Record<string, number> = {}
    inputText.toLowerCase().replace(/[^a-z]/g, '').split('').forEach(char => {
      letterFrequency[char] = (letterFrequency[char] || 0) + 1
    })
    setLetterCount(letterFrequency)
    setWordCount(inputText.trim().split(/\s+/).filter(word => word !== '').length)
    setSentenceCount(inputText.split(/[.!?]+/).filter(sentence => sentence.trim() !== '').length)
    setParagraphCount(inputText.split('\n\n').filter(para => para.trim() !== '').length)
    const sortedLetters = Object.entries(letterFrequency).sort((a, b) => b[1] - a[1])
    setMostCommonLetter(sortedLetters.length > 0 ? sortedLetters[0][0] : '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    if (newText.length <= MAX_CHARS) {
      setText(newText)
    } else {
      setText(newText.slice(0, MAX_CHARS))
      toast.error(`Character limit of ${MAX_CHARS} reached`)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(letterCount, null, 2))
    toast.success('Letter count copied to clipboard')
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify({
      text,
      letterCount,
      wordCount,
      sentenceCount,
      paragraphCount,
      mostCommonLetter
    }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'text_analysis.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Analysis downloaded successfully')
  }

  const handleClear = () => {
    setText('')
    toast.success('Text cleared')
  }

  const handleShowStats = () => {
    toast((t) => (
      <div>
        <p>Words: {wordCount}</p>
        <p>Sentences: {sentenceCount}</p>
        <p>Paragraphs: {paragraphCount}</p>
        <p>Most common letter: {mostCommonLetter}</p>
        <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
      </div>
    ), { duration: 5000 })
  }

  return (
    <ToolLayout
      title="Letter Counter"
      description="Quickly analyze your text for character counts, word frequencies, and more, all with a user-friendly interface."
    >
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <div className="mb-6">
          <label htmlFor="input-text" className="block text-lg font-medium text-gray-200 mb-2">
            Input Text:
          </label>
          <textarea
            id="input-text"
            value={text}
            onChange={handleInputChange}
            className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
            placeholder="Enter your text here for analysis..."
          />
          <p className="text-sm text-gray-400 mt-2">
            {text.length}/{MAX_CHARS} characters
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Copy className="h-5 w-5 mr-2" />
            Copy Analysis
          </Button>
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-5 w-5 mr-2" />
            Download Analysis
          </Button>
          <Button onClick={handleClear} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="h-5 w-5 mr-2" />
            Clear
          </Button>
          <Button onClick={handleShowStats} className="bg-blue-600 hover:bg-blue-700 text-white">
            <BarChart2 className="h-5 w-5 mr-2" />
            Show Stats
          </Button>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Letter Frequency:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(letterCount).map(([letter, count]) => (
              <div key={letter} className="bg-gray-600 rounded p-2 text-center">
                <span className="text-xl font-bold text-white">{letter.toUpperCase()}</span>
                <span className="text-sm text-gray-300 ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Letter Counter?
        </h2>
        <p className="text-gray-300 mb-4">
          The Letter Counter is a powerful text analysis tool designed for writers, editors, students, and anyone who needs to gain insights into their text composition. It goes beyond simple character counting, offering a comprehensive analysis of your text including letter frequency, word count, sentence count, and paragraph count. With its <Link href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</Link> and advanced features, it's the perfect companion for content creation, editing, and text analysis tasks.
        </p>
        <p className="text-gray-300 mb-4">
          Whether you're crafting the perfect essay, optimizing your content for readability, or conducting linguistic analysis, our Letter Counter provides you with valuable data at your fingertips. It's like having a personal text analyst right in your browser!
        </p>

        <div className="my-8">
          <Image 
            src="/Images/LetterCounterPreview.png?height=400&width=600" 
            alt="Screenshot of the Letter Counter interface showing text input area, analysis results, and action buttons" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Letter Counter
        </h2>
        <p className="text-gray-300 mb-4">
          Using our Letter Counter is straightforward and efficient. Here's a step-by-step guide to get you started:
        </p>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter or paste your text into the input box. You can input up to 5000 characters.</li>
          <li>As you type or paste, the tool automatically analyzes your text in real-time.</li>
          <li>View the letter frequency chart below the input box for a visual representation of letter distribution.</li>
          <li>Click the "Show Stats" button to see a detailed breakdown of word count, sentence count, paragraph count, and the most common letter.</li>
          <li>Use the "Copy Analysis" button to copy the letter frequency data to your clipboard.</li>
          <li>Click "Download Analysis" to save a comprehensive JSON file with all analysis data.</li>
          <li>To start fresh, use the "Clear" button to reset the input and analysis.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BarChart2 className="w-6 h-6 mr-2" />
          Analysis Features
        </h2>
        <p className="text-gray-300 mb-4">
          Our Letter Counter provides a range of analytical features to give you comprehensive insights into your text:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Letter Frequency:</strong> See how often each letter appears in your text.</li>
          <li><strong>Word Count:</strong> Get an accurate count of words in your text.</li>
          <li><strong>Sentence Count:</strong> Know how many sentences are in your text.</li>
          <li><strong>Paragraph Count:</strong> Track the number of paragraphs in your content.</li>
          <li><strong>Most Common Letter:</strong> Identify the letter that appears most frequently.</li>
          <li><strong>Character Count:</strong> Keep track of your total character count, including spaces.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Features That Make Us Stand Out
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><ZapIcon className="w-4 h-4 inline-block mr-1" /> <strong>Real-time Analysis:</strong> See results instantly as you type or paste text</li>
          <li><BarChart2 className="w-4 h-4 inline-block mr-1" /> <strong>Visual Letter Frequency:</strong> Easy-to-read chart of letter distribution</li>
          <li><Copy className="w-4 h-4 inline-block mr-1" /> <strong>One-click Copying:</strong> Easily copy analysis results to clipboard</li>
          <li><Download className="w-4 h-4 inline-block mr-1" /> <strong>Downloadable Analysis:</strong> Save comprehensive results as a JSON file</li>
          <li><RefreshCw className="w-4 h-4 inline-block mr-1" /> <strong>Quick Reset:</strong> Clear function for easy start-over</li>
          <li><Type className="w-4 h-4 inline-block mr-1" /> <strong>Character Limit Indicator:</strong> Stay within the 5000 character limit with ease</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Practical Applications
        </h2>
        <p className="text-gray-300 mb-4">
          The Letter Counter tool can be invaluable in various scenarios:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Writing:</strong> Monitor word count for essays, articles, or social media posts</li>
          <li><strong>Editing:</strong> Identify overused letters or words to improve variety in writing</li>
          <li><strong>SEO:</strong> Analyze keyword density and content length for optimization</li>
          <li><strong>Language Learning:</strong> Study letter frequency in different languages</li>
          <li><strong>Data Analysis:</strong> Gather text statistics for research or reporting</li>
          <li><strong>Cryptography:</strong> Analyze letter frequency for simple ciphers</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to dive deep into your text? Start using our Letter Counter tool now and unlock insights that will elevate your writing, editing, and analysis tasks. Whether you're a professional writer, a student, or just curious about the composition of your text, our tool is here to provide you with accurate, instant, and comprehensive text analysis. Try it out and see the difference it can make in your work!
        </p>
      </div>
    </ToolLayout>
  )
}