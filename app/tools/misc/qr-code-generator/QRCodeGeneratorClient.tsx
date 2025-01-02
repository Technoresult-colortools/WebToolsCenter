'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select } from '@/components/ui/select1';
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Download, FileText, Brush, Sliders, ImageIcon, Info, BookOpen, Lightbulb, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolLayout from '@/components/ToolLayout';
import NextImage from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

type QRCodeType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';

const QRCode = dynamic<React.ComponentProps<typeof QRCodeSVG>>(() => 
  import('qrcode.react').then(mod => mod.QRCodeSVG), 
  { ssr: false }
);

export default function QRCodeGenerator() {
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

  // Border state
  const [borderSize, setBorderSize] = useState<number>(0);
  const [borderColor, setBorderColor] = useState<string>('#000000');
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('solid');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [smsBody, setSmsBody] = useState<string>('');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<'WEP' | 'WPA' | 'nopass'>('WPA');

  const qrCodeRef = useRef<HTMLDivElement>(null);

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
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (!svgElement) return;

      const canvas = document.createElement('canvas');
      const totalSize = qrSize + (borderSize * 2);
      canvas.width = totalSize;
      canvas.height = totalSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, totalSize, totalSize);

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, borderSize, borderSize, qrSize, qrSize);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderSize;
        
        switch (borderStyle) {
          case 'dashed':
            ctx.setLineDash([5, 5]);
            break;
          case 'dotted':
            ctx.setLineDash([2, 2]);
            break;
          default:
            ctx.setLineDash([]);
        }

        if (borderSize > 0) {
          ctx.strokeRect(borderSize / 2, borderSize / 2, totalSize - borderSize, totalSize - borderSize);
        }

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
        toast.success('QR Code downloaded successfully!');
      };
      img.src = svgUrl;
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
    <ToolLayout
      title="Advanced QR Code Generator"
      description="Create Customized QR Code for various purposes"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">QR Code Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-8">
        <div 
        ref={qrCodeRef}
        className="p-4 rounded-lg" 
        style={{
          backgroundColor: backgroundColor,
          border: `${borderSize}px ${borderStyle} ${borderColor}`,
        }}
      >
        <QRCode
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
          style={{
            width: '100%',
            height: '100%',
            maxWidth: `${qrSize}px`,
            maxHeight: `${qrSize}px`,
          }}
          {...(qrStyle === 'dots' ? { 
            dotScale: 0.5
          } : {})}
        />
      </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">QR Code Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 gap-2 mb-4">
              <TabsTrigger value="content" className="flex items-center justify-center">
                <FileText className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center justify-center">
                <Brush className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center justify-center">
                <Sliders className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
              <TabsTrigger value="logo" className="flex items-center justify-center">
                <ImageIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logo</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="qr-type" className="text-white mb-2 block">QR Code Type</Label>
                <Select
                  label="Select QR code type"
                  options={[
                    { value: 'url', label: 'URL' },
                    { value: 'text', label: 'Text' },
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                    { value: 'sms', label: 'SMS' },
                    { value: 'wifi', label: 'Wi-Fi' },
                  ]}
                  selectedKey={qrType}
                  onSelectionChange={(key) => setQRType(key as QRCodeType)}
                  placeholder="Select QR code type"
                />
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
                    <Select
                      label="Select encryption type"
                      options={[
                        { value: 'WEP', label: 'WEP' },
                        { value: 'WPA', label: 'WPA/WPA2' },
                        { value: 'nopass', label: 'No encryption' },
                      ]}
                      selectedKey={wifiEncryption}
                      onSelectionChange={(key) => setWifiEncryption(key as 'WEP' | 'WPA' | 'nopass')}
                      placeholder="Select encryption type"
                    />
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="appearance" className="space-y-4">
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
                <Label htmlFor="qr-style" className="text-white mb-2 block">QR Code Style</Label>
                <Select
                  label="Select QR code style"
                  options={[
                    { value: 'squares', label: 'Squares' },
                    { value: 'dots', label: 'Dots' },
                  ]}
                  selectedKey={qrStyle}
                  onSelectionChange={(key) => setQrStyle(key as 'squares' | 'dots')}
                  placeholder="Select QR code style"
                />
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
                <Label htmlFor="border-size" className="text-white mb-2 block">Border Size: {borderSize}px</Label>
                <Slider
                  id="border-size"
                  min={0}
                  max={20}
                  step={1}
                  value={borderSize}
                  onChange={(value) => setBorderSize(value)}
                />
              </div>
              <div>
                <Label htmlFor="border-color" className="text-white mb-2 block">Border Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="border-color"
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                  />
                  <Input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="flex-grow bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="border-style" className="text-white mb-2 block">Border Style</Label>
                <Select
                  label="Select border style"
                  options={[
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                    { value: 'double', label: 'Double' },
                    { value: 'groove', label: 'Groove' },
                    { value: 'ridge', label: 'Ridge' },
                    { value: 'inset', label: 'Inset' },
                    { value: 'outset', label: 'Outset' },
                  ]}
                  selectedKey={borderStyle}
                  onSelectionChange={(key) => setBorderStyle(key as BorderStyle)}
                  placeholder="Select border style"
                />
              </div>
              <div>
                <Label htmlFor="background-color" className="text-white mb-2 block">Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-grow bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4">
              <div>
                <Label htmlFor="error-correction" className="text-white mb-2 block">Error Correction Level</Label>
                <Select
                  label="Select error correction level"
                  options={[
                    { value: 'L', label: 'Low (7%)' },
                    { value: 'M', label: 'Medium (15%)' },
                    { value: 'Q', label: 'Quartile (25%)' },
                    { value: 'H', label: 'High (30%)' },
                  ]}
                  selectedKey={errorCorrectionLevel}
                  onSelectionChange={(key) => setErrorCorrectionLevel(key as ErrorCorrectionLevel)}
                  placeholder="Select error correction level"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-margin" className="text-white">Include Margin</Label>
                <Switch
                  id="include-margin"
                  checked={includeMargin}
                  onCheckedChange={setIncludeMargin}
                />
              </div>
            </TabsContent>
            <TabsContent value="logo" className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-center mb-8">
        <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="h-5 w-5 mr-2" />
          Download QR Code
        </Button>
      </div>

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The QR Code Generator is a powerful and versatile tool that allows you to create customized QR codes for various purposes. 
            Whether you need to share a website URL, contact information, Wi-Fi credentials, or any other type of data, this generator provides an easy-to-use interface to create QR codes tailored to your needs.
          </p>

          <div className="my-8">
            <NextImage 
              src="/Images/QRCodeGeneratorPreview.png?height=400&width=600" 
              alt="Screenshot of the QR Code Generator interface showing customization options and generated QR code" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use QR Code Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Select the QR code type (URL, text, email, phone, SMS, or Wi-Fi) from the dropdown menu.</li>
            <li>Enter the required information for the selected type in the provided fields.</li>
            <li>Customize the appearance of your QR code using the options in the "Appearance" tab.</li>
            <li>Adjust advanced settings like error correction level in the "Advanced" tab.</li>
            <li>Optionally, add a logo to your QR code using the "Logo" tab.</li>
            <li>Preview your QR code in real-time as you make changes.</li>
            <li>Once satisfied, click the "Download QR Code" button to save your generated QR code.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Multiple QR Code Types: Create QR codes for URLs, plain text, email addresses, phone numbers, SMS messages, and Wi-Fi networks.</li>
            <li>Customizable Appearance: Adjust the size, colors, and style (squares or dots) of your QR code to match your branding or preferences.</li>
            <li>Error Correction Levels: Choose from four levels of error correction to balance between code size and scanning reliability.</li>
            <li>Logo Integration: Add your own logo to the center of the QR code for brand recognition.</li>
            <li>Real-time Preview: See your QR code update in real-time as you modify settings.</li>
            <li>Responsive Design: The tool works well on both desktop and mobile devices.</li>
            <li>Easy Download: Download your QR code as a PNG image with a single click.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips for Creating Effective QR Codes
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Keep the data concise to reduce QR code complexity.</li>
            <li>Use a higher error correction level when adding a logo or when the code might be displayed in challenging environments.</li>
            <li>Ensure sufficient contrast between the foreground and background colors for better scannability.</li>
            <li>Test your QR code on multiple devices and scanning apps before wide distribution.</li>
            <li>When using a logo, keep it small (around 20-25% of the QR code size) to maintain scannability.</li>
            <li>For Wi-Fi QR codes, double-check the network name and password to avoid connection issues.</li>
            <li>Consider the context where the QR code will be scanned when choosing its size and error correction level.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Share2 className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Marketing: Create QR codes for promotional materials, business cards, and product packaging.</li>
            <li>Education: Share educational resources, course materials, or campus information via QR codes.</li>
            <li>Events: Use QR codes for ticketing, attendee registration, or sharing event details.</li>
            <li>Retail: Implement QR codes for contactless payments, product information, or loyalty programs.</li>
            <li>Hospitality: Provide easy access to menus, Wi-Fi credentials, or hotel information through QR codes.</li>
            <li>Healthcare: Use QR codes for patient identification, medical record access, or prescription information.</li>
            <li>Real Estate: Share property listings, virtual tours, or contact information via QR codes.</li>
            <li>Museums and Galleries: Offer additional information about exhibits or artworks through QR codes.</li>
            <li>Transportation: Implement QR codes for ticketing, schedules, or route information.</li>
            <li>Personal Use: Create QR codes for sharing contact information, social media profiles, or personal websites.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The QR Code Generator is a versatile tool that can enhance communication and information sharing across various industries and personal applications. By providing an easy way to create customized QR codes, it enables users to bridge the gap between physical and digital worlds, offering quick access to information and improving user experiences. Whether you're a business owner looking to engage customers, an educator sharing resources, or an individual simplifying information sharing, the QR Code Generator offers the flexibility and functionality to meet your needs.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>  
  );
}

