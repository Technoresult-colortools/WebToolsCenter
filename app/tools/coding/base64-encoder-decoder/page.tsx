'use client'

import React, { useState, useEffect, useRef,} from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileLock, FileLock2, Upload, Copy, RefreshCw } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Textarea } from "@/components/ui/textarea"

export default function Base64EncoderDecoder() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const [fileName, setFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEncode = () => {
    try {
      const encoded = btoa(inputText)
      setOutputText(encoded)
    } catch (error) {
      toast.error('Error encoding text. Make sure it\'s valid UTF-8.')
    }
  }

  const handleDecode = () => {
    try {
      const decoded = atob(inputText)
      setOutputText(decoded)
    } catch (error) {
      toast.error('Error decoding text. Make sure it\'s valid Base64.')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
  
    if (file) {
      const maxSizeInMB = 5
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File is too large. Maximum size is ${maxSizeInMB}MB.`)
        return
      }
  
      const allowedTypes = ['text/plain', 'image/png', 'image/jpeg']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a PNG, JPEG, or text file.')
        return
      }
  
      setFileName(file.name)
  
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          // Check if file content is Base64 (simple check)
          const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  
          if (base64Regex.test(result.trim())) {
            try {
              // If the file content looks like Base64, decode it
              const decoded = atob(result)
              setInputText(result) // Show Base64 content in input
              setOutputText(decoded) // Show decoded text in output
              setActiveTab('decode') // Automatically switch to decode tab
              toast.success('Base64 file decoded successfully!')
            } catch (err) {
              toast.error('Error decoding Base64 content. Invalid Base64 format.')
            }
          } else {
            // If not Base64, treat it as a plain text file and encode it
            setInputText(result) // Raw file content in "Text to Encode" input
            const base64 = btoa(result) // Encode file content to Base64
            setOutputText(base64) // Show encoded Base64 in output
            setActiveTab('encode') // Stay on encode tab
            toast.success('File uploaded and encoded successfully!')
          }
        }
      }
  
      reader.onerror = () => {
        toast.error('Error reading file. Please try again.')
      }
  
      reader.readAsText(file) // Always read as text for simplicity
    }
  }
  
  
  

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleReset = () => {
    setInputText("")
    setOutputText("")
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.success('All fields have been reset.')
  }


  useEffect(() => {
    if (activeTab === 'encode') {
      handleEncode()
    } else {
      handleDecode()
    }
  }, [inputText, activeTab])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Base64 Encoder/Decoder</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="space-y-8">
            <Tabs defaultValue="encode" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="encode">
                  <FileLock className="w-4 h-4 mr-2" />
                  Encode
                </TabsTrigger>
                <TabsTrigger value="decode">
                  <FileLock2 className="w-4 h-4 mr-2" />
                  Decode
                </TabsTrigger>
              </TabsList>
              <TabsContent value="encode">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text" className="text-white mb-2 block">Text to Encode</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Enter text to encode..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="output-text" className="text-white mb-2 block">Encoded Base64</Label>
                    <Textarea
                      id="output-text"
                      value={outputText}
                      readOnly
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="decode">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text" className="text-white mb-2 block">Base64 to Decode</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Enter Base64 to decode..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="output-text" className="text-white mb-2 block">Decoded Text</Label>
                    <Textarea
                      id="output-text"
                      value={outputText}
                      readOnly
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap gap-4">
              <Button onClick={() => copyToClipboard(outputText)} className="bg-blue-600 hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy {activeTab === 'encode' ? 'Encoded' : 'Decoded'}
              </Button>
              <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Upload File to Encode</h3>
              <div className="flex items-center space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="bg-gray-700 text-white border-gray-600"
                  ref={fileInputRef}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              {fileName && (
                <p className="text-sm text-gray-300">Uploaded: {fileName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Choose between Encode and Decode tabs.</li>
            <li>Enter your text or Base64 in the input area.</li>
            <li>The result will appear automatically in the output area.</li>
            <li>Use the Copy button to copy the result to your clipboard.</li>
            <li>To encode a file:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Click the "Upload" button or use the file input.</li>
              <li>Select a file from your device.</li>
              <li>The file will be encoded to Base64 and displayed in the input area.</li>
            </ul>
            <li>Use the Reset button to clear all inputs and outputs.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-white mb-4 mt-8">Tips</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Make sure your input is valid UTF-8 text when encoding.</li>
            <li>When decoding, ensure your input is valid Base64.</li>
            <li>Large files may take longer to encode.</li>
            <li>The tool automatically switches to the Decode tab when you upload a file.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}