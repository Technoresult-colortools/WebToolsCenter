'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Key, Lock, Copy, RefreshCw, ChevronDown, ChevronUp, Lightbulb, BookOpen, Info, Code, Terminal, AlertTriangle, Check, X } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { toast, Toaster } from 'react-hot-toast'
import { KJUR } from 'jsrsasign'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'

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

const formatJWT = (jwt: string): string => {
  const parts = jwt.split('.');
  return parts.join('.\n');
}

const parseJWT = (jwt: string): string => {
  return jwt.replace(/\s/g, '');
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
  const [isDecoding, setIsDecoding] = useState(false)
  const [jwtValidity, setJwtValidity] = useState<boolean | null>(null)
  const [expirationStatus, setExpirationStatus] = useState<'valid' | 'expired' | 'not-yet-valid' | null>(null)

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
      
      setJwtOutput(formatJWT(token));
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
      const parsedJWT = parseJWT(jwtInput);
      // First try to decode without verification
      const decoded = KJUR.jws.JWS.parse(parsedJWT);
      setDecodedHeader(JSON.stringify(decoded.headerObj, null, 2));
      setDecodedPayload(JSON.stringify(decoded.payloadObj, null, 2));
      
      // Then verify the signature
      const isValid = KJUR.jws.JWS.verify(parsedJWT, signingKey, [algorithm]);
      setJwtValidity(isValid);
      
      if (!isValid) {
        toast.error('Warning: JWT signature verification failed');
      } else {
        toast.success('JWT decoded and verified successfully!');
      }

      // Check expiration
      const payload = decoded.payloadObj as JWTPayload;
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        setExpirationStatus('expired');
      } else if (payload.nbf && payload.nbf > currentTime) {
        setExpirationStatus('not-yet-valid');
      } else {
        setExpirationStatus('valid');
      }
    } catch (error) {
      toast.error(`Error decoding JWT: ${(error as Error).message}`);
      setDecodedHeader('');
      setDecodedPayload('');
      setJwtValidity(null);
      setExpirationStatus(null);
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
    setJwtValidity(null);
    setExpirationStatus(null);
    toast.success('Reset successful!');
  };

  useEffect(() => {
    // Reset JWT validity and expiration status when changing tabs
    setJwtValidity(null);
    setExpirationStatus(null);
  }, [activeTab]);

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
            <div className="flex justify-between items-center">
              <Button 
                onClick={handleDecode} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isDecoding}
              >
                {isDecoding ? 'Decoding...' : 'Decode'}
              </Button>
              <div className="flex items-center space-x-2">
                {jwtValidity !== null && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {jwtValidity ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {jwtValidity ? 'JWT signature is valid' : 'JWT signature is invalid'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {expirationStatus && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {expirationStatus === 'valid' && <Check className="text-green-500" />}
                        {expirationStatus === 'expired' && <AlertTriangle className="text-yellow-500" />}
                        {expirationStatus === 'not-yet-valid' && <AlertTriangle className="text-blue-500" />}
                      </TooltipTrigger>
                      <TooltipContent>
                        {expirationStatus === 'valid' && 'JWT is currently valid'}
                        {expirationStatus === 'expired' && 'JWT has expired'}
                        {expirationStatus === 'not-yet-valid' && 'JWT is not yet valid'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={() => copyToClipboard(decodedPayload)} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!decodedPayload}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is JWT?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.
          </p>

          <div className="my-8">
            <Image 
              src="/Images/JWTEncoderPreview.png?height=400&width=600"  
              alt="Diagram showing the structure of a JWT" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            JWT Structure
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Header:</strong> Contains metadata about the token type and the hashing algorithm used to sign the token.</li>
            <li><strong>Payload:</strong> Contains claims. Claims are statements about an entity (typically, the user) and additional data.</li>
            <li><strong>Signature:</strong> Ensures that the token hasn't been altered. The party that creates the JWT signs the header and payload with a secret key.</li>
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
            JWT Encode and Decode Process
          </h2>
          <p className="text-gray-300 mb-4">
            The process of encoding and decoding a JWT involves several steps:
          </p>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Encoding:</strong> Combine the encoded header, encoded payload, and the signature.</li>
            <li><strong>Decoding:</strong> Split the JWT into its three parts and decode the header and payload.</li>
            <li><strong>Verification:</strong> Check the signature to ensure the token hasn't been tampered with.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features and Best Practices
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>JWTs are stateless, reducing the need for server-side storage.</li>
            <li>They can be used across different domains, making them ideal for single sign-on scenarios.</li>
            <li>Always use HTTPS to prevent token interception.</li>
            <li>Keep tokens short-lived to minimize the impact of token theft.</li>
            <li>Store tokens securely on the client-side, preferably in HTTP-only cookies.</li>
            <li>Implement token revocation mechanisms for added security.</li>
            <li>Regularly rotate signing keys to limit the impact of key compromise.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Common Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Authentication:</strong> After a user logs in, the server issues a JWT that the client includes in subsequent requests.</li>
            <li><strong>Information Exchange:</strong> JWTs can securely transmit information between parties due to their digital signature.</li>
            <li><strong>Single Sign-On (SSO):</strong> JWTs allow for federated authentication across multiple systems.</li>
            <li><strong>Stateless Authentication:</strong> Servers can verify tokens without needing to store session information.</li>
            <li><strong>Mobile App Authentication:</strong> JWTs are well-suited for authenticating native mobile applications.</li>
          </ul>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

