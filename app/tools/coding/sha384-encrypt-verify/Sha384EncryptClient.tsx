'use client'

import React, { useState } from 'react'
import { Hash, Copy, RefreshCw, Check, AlertTriangle, Info, Lightbulb, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast, { Toaster } from 'react-hot-toast'
import crypto from 'crypto'

export default function SHA384EncryptVerify() {
  const [inputText, setInputText] = useState('')
  const [outputHash, setOutputHash] = useState('')
  const [verifyInput, setVerifyInput] = useState('')
  const [verifyHash, setVerifyHash] = useState('')
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [encoding, setEncoding] = useState<'utf8' | 'ascii' | 'base64'>('utf8')

  const generateSHA384 = (text: string): string => {
    return crypto.createHash('sha384').update(text, encoding).digest('hex')
  }

  const handleEncrypt = () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to encrypt.')
      return
    }
    const hash = generateSHA384(inputText)
    setOutputHash(hash)
    toast.success('SHA384 hash generated successfully!')
  }

  const handleVerify = () => {
    if (!verifyInput.trim() || !verifyHash.trim()) {
      toast.error('Please enter both text and hash for verification.')
      return
    }
    const generatedHash = generateSHA384(verifyInput)
    const isMatch = generatedHash.toLowerCase() === verifyHash.toLowerCase()
    setVerificationResult(isMatch)
    toast.success(isMatch ? 'Hash verified successfully!' : 'Hash verification failed.')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleReset = () => {
    setInputText('')
    setOutputHash('')
    setVerifyInput('')
    setVerifyHash('')
    setVerificationResult(null)
    toast.success('Reset successful!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">SHA384 Encrypt and Verify</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="encrypt">
                <Hash className="w-4 h-4 mr-2" />
                Encrypt
              </TabsTrigger>
              <TabsTrigger value="verify">
                <Check className="w-4 h-4 mr-2" />
                Verify
              </TabsTrigger>
            </TabsList>
            <TabsContent value="encrypt" className="space-y-4">
              <div>
                <Label htmlFor="input-text" className="text-white mb-2 block">Text to Encrypt</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter text to encrypt..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-32 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <div>
                <Label htmlFor="encoding" className="text-white mb-2 block">Input Encoding</Label>
                <Select onValueChange={(value: 'utf8' | 'ascii' | 'base64') => setEncoding(value)}>
                  <SelectTrigger className="w-40 bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select encoding" />
                  </SelectTrigger>
                  <SelectContent className="w-40 bg-gray-700 text-white border-gray-600">
                    <SelectItem value="utf8">UTF-8</SelectItem>
                    <SelectItem value="ascii">ASCII</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="output-hash" className="text-white mb-2 block">SHA384 Hash</Label>
                <div className="flex">
                  <Input
                    id="output-hash"
                    value={outputHash}
                    readOnly
                    className="flex-grow bg-gray-700 text-white border-gray-600 rounded-l-md p-2"
                  />
                  <Button onClick={() => copyToClipboard(outputHash)} className="bg-blue-600 hover:bg-blue-700 rounded-l-none">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleEncrypt} className="w-full bg-blue-600 hover:bg-blue-700">
                <Hash className="w-4 h-4 mr-2" />
                Generate SHA384 Hash
              </Button>
            </TabsContent>
            <TabsContent value="verify" className="space-y-4">
              <div>
                <Label htmlFor="verify-input" className="text-white mb-2 block">Text to Verify</Label>
                <Textarea
                  id="verify-input"
                  placeholder="Enter text to verify..."
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  className="w-full h-32 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <div>
                <Label htmlFor="verify-hash" className="text-white mb-2 block">SHA384 Hash to Verify</Label>
                <Input
                  id="verify-hash"
                  placeholder="Enter SHA384 hash..."
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <Button onClick={handleVerify} className="w-full bg-blue-600 hover:bg-blue-700">
                <Check className="w-4 h-4 mr-2" />
                Verify SHA384 Hash
              </Button>
              {verificationResult !== null && (
                <div className={`p-4 rounded-md ${verificationResult ? 'bg-green-600' : 'bg-red-600'}`}>
                  {verificationResult ? (
                    <div className="flex items-center">
                      <Check className="w-5 h-5 mr-2" />
                      <span>Hash verified successfully!</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <span>Hash verification failed.</span>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <Button onClick={handleReset} className="w-full bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About SHA-384 Encrypt Verifier
          </h2>
          <p className="text-gray-300 mb-4">
            The SHA-384 Encrypt Verifier allows you to generate and verify SHA-384 hashes for text or file content. This tool provides a strong cryptographic hash function for secure data integrity verification and is widely used in digital signatures and SSL/TLS protocols.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use SHA-384 Encrypt Verifier
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Choose between "Encrypt" and "Verify" tabs based on your needs.</li>
            <li><strong>For encryption:</strong></li>
            <ul className="list-disc list-inside pl-5 space-y-1">
              <li>Enter the text you want to encrypt in the input field.</li>
              <li>Select the appropriate input encoding (UTF-8, ASCII, or Base64).</li>
              <li>Click the "Generate SHA384 Hash" button to create the hash.</li>
              <li>The resulting SHA384 hash will be displayed in the output field.</li>
              <li>Use the copy button to easily copy the hash to your clipboard.</li>
            </ul>
            <li><strong>For verification:</strong></li>
            <ul className="list-disc list-inside pl-5 space-y-1">
              <li>Enter the original text in the "Text to Verify" field.</li>
              <li>Enter the SHA384 hash you want to verify in the "SHA384 Hash to Verify" field.</li>
              <li>Click the "Verify SHA384 Hash" button to check if the hash matches the text.</li>
              <li>The verification result will be displayed below the button.</li>
            </ul>
            <li>Use the Reset button to clear all inputs and outputs.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features and Tips
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>SHA384 produces a 384-bit (48-byte) hash value for enhanced security.</li>
            <li>It is widely used in digital signatures, integrity verification, and SSL/TLS protocols.</li>
            <li>Part of the SHA-2 family, SHA384 offers a strong balance between security and performance.</li>
            <li>The input encoding options (UTF-8, ASCII, or Base64) ensure accurate handling of different input types.</li>
            <li>Always verify important hashes using the original source to maintain data integrity.</li>
            <li>Even a small change in the input data will result in a completely different hash output.</li>
            <li>SHA384 offers higher security than SHA256 but may be slower in performance. It is ideal for applications that require very high security.</li>
          </ul>
        </div>

      </main>
      <Footer />
    </div>
  )
}