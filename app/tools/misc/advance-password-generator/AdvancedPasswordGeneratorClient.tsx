'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import Slider from "@/components/ui/Slider";
import Checkbox from "@/components/ui/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { RefreshCw, Copy, Eye, EyeOff, Shield, } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function AdvancedPasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [requireEveryType, setRequireEveryType] = useState(true);
  const [beginWithLetter, setBeginWithLetter] = useState(false);
  const [noConsecutive, setNoConsecutive] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customCharSet, setCustomCharSet] = useState('');
  const [useCustomCharSet, setUseCustomCharSet] = useState(false);
  const [excludedChars, setExcludedChars] = useState('');
  const [passwordCount, setPasswordCount] = useState(1);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (useLowercase) charset += CHAR_SETS.lowercase;
    if (useUppercase) charset += CHAR_SETS.uppercase;
    if (useNumbers) charset += CHAR_SETS.numbers;
    if (useSymbols) charset += CHAR_SETS.symbols;
    if (useCustomCharSet) charset += customCharSet;

    if (excludeSimilar) {
      charset = charset.replace(/[ilLI|`1oO0]/g, '');
    }

    if (excludeAmbiguous) {
        charset = charset.replace(/[{}\[\]()\/\\'"~,;.<>]/g, '');
      }      

    if (excludedChars) {
      const excludeSet = new Set(excludedChars);
      charset = charset.split('').filter(char => !excludeSet.has(char)).join('');
    }

    if (charset.length === 0) {
      toast.error('Please select at least one character type');
      return '';
    }

    const generateSinglePassword = () => {
      let result = '';
      const charsetArray = charset.split('');
      const getRandomChar = () => charsetArray[Math.floor(Math.random() * charsetArray.length)];

      if (beginWithLetter) {
        const letters = (CHAR_SETS.lowercase + CHAR_SETS.uppercase).split('');
        result += letters[Math.floor(Math.random() * letters.length)];
      }

      while (result.length < length) {
        const char = getRandomChar();
        if (noConsecutive && result[result.length - 1] === char) {
          continue;
        }
        result += char;
      }

      if (requireEveryType) {
        const types = [
          { condition: useLowercase, charset: CHAR_SETS.lowercase },
          { condition: useUppercase, charset: CHAR_SETS.uppercase },
          { condition: useNumbers, charset: CHAR_SETS.numbers },
          { condition: useSymbols, charset: CHAR_SETS.symbols },
        ];

        types.forEach(type => {
          if (type.condition && !new RegExp(`[${type.charset}]`).test(result)) {
            const index = Math.floor(Math.random() * result.length);
            result = result.substring(0, index) + getRandomChar() + result.substring(index + 1);
          }
        });
      }

      return result;
    };

    const passwords = Array.from({ length: passwordCount }, generateSinglePassword);
    setPassword(passwords.join('\n'));
  }, [length, useLowercase, useUppercase, useNumbers, useSymbols, excludeSimilar, excludeAmbiguous, requireEveryType, beginWithLetter, noConsecutive, customCharSet, useCustomCharSet, excludedChars, passwordCount]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  useEffect(() => {
    const calculatePasswordStrength = () => {
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      const length = password.length;

      let strength = 0;
      if (hasLower) strength += 1;
      if (hasUpper) strength += 1;
      if (hasNumber) strength += 1;
      if (hasSymbol) strength += 1;
      if (length >= 12) strength += 1;
      if (length >= 16) strength += 1;

      switch (strength) {
        case 0:
        case 1:
          return 'Very Weak';
        case 2:
          return 'Weak';
        case 3:
          return 'Moderate';
        case 4:
          return 'Strong';
        case 5:
        case 6:
          return 'Very Strong';
        default:
          return 'Unknown';
      }
    };

    setPasswordStrength(calculatePasswordStrength());
  }, [password]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      toast.success('Password copied to clipboard!');
    }, () => {
      toast.error('Failed to copy password.');
    });
  };

  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Advance Password Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Password Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="length-slider" className="text-white mb-2 block">Password Length: {length}</Label>
                  <Slider
                    id="length-slider"
                    min={8}
                    max={64}
                    step={1}
                    value={length}
                    onChange={(value) => setLength(value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox checked={useLowercase} onChange={setUseLowercase} />
                  <Label htmlFor="lowercase" className="text-white">Include Lowercase</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox checked={useUppercase} onChange={setUseUppercase} />
                  <Label htmlFor="uppercase" className="text-white">Include Uppercase</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox  checked={useNumbers} onChange={setUseNumbers} />
                  <Label htmlFor="numbers" className="text-white">Include Numbers</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox checked={useSymbols} onChange={setUseSymbols} />
                  <Label htmlFor="symbols" className="text-white">Include Symbols</Label>
                </div>

                <div className="flex items-center space-x-2 relative">
                    <Checkbox  checked={excludeSimilar} onChange={setExcludeSimilar} />
                    <Label htmlFor="exclude-similar" className="text-white flex items-center">
                        Exclude Similar
                        <span className="relative ml-1 cursor-pointer text-blue-500">
                        <i className="text-sm">i</i>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-2 text-sm bg-gray-800 text-white rounded-md tooltip">
                            i, l, 1, L, o, 0, O
                            <div className="tooltip-arrow"></div>
                        </span>
                        </span>
                    </Label>
                </div>


                <div className="flex items-center space-x-2 relative">
                    <Checkbox checked={excludeAmbiguous} onChange={setExcludeAmbiguous} />
                    <Label htmlFor="exclude-ambiguous" className="text-white flex items-center">
                       Exclude Ambiguous
                        <span className="relative ml-1 cursor-pointer text-blue-500">
                        <i className="text-sm">i</i>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-2 text-sm bg-gray-800 text-white rounded-md tooltip">
                            { }[ ]()/\'"~,;.&lt;&gt;
                            <div className="tooltip-arrow"></div>
                        </span>
                        </span>
                    </Label>
                </div>


                <div className="flex items-center space-x-2">
                  <Checkbox checked={requireEveryType} onChange={setRequireEveryType} />
                  <Label htmlFor="require-every-type" className="text-white">Require Every Type</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox  checked={beginWithLetter} onChange={setBeginWithLetter} />
                  <Label htmlFor="begin-with-letter" className="text-white">Begin With a Letter</Label>
                </div>


                <div className="flex items-center space-x-2">
                  <Checkbox checked={noConsecutive} onChange={setNoConsecutive} />
                  <Label htmlFor="no-consecutive" className="text-white">No Consecutive Characters</Label>
                </div>

                <div>
                  <Label htmlFor="custom-charset" className="text-white mb-2 block">Custom Character Set</Label>
                  <Input
                    id="custom-charset"
                    value={customCharSet}
                    onChange={(e) => setCustomCharSet(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox checked={useCustomCharSet} onChange={setUseCustomCharSet} />
                  <Label htmlFor="use-custom-charset" className="text-white">Use Custom Character Set</Label>
                </div>

                <div>
                  <Label htmlFor="excluded-chars" className="text-white mb-2 block">Excluded Characters</Label>
                  <Input
                    id="excluded-chars"
                    value={excludedChars}
                    onChange={(e) => setExcludedChars(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Characters to exclude"
                  />
                </div>

                <div>
                  <Label htmlFor="password-count" className="text-white mb-2 block">Number of Passwords</Label>
                  <Select value={passwordCount.toString()} onValueChange={(value) => setPasswordCount(parseInt(value))}>
                    <SelectTrigger id="password-count" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select number of passwords" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      {[1, 5, 10, 20].map((count) => (
                        <SelectItem key={count} value={count.toString()}>{count}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Generated Password</h2>
              <div className="relative">
                <textarea
                  value={password}
                  readOnly
                  className="w-full h-40 p-2 bg-gray-700 text-white border border-gray-600 rounded-md font-mono"
                  style={{ 
                    resize: 'none',
                    //@ts-ignore
                    WebkitTextSecurity: showPassword ? 'none' : 'disc',
                    textSecurity: showPassword ? 'none' : 'disc'
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="text-green-500" />
                  <span className="text-white">Strength: {passwordStrength}</span>
                </div>
                <Button onClick={handleCopyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy
                </Button>
              </div>
              <Button onClick={generatePassword} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
                <RefreshCw className="h-5 w-5 mr-2" />
                Generate New Password
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Advanced Password Generator</h2>
          <p className="text-gray-300 mb-4">
            Our Advanced Password Generator is designed to help users create secure and complex passwords tailored to their specific needs. It offers a wide range of customizable options to ensure your passwords are both strong and easy to manage.
          </p>
          <h3 className="text-xl font-bold text-white mt-4 mb-4">Key Features:</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>🔑 <strong>Customizable Length:</strong> Choose password lengths ranging from 8 to 64 characters.</li>
            <li>🔤 <strong>Character Set Inclusion:</strong> Include lowercase letters, uppercase letters, numbers, and symbols as needed.</li>
            <li>🚫 <strong>Exclude Similar Characters:</strong> Avoid using characters that can be easily confused, like 'l', '1', 'O', and '0'.</li>
            <li>❓ <strong>Exclude Ambiguous Characters:</strong> Filter out characters that may not be visually distinct, such as {}, [], (), and others.</li>
            <li>🔒 <strong>Require Every Character Type:</strong> Ensure that your password includes at least one character from each selected category.</li>
            <li>📖 <strong>Begin with a Letter:</strong> Option to start your password with an alphabetical character for added security.</li>
            <li>⏳ <strong>No Consecutive Characters:</strong> Prevent repeating characters to enhance password strength.</li>
            <li>🔠 <strong>Custom Character Set:</strong> Create your own character set for even more personalized passwords.</li>
            <li>🚫 <strong>Exclude Specific Characters:</strong> Input specific characters that should not appear in your generated passwords.</li>
            <li>🔢 <strong>Multiple Passwords Generation:</strong> Generate up to 20 unique passwords at once.</li>
          </ul>
          <h3 className="text-xl font-bold text-white mb-4">How to Use</h3>
          <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
            <li>Adjust the password length using the slider.</li>
            <li>Select the character types you want to include (lowercase, uppercase, numbers, symbols).</li>
            <li>Choose additional options like excluding similar characters or requiring every character type.</li>
            <li>Optionally, add a custom character set or exclude specific characters.</li>
            <li>Select the number of passwords you want to generate.</li>
            <li>Click "Generate New Password" to create a password with your chosen settings.</li>
            <li>Use the "Copy" button to copy the generated password to your clipboard.</li>
            <li>Check the password strength indicator to ensure it meets your security requirements.</li>
          </ol>

          <h3 className="text-xl font-bold text-white mb-4">Password Security Tips</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Use a unique password for each of your accounts.</li>
            <li>Aim for passwords that are at least 12 characters long; longer is generally better.</li>
            <li>Include a mix of uppercase and lowercase letters, numbers, and symbols.</li>
            <li>Avoid using personal information in your passwords, such as birthdates or names.</li>
            <li>Consider using a password manager to securely store and generate complex passwords.</li>
            <li>Enable two-factor authentication (2FA) whenever possible for an extra layer of security.</li>
            <li>Regularly update your passwords, especially for critical accounts.</li>
            <li>Be cautious of phishing attempts and never share your passwords with others.</li>
          </ul>
        </div>

      </main>
      <Footer />
    </div>
  );
}
