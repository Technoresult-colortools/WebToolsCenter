'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import Checkbox from "@/components/ui/Checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { RefreshCw, Copy, Eye, EyeOff, Shield, Settings, Sliders, Lock, Filter, Info, BookOpen, Lightbulb } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

interface CheckboxItemProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function AdvancedPasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [requireEveryType, setRequireEveryType] = useState(true)
  const [beginWithLetter, setBeginWithLetter] = useState(false)
  const [noConsecutive, setNoConsecutive] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [customCharSet, setCustomCharSet] = useState('')
  const [useCustomCharSet, setUseCustomCharSet] = useState(false)
  const [excludedChars, setExcludedChars] = useState('')
  const [passwordCount, setPasswordCount] = useState(1)

  const generatePassword = useCallback(() => {
    try {
      let charset = ''
      if (useLowercase) charset += CHAR_SETS.lowercase
      if (useUppercase) charset += CHAR_SETS.uppercase
      if (useNumbers) charset += CHAR_SETS.numbers
      if (useSymbols) charset += CHAR_SETS.symbols
      if (useCustomCharSet && customCharSet) charset += customCharSet

      // Handle empty charset
      if (charset.length === 0) {
        toast.error('Please select at least one character type')
        return
      }

      if (excludeSimilar) {
        charset = charset.replace(/[ilLI|`1oO0]/g, '')
      }

      if (excludeAmbiguous) {
        charset = charset.replace(/[{}\[\]()\/\\'"~,;.<>]/g, '')
      }      

      if (excludedChars) {
        const excludeSet = new Set(excludedChars)
        charset = charset.split('').filter(char => !excludeSet.has(char)).join('')
      }

      // Check if charset is still valid after exclusions
      if (charset.length === 0) {
        toast.error('No characters available after applying exclusions')
        return
      }

      const generateSinglePassword = () => {
        let result = ''
        const charsetArray = charset.split('')
        const getRandomChar = () => charsetArray[Math.floor(Math.random() * charsetArray.length)]

        // Handle begin with letter
        if (beginWithLetter) {
          const letters = (CHAR_SETS.lowercase + CHAR_SETS.uppercase).split('')
          if (letters.length === 0) {
            toast.error('No letters available for password beginning')
            return ''
          }
          result += letters[Math.floor(Math.random() * letters.length)]
        }

        // Generate password
        let attempts = 0
        const maxAttempts = 1000 // Prevent infinite loops
        while (result.length < length && attempts < maxAttempts) {
          const char = getRandomChar()
          if (noConsecutive && result[result.length - 1] === char) {
            attempts++
            continue
          }
          result += char
          attempts = 0
        }

        if (attempts >= maxAttempts) {
          toast.error('Unable to generate password with current constraints')
          return ''
        }

        // Handle require every type
        if (requireEveryType) {
          const types = [
            { condition: useLowercase, charset: CHAR_SETS.lowercase, name: 'lowercase' },
            { condition: useUppercase, charset: CHAR_SETS.uppercase, name: 'uppercase' },
            { condition: useNumbers, charset: CHAR_SETS.numbers, name: 'number' },
            { condition: useSymbols, charset: CHAR_SETS.symbols, name: 'symbol' },
          ]

          const missingTypes = types.filter(type => 
            type.condition && !new RegExp(`[${type.charset}]`).test(result)
          )

          if (missingTypes.length > 0) {
            if (result.length < missingTypes.length) {
              toast.error('Password length too short to include all required types')
              return ''
            }

            missingTypes.forEach(type => {
              const index = Math.floor(Math.random() * result.length)
              const char = type.charset[Math.floor(Math.random() * type.charset.length)]
              result = result.substring(0, index) + char + result.substring(index + 1)
            })
          }
        }

        return result
      }

      const passwords = Array.from({ length: passwordCount }, generateSinglePassword)
        .filter(Boolean) // Remove empty passwords if generation failed
      
      if (passwords.length === 0) {
        toast.error('Failed to generate any valid passwords')
        return
      }

      setPassword(passwords.join('\n'))
    } catch (error) {
      console.error('Password generation error:', error)
      toast.error('An error occurred while generating the password')
    }
  }, [length, useLowercase, useUppercase, useNumbers, useSymbols, excludeSimilar, 
      excludeAmbiguous, requireEveryType, beginWithLetter, noConsecutive, 
      customCharSet, useCustomCharSet, excludedChars, passwordCount])

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  const calculatePasswordStrength = useCallback((pwd: string): string => {
    if (!pwd) return 'N/A'
    
    const hasLower = /[a-z]/.test(pwd)
    const hasUpper = /[A-Z]/.test(pwd)
    const hasNumber = /\d/.test(pwd)
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)
    const length = pwd.length

    let strength = 0
    if (hasLower) strength += 1
    if (hasUpper) strength += 1
    if (hasNumber) strength += 1
    if (hasSymbol) strength += 1
    if (length >= 12) strength += 1
    if (length >= 16) strength += 1

    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak'
      case 2:
        return 'Weak'
      case 3:
        return 'Moderate'
      case 4:
        return 'Strong'
      case 5:
      case 6:
        return 'Very Strong'
      default:
        return 'Unknown'
    }
  }, [])

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password.split('\n')[0]))
  }, [password, calculatePasswordStrength])

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      toast.success('Password copied to clipboard!')
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Failed to copy password')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Advanced Password Generator</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Generated Password</h2>
            <div className="flex items-center space-x-2">
              <Shield className={`${
                passwordStrength === 'Very Strong' ? 'text-green-500' :
                passwordStrength === 'Strong' ? 'text-green-400' :
                passwordStrength === 'Moderate' ? 'text-yellow-500' :
                passwordStrength === 'Weak' ? 'text-orange-500' :
                'text-red-500'
              }`} />
              <span className="text-white">Strength: {passwordStrength}</span>
            </div>
          </div>
          
          <div className="relative">
             
            <textarea
              value={password}
              readOnly
              className="w-full h-24 sm:h-40 p-4 bg-gray-700 text-white border border-gray-600 rounded-md font-mono"
              style={{ 
                resize: 'none',
                /* @ts-ignore */
                WebkitTextSecurity: showPassword ? 'none' : 'disc'
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-4 p-2 rounded-md bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              onClick={handleCopyToClipboard} 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Copy className="h-5 w-5 mr-2" />
              Copy
            </Button>
            <Button 
              onClick={generatePassword} 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Generate
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Password Settings</h2>
          <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-2 mb-4">
            <TabsTrigger value="basic" className="flex items-center justify-center">
              <Settings className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center justify-center">
              <Sliders className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center justify-center">
              <Lock className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center justify-center">
              <Filter className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Custom</span>
            </TabsTrigger>
          </TabsList>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <TabsContent value="basic">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="length-slider" className="text-white mb-2 block">
                      Password Length: {length}
                    </Label>
                    <Slider
                      id="length-slider"
                      min={8}
                      max={64}
                      step={1}
                      value={length}
                      onChange={(value) => setLength(value)}
                      className="my-4"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CheckboxItem 
                      id="" 
                      label="Include Lowercase" 
                      checked={useLowercase} 
                      onChange={setUseLowercase}
                    />
                    <CheckboxItem 
                      id="" 
                      label="Include Uppercase" 
                      checked={useUppercase} 
                      onChange={setUseUppercase}
                    />
                    <CheckboxItem 
                      id="" 
                      label="Include Numbers" 
                      checked={useNumbers} 
                      onChange={setUseNumbers}
                    />
                    <CheckboxItem 
                      id="" 
                      label="Include Symbols" 
                      checked={useSymbols} 
                      onChange={setUseSymbols}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CheckboxItem 
                    id="" 
                    label="Require Every Type" 
                    checked={requireEveryType} 
                    onChange={setRequireEveryType}
                  />
                  <CheckboxItem 
                    id="" 
                    label="Begin With a Letter" 
                    checked={beginWithLetter} 
                    onChange={setBeginWithLetter}
                  />
                  <CheckboxItem 
                    id="" 
                    label="No Consecutive Characters" 
                    checked={noConsecutive} 
                    onChange={setNoConsecutive}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="security">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CheckboxItem 
                    id="" 
                    label="Exclude Similar Characters (i, l, 1, L, o, 0, O)" 
                    checked={excludeSimilar} 
                    onChange={setExcludeSimilar}
                  />
                  <CheckboxItem 
                    id="" 
                    label="Exclude Ambiguous Characters ({}, [], (), /, \)" 
                    checked={excludeAmbiguous} 
                    onChange={setExcludeAmbiguous}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="custom">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="password-count" className="text-white mb-2 block">
                      Number of Passwords
                    </Label>
                    <Select 
                      value={passwordCount.toString()} 
                      onValueChange={(value) => setPasswordCount(parseInt(value))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <CheckboxItem 
                      id="" 
                      label="Use Custom Character Set" 
                      checked={useCustomCharSet} 
                      onChange={setUseCustomCharSet}
                    />
                    {useCustomCharSet && (
                      <Input
                        placeholder="Enter custom characters"
                        value={customCharSet}
                        onChange={(e) => setCustomCharSet(e.target.value)}
                        className="mt-2 bg-gray-600 text-white"
                      />
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="excluded-chars" className="text-white mb-2 block">
                      Excluded Characters
                    </Label>
                    <Input
                      id="excluded-chars"
                      placeholder="Characters to exclude"
                      value={excludedChars}
                      onChange={(e) => setExcludedChars(e.target.value)}
                      className="bg-gray-600 text-white"
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is Advanced Password Generator?
          </h2>
          <p className="text-gray-300 mb-4">
            The Advanced Password Generator is a comprehensive tool designed to help users generate secure and customizable passwords quickly. It allows you to create strong passwords of various lengths and complexities, making it ideal for securing sensitive accounts and data. This tool provides multiple options to include or exclude different character sets, such as uppercase letters, lowercase letters, numbers, and special symbols.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use Advanced Password Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Select the length of the password you wish to generate using the length slider.</li>
            <li>Choose which types of characters to include in the password by toggling options for uppercase letters, lowercase letters, numbers, and special characters.</li>
            <li>If you prefer a password without ambiguous characters (such as 0, O, I, l), enable the "Exclude Ambiguous Characters" option.</li>
            <li>Click the <strong>Generate Password</strong> button to create a new password based on your selected preferences.</li>
            <li>Use the <strong>Copy</strong> button to copy the generated password to your clipboard for easy use.</li>
            <li>If you’re not satisfied with the generated password, adjust the settings and generate a new one.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Customizable password length: Choose a password length ranging from 8 to 64 characters.</li>
            <li>Character set options: Include or exclude uppercase letters, lowercase letters, numbers, and special symbols.</li>
            <li>Ambiguity control: Exclude similar-looking characters like O, 0, I, and l to avoid confusion.</li>
            <li>One-click copy functionality: Easily copy generated passwords to your clipboard.</li>
            <li>Responsive design: Works seamlessly across various devices, including mobile and desktop.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips & Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>For optimal security, use a mix of uppercase letters, lowercase letters, numbers, and special symbols in your password.</li>
            <li>Make your passwords longer for better security. Aim for at least 12-16 characters.</li>
            <li>Use the "Exclude Ambiguous Characters" option when creating passwords for systems that have difficulty distinguishing between similar characters.</li>
            <li>Test different password settings to ensure that generated passwords meet the security requirements of the platform you’re using.</li>
            <li>Store your generated passwords in a password manager to ensure you don’t lose them and to keep them secure.</li>
          </ul>
        </div>

      </main>
      <Footer />
    </div>
  )
}

// Helper component for checkboxes
function CheckboxItem({ id, label, checked, onChange }: CheckboxItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={checked} 
        onChange={onChange}
      />
      <Label 
        htmlFor={id}
        className="text-white cursor-pointer"
      >
        {label}
      </Label>
    </div>
  )
}