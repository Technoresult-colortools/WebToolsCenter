'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, Download, RefreshCw, BarChart2, Info, Lightbulb, BookOpen } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools';

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12 text-center px-4">
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
              Letter Counter
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Quickly analyze your text for character counts, word frequencies, and more, all with a user-friendly interface.
          </p>
          
      </div>


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
              The Letter Counter is a useful tool for counting the number of letters, words, and characters in any given text. It's ideal for writers, editors, and anyone who needs to analyze text length or frequency. This tool provides a quick way to review text stats and offers features for copying or downloading the analytics for future reference.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Letter Counter?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter or paste your text in the input area.</li>
              <li>Click the "Show Stats" button to view the letter, word, and character counts.</li>
              <li>Use the "Clear" option to reset the input and output fields.</li>
              <li>Click "Copy Analytics" to copy the statistics to your clipboard.</li>
              <li>Select "Download Analytics" to save the statistics as a file.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Show Stats: Displays the number of letters, words, and characters in the text.</li>
              <li>Clear: Resets both input and output fields.</li>
              <li>Download Analytics: Saves the analysis results as a file for later reference.</li>
              <li>Copy Analytics: Copies the results to the clipboard for easy sharing.</li>
            </ul>
          </div>

        </main>
      </div>  
      <Footer />
    </div>
  )
}