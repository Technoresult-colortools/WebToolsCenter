'use client'

import React, { useState } from 'react'
import { Key, Lock, Copy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Switch } from "@/components/ui/switch"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast, { Toaster } from 'react-hot-toast'
import { KJUR } from 'jsrsasign'

type Algorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512'

interface JWTPayload {
  [key: string]: string | number | boolean | undefined;
  iat?: number;
  exp?: number;
  nbf?: number;
  sub?: string;
  iss?: string;
  aud?: string;
  jti?: string;
}

interface Claims {
  exp: string;
  nbf: string;
  sub: string;
  iss: string;
  aud: string;
  jti: string;
}

export default function JWTEncoderDecoder() {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode')
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256')
  const [signingKey, setSigningKey] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [jwtInput, setJwtInput] = useState('')
  const [jwtOutput, setJwtOutput] = useState('')
  const [decodedHeader, setDecodedHeader] = useState('')
  const [decodedPayload, setDecodedPayload] = useState('')
  const [autoSetIat, setAutoSetIat] = useState(true)
  const [showAdditionalClaims, setShowAdditionalClaims] = useState(false)
  const [claims, setClaims] = useState<Claims>({
    exp: '',
    nbf: '',
    sub: '',
    iss: '',
    aud: '',
    jti: ''
  })

  const handleEncode = () => {
    try {
      let payload: JWTPayload;
      try {
        payload = JSON.parse(jsonInput);
      } catch (parseError) {
        throw new Error('Invalid JSON input');
      }

      if (autoSetIat) {
        payload.iat = Math.floor(Date.now() / 1000);
      }

      Object.entries(claims).forEach(([key, value]) => {
        if (value) {
          if (key === 'exp' || key === 'nbf') {
            payload[key] = Math.floor(Date.now() / 1000) + parseInt(value);
          } else {
            payload[key] = value;
          }
        }
      });

      if (!signingKey) {
        throw new Error('Signing key is required');
      }

      const header = { alg: algorithm, typ: 'JWT' };
      const sHeader = JSON.stringify(header);
      const sPayload = JSON.stringify(payload);
      const token = KJUR.jws.JWS.sign(null, sHeader, sPayload, signingKey);

      setJwtOutput(token);
      setDecodedHeader(JSON.stringify(header, null, 2));
      setDecodedPayload(JSON.stringify(payload, null, 2));
      toast.success('JWT encoded successfully!');
    } catch (error) {
      toast.error('Error encoding JWT: ' + (error as Error).message);
    }
  };

  const handleDecode = () => {
    try {
      const isValid = KJUR.jws.JWS.verify(jwtInput, signingKey, [algorithm])
      if (!isValid) {
        throw new Error('Invalid signature')
      }
      const decoded = KJUR.jws.JWS.parse(jwtInput)
      setDecodedHeader(JSON.stringify(decoded.headerObj, null, 2))
      setDecodedPayload(JSON.stringify(decoded.payloadObj, null, 2))
      toast.success('JWT decoded successfully!')
    } catch (error) {
      toast.error('Error decoding JWT: ' + (error as Error).message)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleReset = () => {
    setJsonInput('')
    setJwtInput('')
    setJwtOutput('')
    setDecodedHeader('')
    setDecodedPayload('')
    setSigningKey('')
    setClaims({
      exp: '',
      nbf: '',
      sub: '',
      iss: '',
      aud: '',
      jti: ''
    })
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">JWT Encoder and Decoder</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'encode' | 'decode')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="encode" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Lock className="w-4 h-4 mr-2" />
                Encoder
              </TabsTrigger>
              <TabsTrigger value="decode" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Key className="w-4 h-4 mr-2" />
                Decoder
              </TabsTrigger>
            </TabsList>
            <TabsContent value="encode" className="space-y-4">
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <Label htmlFor="algorithm" className="text-white mb-2 block">Algorithm</Label>
                  <Select value={algorithm} onValueChange={(value: Algorithm) => setAlgorithm(value)}>
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="HS256">HS256</SelectItem>
                      <SelectItem value="HS384">HS384</SelectItem>
                      <SelectItem value="HS512">HS512</SelectItem>
                      <SelectItem value="RS256">RS256</SelectItem>
                      <SelectItem value="RS384">RS384</SelectItem>
                      <SelectItem value="RS512">RS512</SelectItem>
                      <SelectItem value="ES256">ES256</SelectItem>
                      <SelectItem value="ES384">ES384</SelectItem>
                      <SelectItem value="ES512">ES512</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/2">
                  <Label htmlFor="signingKey" className="text-white mb-2 block">Signing Key</Label>
                  <Input
                    id="signingKey"
                    type="password"
                    value={signingKey}
                    onChange={(e) => setSigningKey(e.target.value)}
                    className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    placeholder="Enter signing key..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="jsonInput" className="text-white mb-2 block">JSON Payload</Label>
                <Textarea
                  id="jsonInput"
                  placeholder="Enter JSON payload..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoSetIat"
                    checked={autoSetIat}
                    onCheckedChange={setAutoSetIat}
                  />
                  <Label htmlFor="autoSetIat" className="text-white">Auto-set "Issued at (iat)"</Label>
                </div>
                <Button
                  onClick={() => setShowAdditionalClaims(!showAdditionalClaims)}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  {showAdditionalClaims ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
                  Additional Claims
                </Button>
              </div>
              {showAdditionalClaims && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(claims).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={key} className="text-white mb-2 block capitalize">{key}</Label>
                      <Input
                        id={key}
                        value={value}
                        onChange={(e) => setClaims(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                        placeholder={`Enter ${key}...`}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div>
                <Label htmlFor="jwtOutput" className="text-white mb-2 block">JWT</Label>
                <Textarea
                  id="jwtOutput"
                  value={jwtOutput}
                  readOnly
                  className="w-full h-20 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <div className="flex justify-between">
                <Button onClick={handleEncode} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Encode
                </Button>
                <Button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white">
                  Reset
                </Button>
                <Button onClick={() => copyToClipboard(jwtOutput)} className="bg-green-500 hover:bg-green-600 text-white">
                  Copy JWT
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="decode" className="space-y-4">
              <div>
                <Label htmlFor="jwtInput" className="text-white mb-2 block">JWT</Label>
                <Textarea
                  id="jwtInput"
                  placeholder="Enter JWT..."
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  className="w-full h-20 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <div>
                <Label htmlFor="decodeSigningKey" className="text-white mb-2 block">Signing Key (for verification)</Label>
                <Input
                  id="decodeSigningKey"
                  type="password"
                  value={signingKey}
                  onChange={(e) => setSigningKey(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  placeholder="Enter signing key..."
                />
              </div>
              <div>
                <Label htmlFor="decodedHeader" className="text-white mb-2 block">Decoded Header</Label>
                <Textarea
                  id="decodedHeader"
                  value={decodedHeader}
                  readOnly
                  className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <div>
                <Label htmlFor="decodedPayload" className="text-white mb-2 block">Decoded Payload</Label>
                <Textarea
                  id="decodedPayload"
                  value={decodedPayload}
                  readOnly
                  className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <div className="flex justify-between">
                <Button onClick={handleDecode} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Decode
                </Button>
                <Button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={() => copyToClipboard(decodedPayload)} className="bg-green-500 hover:bg-green-600 text-white">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">What is JWT?</h2>
            
            <div className="text-white space-y-4">
              <p className="text-gray-300">
                JSON Web Token (JWT) is a compact, URL-safe way of representing claims to be transferred between two parties. The token consists of three parts: Header, Payload, and Signature.
              </p>

              <h3 className="text-lg font-semibold text-white">JWT Structure</h3>
              <ul className="list-disc list-inside text-gray-300">
                <li><strong>Header</strong>: Specifies the signing algorithm and token type.</li>
                <li><strong>Payload</strong>: Contains the claims, usually information about the user.</li>
                <li><strong>Signature</strong>: Verifies the integrity and authenticity of the token.</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">Example JWT</h3>
              <div className="bg-gray-700 rounded-lg p-4 text-sm font-mono text-green-400 overflow-auto">
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
              </div>

              <h3 className="text-lg font-semibold text-white">JWT Encode and Decode</h3>
              <p className="text-gray-300">
                The process of encoding and decoding a JWT involves converting the claims into a base64-encoded string and adding a digital signature.
              </p>

              <h4 className="text-md font-semibold text-white">JWT Encoding (Example)</h4>
              <pre className="bg-gray-700 rounded-lg p-4 text-sm font-mono text-green-400 overflow-auto">
                {`const header = {
  "alg": "HS256",
  "typ": "JWT"
};

const payload = {
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
};

// Create a JWT (encoded)
const encodedToken = base64UrlEncode(header) + "." + base64UrlEncode(payload) + "." + sign(header, payload);`}
              </pre>

              <h4 className="text-md font-semibold text-white">JWT Decoding (Example)</h4>
              <pre className="bg-gray-700 rounded-lg p-4 text-sm font-mono text-green-400 overflow-auto">
                {`const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Split the token into parts
const [header, payload, signature] = token.split('.');

// Decode the header and payload (they are base64Url encoded)
const decodedHeader = base64UrlDecode(header);
const decodedPayload = base64UrlDecode(payload);`}
              </pre>
              
              <p className="text-gray-300">
                The signature is verified using a secret key or a public/private key pair.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}