'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, Download, RefreshCw, BarChart2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
    // Count letters
    const letterFrequency: Record<string, number> = {}
    inputText.toLowerCase().replace(/[^a-z]/g, '').split('').forEach(char => {
      letterFrequency[char] = (letterFrequency[char] || 0) + 1
    })
    setLetterCount(letterFrequency)

    // Count words
    setWordCount(inputText.trim().split(/\s+/).filter(word => word !== '').length)

    // Count sentences
    setSentenceCount(inputText.split(/[.!?]+/).filter(sentence => sentence.trim() !== '').length)

    // Count paragraphs
    setParagraphCount(inputText.split('\n\n').filter(para => para.trim() !== '').length)

    // Find most common letter
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Letter Counter</h1>

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
            <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-700 text-white">
              <Copy className="h-5 w-5 mr-2" />
              Copy Analysis
            </Button>
            <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download Analysis
            </Button>
            <Button onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white">
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

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">About Letter Counter</h2>
              <p className="text-white">
                This tool helps you quickly count the number of letters, words, and characters in your text. It's useful for writers, editors, and anyone who needs to analyze text length and frequency. The tool also provides options to show, copy, and download analytics for further review.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <ol className="text-white list-decimal list-inside">
                <li>Enter or paste your text in the input area.</li>
                <li>Click the "Show Stats" button to view the letter, word, and character counts.</li>
                <li>Use the "Clear" option to reset the input and output fields.</li>
                <li>Click "Copy Analytics" to copy the statistics to your clipboard.</li>
                <li>Select "Download Analytics" to save the statistics as a file.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="text-white list-disc list-inside">
                <li>Show Stats: Displays the number of letters, words, and characters in the text.</li>
                <li>Clear: Resets both input and output fields.</li>
                <li>Download Analytics: Saves the analysis results as a file for later reference.</li>
                <li>Copy Analytics: Copies the results to the clipboard for easy sharing.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}