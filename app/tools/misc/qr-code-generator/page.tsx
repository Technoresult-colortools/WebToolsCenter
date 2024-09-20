'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Use dynamic import for QRCodeCanvas without a duplicate declaration
const QRCodeCanvas = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeCanvas), { ssr: false });

type QRCodeType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';


export default function QRCodeGenerator() {
  // State variables
  const [qrType, setQRType] = useState<QRCodeType>('url');
  const [qrValue, setQRValue] = useState<string>('');
  const [qrSize, setQRSize] = useState<number>(256);
  const [qrFgColor, setQrFgColor] = useState<string>('#000000');
  const [qrBgColor, setQrBgColor] = useState<string>('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('M');
  const [includeMargin, setIncludeMargin] = useState<boolean>(true);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoSize, setLogoSize] = useState<number>(50);
  const [qrStyle, setQrStyle] = useState<'squares' | 'dots'>('squares');

  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [smsBody, setSmsBody] = useState<string>('');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<'WEP' | 'WPA' | 'nopass'>('WPA');

  useEffect(() => {
    generateQRValue();
  }, [qrType, qrValue, emailSubject, emailBody, phoneNumber, smsBody, wifiSsid, wifiPassword, wifiEncryption]);


  const generateQRValue = () => {
    switch (qrType) {
      case 'url':
      case 'text':
        return qrValue;
      case 'email':
        return `mailto:${qrValue}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber}`;
      case 'sms':
        return `sms:${phoneNumber}${smsBody ? `?body=${encodeURIComponent(smsBody)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      default:
        return '';
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Advance QR Code Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">QR Code Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="qr-type" className="text-white mb-2 block">QR Code Type</Label>
                  <Select value={qrType} onValueChange={(value: QRCodeType) => setQRType(value)}>
                    <SelectTrigger id="qr-type" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select QR code type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="wifi">Wi-Fi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {qrType === 'url' && (
                  <div>
                    <Label htmlFor="url-input" className="text-white mb-2 block">URL</Label>
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="https://example.com"
                      value={qrValue}
                      onChange={(e) => setQRValue(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                )}

                {qrType === 'text' && (
                  <div>
                    <Label htmlFor="text-input" className="text-white mb-2 block">Text</Label>
                    <Textarea
                      id="text-input"
                      placeholder="Enter your text here"
                      value={qrValue}
                      onChange={(e) => setQRValue(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                )}

                {qrType === 'email' && (
                  <>
                    <div>
                      <Label htmlFor="email-input" className="text-white mb-2 block">Email Address</Label>
                      <Input
                        id="email-input"
                        type="email"
                        placeholder="example@example.com"
                        value={qrValue}
                        onChange={(e) => setQRValue(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-subject" className="text-white mb-2 block">Subject</Label>
                      <Input
                        id="email-subject"
                        type="text"
                        placeholder="Email subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-body" className="text-white mb-2 block">Body</Label>
                      <Textarea
                        id="email-body"
                        placeholder="Email body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </>
                )}

                {qrType === 'phone' && (
                  <div>
                    <Label htmlFor="phone-input" className="text-white mb-2 block">Phone Number</Label>
                    <Input
                      id="phone-input"
                      type="tel"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                )}

                {qrType === 'sms' && (
                  <>
                    <div>
                      <Label htmlFor="sms-phone" className="text-white mb-2 block">Phone Number</Label>
                      <Input
                        id="sms-phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sms-body" className="text-white mb-2 block">Message</Label>
                      <Textarea
                        id="sms-body"
                        placeholder="SMS message"
                        value={smsBody}
                        onChange={(e) => setSmsBody(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </>
                )}

                {qrType === 'wifi' && (
                  <>
                    <div>
                      <Label htmlFor="wifi-ssid" className="text-white mb-2 block">Network Name (SSID)</Label>
                      <Input
                        id="wifi-ssid"
                        type="text"
                        placeholder="Wi-Fi network name"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi-password" className="text-white mb-2 block">Password</Label>
                      <Input
                        id="wifi-password"
                        type="password"
                        placeholder="Wi-Fi password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi-encryption" className="text-white mb-2 block">Encryption</Label>
                      <Select value={wifiEncryption} onValueChange={(value: 'WEP' | 'WPA' | 'nopass') => setWifiEncryption(value)}>
                        <SelectTrigger id="wifi-encryption" className="bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select encryption type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="nopass">No encryption</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="qr-size" className="text-white mb-2 block">QR Code Size: {qrSize}x{qrSize}</Label>
                  <Slider
                    id="qr-size"
                    min={128}
                    max={512}
                    step={8}
                    value={qrSize}
                    onChange={(value) => setQRSize(value)}
                  />
                </div>

                <div>
                  <Label htmlFor="error-correction" className="text-white mb-2 block">Error Correction Level</Label>
                  <Select value={errorCorrectionLevel} onValueChange={(value: ErrorCorrectionLevel) => setErrorCorrectionLevel(value)}>
                    <SelectTrigger id="error-correction" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select error correction level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-margin" className="text-white">Include Margin</Label>
                  <Switch
                    id="include-margin"
                    checked={includeMargin}
                    onCheckedChange={setIncludeMargin}
                  />
                </div>

                <div>
                  <Label htmlFor="qr-style" className="text-white mb-2 block">QR Code Style</Label>
                  <Select value={qrStyle} onValueChange={(value: 'squares' | 'dots') => setQrStyle(value)}>
                    <SelectTrigger id="qr-style" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select QR code style" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="squares">Squares</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fg-color" className="text-white mb-2 block">Foreground Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bg-color" className="text-white mb-2 block">Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo-upload" className="text-white mb-2 block">Upload Logo (optional)</Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                {logoUrl && (
                  <div>
                    <Label htmlFor="logo-size" className="text-white mb-2 block">Logo Size: {logoSize}x{logoSize}</Label>
                    <Slider
                      id="logo-size"
                      min={20}
                      max={150}
                      step={5}
                      value={logoSize}
                      onChange={(value) => setLogoSize(value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Generated QR Code</h2>
              <div className="bg-white p-4 rounded-lg flex items-center justify-center" style={{ minHeight: '300px' }}>
                <QRCodeCanvas
                    id="qr-code"
                    value={generateQRValue()}
                    size={qrSize}
                    fgColor={qrFgColor}
                    bgColor={qrBgColor}
                    level={errorCorrectionLevel}
                    includeMargin={includeMargin}
                    imageSettings={logoUrl ? {
                      src: logoUrl,
                      height: logoSize,
                      width: logoSize,
                      excavate: true,
                    } : undefined}
                  />
              </div>
              <div className="mt-4 flex justify-center">
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Select the QR code type from the dropdown menu.</li>
            <li>Enter the required information based on the selected type.</li>
            <li>Adjust the QR code size using the slider.</li>
            <li>Choose the error correction level (higher levels make the QR code more resistant to damage).</li>
            <li>Toggle the margin inclusion if needed.</li>
            <li>Select the QR code style (squares or dots).</li>
            <li>Customize the foreground and background colors.</li>
            <li>Optionally, upload a logo and adjust its size.</li>
            <li>The QR code will update in real-time as you make changes.</li>
            <li>Click the "Download QR Code" button to save the generated QR code as an image.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">QR Code Types Explained</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>URL:</strong> Creates a QR code that opens a website when scanned.</li>
            <li><strong>Text:</strong> Generates a QR code containing plain text information.</li>
            <li><strong>Email:</strong> Produces a QR code that opens an email client with pre-filled recipient, subject, and body.</li>
            <li><strong>Phone:</strong> Creates a QR code that initiates a phone call when scanned.</li>
            <li><strong>SMS:</strong> Generates a QR code that opens a text message with a pre-filled recipient and message.</li>
            <li><strong>Wi-Fi:</strong> Produces a QR code that allows easy connection to a Wi-Fi network when scanned.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}