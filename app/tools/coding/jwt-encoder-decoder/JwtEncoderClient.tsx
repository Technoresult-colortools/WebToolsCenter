'use client'

import React, { useState, useCallback } from 'react'
import { Key, Lock, Copy, RefreshCw, ChevronDown, ChevronUp, Lightbulb, BookOpen, Info, Code, Terminal } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Switch } from "@/components/ui/switch"
import toast, { Toaster } from 'react-hot-toast'
import { KJUR } from 'jsrsasign'
import ToolLayout from '@/components/ToolLayout'

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

const DEFAULT_CLAIMS: Claims = {
  exp: '',
  nbf: '',
  sub: '',
  iss: '',
  aud: '',
  jti: ''
}

const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
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
  const [claims, setClaims] = useState<Claims>(DEFAULT_CLAIMS)
  const [isEncoding, setIsEncoding] = useState(false)
  const [, setIsDecoding] = useState(false)

  const validateInput = useCallback(() => {
    if (!signingKey.trim()) {
      toast.error('Signing key is required');
      return false;
    }

    if (activeTab === 'encode' && !isValidJSON(jsonInput)) {
      toast.error('Invalid JSON payload');
      return false;
    }

    if (activeTab === 'decode' && !jwtInput.trim()) {
      toast.error('JWT input is required');
      return false;
    }

    return true;
  }, [signingKey, jsonInput, jwtInput, activeTab]);

  const handleEncode = async () => {
    if (!validateInput()) return;
    
    setIsEncoding(true);
    try {
      const payload: JWTPayload = JSON.parse(jsonInput);

      if (autoSetIat) {
        payload.iat = Math.floor(Date.now() / 1000);
      }

      // Process claims
      Object.entries(claims).forEach(([key, value]) => {
        if (value) {
          if (key === 'exp' || key === 'nbf') {
            const offset = parseInt(value);
            if (isNaN(offset)) {
              throw new Error(`Invalid ${key} value: must be a number`);
            }
            payload[key] = Math.floor(Date.now() / 1000) + offset;
          } else {
            payload[key] = value;
          }
        }
      });

      const header = { alg: algorithm, typ: 'JWT' };
      const sHeader = JSON.stringify(header);
      const sPayload = JSON.stringify(payload);
      
      const token = KJUR.jws.JWS.sign(null, sHeader, sPayload, signingKey);
      
      setJwtOutput(token);
      setDecodedHeader(JSON.stringify(header, null, 2));
      setDecodedPayload(JSON.stringify(payload, null, 2));
      toast.success('JWT encoded successfully!');
    } catch (error) {
      toast.error(`Error encoding JWT: ${(error as Error).message}`);
    } finally {
      setIsEncoding(false);
    }
  };

  const handleDecode = async () => {
    if (!validateInput()) return;
    
    setIsDecoding(true);
    try {
      // First try to decode without verification
      const decoded = KJUR.jws.JWS.parse(jwtInput);
      setDecodedHeader(JSON.stringify(decoded.headerObj, null, 2));
      setDecodedPayload(JSON.stringify(decoded.payloadObj, null, 2));
      
      // Then verify the signature
      const isValid = KJUR.jws.JWS.verify(jwtInput, signingKey, [algorithm]);
      if (!isValid) {
        toast.error('Warning: JWT signature verification failed');
        return;
      }
      
      toast.success('JWT decoded and verified successfully!');
    } catch (error) {
      toast.error(`Error decoding JWT: ${(error as Error).message}`);
      setDecodedHeader('');
      setDecodedPayload('');
    } finally {
      setIsDecoding(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleReset = () => {
    setJsonInput('');
    setJwtInput('');
    setJwtOutput('');
    setDecodedHeader('');
    setDecodedPayload('');
    setSigningKey('');
    setClaims(DEFAULT_CLAIMS);
    toast.success('Reset successful!');
  };



  return (
    <ToolLayout
      title="JWT Encoder and Decoder"
      description="Securely encode and decode JSON Web Tokens (JWT) for authentication and data exchange"
    >

      <Toaster position="top-right" />
          
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
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="algorithm" className="text-white mb-2 block">Algorithm</Label>
                    <Select value={algorithm} onValueChange={(value: Algorithm) => setAlgorithm(value)}>
                      <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select algorithm" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        {['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'].map((alg) => (
                          <SelectItem key={alg} value={alg}>{alg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/2">
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
                    className="bg-gray-700 hover:bg-gray-600 text-white w-full md:w-auto py-2 px-4 md:py-2 md:px-6 flex items-center justify-center"
                  >
                    {showAdditionalClaims ? (
                      <ChevronUp className="mr-2" />
                    ) : (
                      <ChevronDown className="mr-2" />
                    )}
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
                  <Button 
                    onClick={handleEncode} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isEncoding}
                  >
                    {isEncoding ? 'Encoding...' : 'Encode'}
                  </Button>
                  <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Reset
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(jwtOutput)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!jwtOutput}
                  >
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
                  <Button onClick={handleDecode} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Decode
                  </Button>
                  <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={() => copyToClipboard(decodedPayload)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy JSON
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is JWT?
            </h2>
            <p className="text-gray-300 mb-4">
              JSON Web Token (JWT) is a compact, URL-safe way of representing claims to be transferred between two parties. JWT is widely used for authentication and secure information exchange in web applications. Each JWT consists of three main parts: Header, Payload, and Signature.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              JWT Structure
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>Header:</strong> Specifies the token type (usually JWT) and the signing algorithm (e.g., HS256).</li>
              <li><strong>Payload:</strong> Contains the claims, typically information about the user or other metadata. For example, claims can include the user’s ID, username, and issued time.</li>
              <li><strong>Signature:</strong> Verifies the integrity of the token. The signature is created using the header, payload, and a secret key.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Code className="w-6 h-6 mr-2" />
              Example JWT
            </h2>
            <p className="text-gray-300 mb-4">
              A sample JWT might look like this:
            </p>
            <p className="text-gray-300 mb-4 font-mono bg-gray-900 p-2 rounded-lg break-all">
              eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Terminal className="w-6 h-6 mr-2" />
              JWT Encode and Decode
            </h2>
            <p className="text-gray-300 mb-4">
              The process of encoding and decoding a JWT involves converting the claims into a Base64-encoded string and adding a digital signature. The token is typically passed in HTTP headers during authentication.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Code className="w-6 h-6 mr-2" />
              JWT Encoding (Example)
            </h2>
            <pre className="text-gray-300 bg-gray-900 p-4 rounded-lg overflow-auto">
            {`
          const header = {
            "alg": "HS256",
            "typ": "JWT"
          };

          const payload = {
            "sub": "1234567890",
            "name": "John Doe",
            "iat": 1516239022
          };

          // Create a JWT (encoded)
          const encodedToken = base64UrlEncode(header) + "." + base64UrlEncode(payload) + "." + sign(header, payload);
          `}
            </pre>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Code className="w-6 h-6 mr-2" />
              JWT Decoding (Example)
            </h2>
            <pre className="text-gray-300 bg-gray-900 p-4 rounded-lg overflow-auto">
            {`
          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

          // Split the token into parts
          const [header, payload, signature] = token.split('.');

          // Decode the header and payload (they are base64Url encoded)
          const decodedHeader = base64UrlDecode(header);
          const decodedPayload = base64UrlDecode(payload);
            `}
            </pre>

            <p className="text-gray-300 mb-4">
              The signature is verified using a secret key (for symmetric algorithms) or a public/private key pair (for asymmetric algorithms like RS256). JWT is widely used for secure web-based authentication, where the client receives a token upon login and sends it with each request to verify their identity.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features and Tips
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>JWTs are self-contained, meaning all the information needed for authentication is stored within the token itself.</li>
              <li>JWTs can be used in both cookies or Authorization headers in HTTP requests.</li>
              <li>JWTs are not encrypted by default, so sensitive information should not be stored in them unless using a secure transmission protocol like HTTPS.</li>
              <li>Always verify the signature of the JWT to ensure it hasn’t been tampered with.</li>
              <li>JWT tokens typically have an expiration time (`exp` claim), which limits their validity period.</li>
              <li>To secure JWTs, use strong secret keys for signing and validate tokens on the server side.</li>
            </ul>
          </div>
  </ToolLayout>
  )
}