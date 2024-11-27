// pages/api/tools.js
// pages/api/tools.js
export default function handler(req, res) {
    // Enable CORS for development
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // Return the same data structure you currently have in popup.js
    res.status(200).json({
      categories: [
        // Your categories array
        { name: 'Text', icon: 'fa-font', gradient: 'from-blue-500 to-cyan-500' },
        { name: 'Image', icon: 'fa-image', gradient: 'from-purple-500 to-pink-500' },
        { name: 'CSS', icon: 'fa-palette', gradient: 'from-green-500 to-emerald-500' },
        { name: 'Coding', icon: 'fa-code', gradient: 'from-orange-500 to-red-500' },
        { name: 'Color', icon: 'fa-droplet', gradient: 'from-violet-500 to-purple-500' },
        { name: 'Social Media', icon: 'fa-share', gradient: 'from-pink-500 to-rose-500' },
        { name: 'Misc', icon: 'fa-wrench', gradient: 'from-cyan-500 to-blue-500' }
      ],
      tools: {
        // Your tools object
        Text: [
            { name: 'Case Converter', category: 'Text', href: '/tools/text/case-converter', icon: 'fa-font' },
            { name: 'Letter Counter', category: 'Text', href: '/tools/text/letter-counter', icon: 'fa-font' },
            { name: 'Lorem Ipsum Generator', category: 'Text', href: '/tools/text/lorem-ipsum-generator', icon: 'fa-font' },
            { name: 'Words Counter', category: 'Text', href: '/tools/text/words-counter', icon: 'fa-font' },
            { name: 'Whitespace Remover', category: 'Text', href: '/tools/text/whitespace-remover', icon: 'fa-eraser' },
            { name: 'Google Fonts Pair Finder', category: 'Text', href: '/tools/text/google-fonts-pair-finder', icon: 'fa-font' },
            { name: 'Text Reverser', category: 'Text', href: '/tools/text/text-reverser', icon: 'fa-font' },
            { name: 'Character Frequency Counter', category: 'Text', href: '/tools/text/character-frequency-counter', icon: 'fa-chart-bar' },
            { name: 'Text to ASCII/Hex/Binary Converter', category: 'Text', href: '/tools/text/text-to-ascii-hex-binary', icon: 'fa-code' },
            { name: 'Title Case Converter', category: 'Text', href: '/tools/text/title-case-converter', icon: 'fa-text-height' },
            { name: 'Duplicate Line Remover', category: 'Text', href: '/tools/text/duplicate-line-remover', icon: 'fa-scissors' },
            { name: 'HTML Encoder/Decoder', category: 'Text', href: '/tools/text/html-encoder-decoder', icon: 'fa-code' },
            { name: 'Markdown to HTML Converter', category: 'Text', href: '/tools/text/markdown-to-html', icon: 'fa-markdown' },
            { name: 'Word Scrambler', category: 'Text', href: '/tools/text/word-scrambler', icon: 'fa-random' },
            { name: 'Text to Handwriting Converter', category: 'Text', href: '/tools/text/text-to-handwriting', icon: 'fa-signature' },
          ],
          Image: [
            { name: 'Image Cropper', category: 'Image', href: '/tools/image/image-cropper', icon: 'fa-crop' },
            { name: 'Image Filters', category: 'Image', href: '/tools/image/image-filters', icon: 'fa-image' },
            { name: 'Image Resizer', category: 'Image', href: '/tools/image/image-resizer', icon: 'fa-expand' },
            { name: 'Image Average Color Finder', category: 'Image', href: '/tools/image/image-average-color-finder', icon: 'fa-palette' },
            { name: 'Image Color Extractor', category: 'Image', href: '/tools/image/image-color-extractor', icon: 'fa-eye-dropper' },
            { name: 'Image Color Picker', category: 'Image', href: '/tools/image/image-color-picker', icon: 'fa-palette' },
            { name: 'SVG Blob Generator', category: 'Image', href: '/tools/image/svg-blob-generator', icon: 'fa-shapes' },
            { name: 'SVG Pattern Generator', category: 'Image', href: '/tools/image/svg-pattern-generator', icon: 'fa-vector-square' },
            { name: 'Photo Censor', category: 'Image', href: '/tools/image/photo-censor', icon: 'fa-eye-slash' },
            { name: 'SVG to PNG Converter', category: 'Image', href: '/tools/image/svg-to-png-converter', icon: 'fa-file-image' },
            { name: 'PNG to SVG Converter', category: 'Image', href: '/tools/image/png-to-svg-converter', icon: 'fa-file-image' },
            { name: 'Image to Base64 Converter', category: 'Image', href: '/tools/image/image-to-base64-converter', icon: 'fa-file-code' },
          ],
          CSS: [
            { name: 'CSS Clip Path Generator', category: 'CSS', href: '/tools/css/clip-path-generator', icon: 'fa-scissors' },
            { name: 'CSS Loader Generator', category: 'CSS', href: '/tools/css/loader-generator', icon: 'fa-spinner' },
            { name: 'CSS Background Pattern Generator', category: 'CSS', href: '/tools/css/background-pattern-generator', icon: 'fa-brush' },
            { name: 'CSS Cubic Bezier Generator', category: 'CSS', href: '/tools/css/cubic-bezier-generator', icon: 'fa-bezier-curve' },
            { name: 'CSS Glassmorphism Generator', category: 'CSS', href: '/tools/css/glassmorphism-generator', icon: 'fa-glass-martini-alt' },
            { name: 'CSS Text Glitch Effect Generator', category: 'CSS', href: '/tools/css/text-glitch-effect-generator', icon: 'fa-font' },
            { name: 'CSS Triangle Generator', category: 'CSS', href: '/tools/css/triangle-generator', icon: 'fa-draw-polygon' },
            { name: 'CSS Box Shadow Generator', category: 'CSS', href: '/tools/css/box-shadow-generator', icon: 'fa-square' },
            { name: 'CSS Border Radius Generator', category: 'CSS', href: '/tools/css/border-radius-generator', icon: 'fa-shapes' },
            { name: 'CSS Flexbox Generator', category: 'CSS', href: '/tools/css/flexbox-generator', icon: 'fa-align-justify' },
            { name: 'CSS Gradient Generator', category: 'CSS', href: '/tools/css/gradient-generator', icon: 'fa-palette' },
          ],
          Color: [
            { name: 'Image Color Picker', category: 'Color', href: '/tools/color/image-color-picker', icon: 'fa-eye-dropper' },
            { name: 'Image Color Extractor', category: 'Color', href: '/tools/color/image-color-extractor', icon: 'fa-image' },
            { name: 'Hex to RGBA Converter', category: 'Color', href: '/tools/color/hex-to-rgba', icon: 'fa-hashtag' },
            { name: 'RGBA to Hex Converter', category: 'Color', href: '/tools/color/rgba-to-hex', icon: 'fa-hashtag' },
            { name: 'HSV to RGB Converter', category: 'Color', href: '/tools/color/hsv-to-rgb', icon: 'fa-hashtag' },
            { name: 'RGB to HSV Converter', category: 'Color', href: '/tools/color/rgb-to-hsv', icon: 'fa-sliders-h' },
            { name: 'CMYK to RGB Converter', category: 'Color', href: '/tools/color/cmyk-to-rgb', icon: 'fa-print' },
            { name: 'Color Mixer', category: 'Color', href: '/tools/color/color-mixer', icon: 'fa-palette' },
            { name: 'Color Shades Generator', category: 'Color', href: '/tools/color/color-shades-generator', icon: 'fa-sun' },
            { name: 'RGB to CMYK Converter', category: 'Color', href: '/tools/color/rgb-to-cmyk', icon: 'fa-print' },
            { name: 'HSL to RGB Converter', category: 'Color', href: '/tools/color/hsl-to-rgb', icon: 'fa-sliders-h' },
            { name: 'HSL to HEX Converter', category: 'Color', href: '/tools/color/hsl-to-hex', icon: 'fa-hashtag' },
            { name: 'HSV to Hex Converter', category: 'Color', href: '/tools/color/hsv-to-hex', icon: 'fa-hashtag' },
            { name: 'RGB to HSL Converter', category: 'Color', href: '/tools/color/rgb-to-hsl', icon: 'fa-hashtag' },
            { name: 'Color Name Generator', category: 'Color', href: '/tools/color/color-name-generator', icon: 'fa-tag' },
            { name: 'Color Palette Generator', category: 'Color', href: '/tools/color/color-palette-generator', icon: 'fa-palette' },
            { name: 'Color Wheel', category: 'Color', href: '/tools/color/color-wheel', icon: 'fa-circle' },
            { name: 'Gradient Generator', category: 'Color', href: '/tools/color/color-gradient-generator', icon: 'fa-palette' },
            { name: 'Tailwind CSS Color Palette', category: 'Color', href: '/tools/color/tailwind-color-generator', icon: 'fa-palette' },
            { name: 'Color Converter', category: 'Color', href: '/tools/color/color-converter', icon: 'fa-exchange-alt' },
          ],
          Coding: [
            { name: 'Code to Image Converter', category: 'Coding', href: '/tools/coding/code-to-image-converter', icon: 'fa-file-image' },
            { name: 'URL Slug Generator', category: 'Coding', href: '/tools/coding/url-slug-generator', icon: 'fa-link' },
            { name: 'React Native Shadow Generator', category: 'Coding', href: '/tools/coding/react-native-shadow-generator', icon: 'fa-mobile-alt' },
            { name: 'Base64 Encoder/Decoder', category: 'Coding', href: '/tools/coding/base64-encoder-decoder', icon: 'fa-code' },
            { name: 'HTML Encoder/Decoder', category: 'Coding', href: '/tools/coding/html-encoder-decoder', icon: 'fa-code' },
            { name: 'URL Encoder/Decoder', category: 'Coding', href: '/tools/coding/url-encoder-decoder', icon: 'fa-code' },
            { name: 'HTML Minifier', category: 'Coding', href: '/tools/coding/html-minifier', icon: 'fa-compress' },
            { name: 'CSS Minifier', category: 'Coding', href: '/tools/coding/css-minifier', icon: 'fa-compress' },
            { name: 'JavaScript Minifier', category: 'Coding', href: '/tools/coding/javascript-minifier', icon: 'fa-compress' },
            { name: 'HTML Formatter', category: 'Coding', href: '/tools/coding/html-formatter', icon: 'fa-file-code' },
            { name: 'CSS Formatter', category: 'Coding', href: '/tools/coding/css-formatter', icon: 'fa-file-code' },
            { name: 'JavaScript Formatter', category: 'Coding', href: '/tools/coding/javascript-formatter', icon: 'fa-file-code' },
            { name: 'MD5 Generator and Verifier', category: 'Coding', href: '/tools/coding/md5-encrypt-verify', icon: 'fa-fingerprint' },
            { name: 'SHA1 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha1-encrypt-verify', icon: 'fa-lock' },
            { name: 'SHA224 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha224-encrypt-verify', icon: 'fa-lock' },
            { name: 'SHA256 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha256-encrypt-verify', icon: 'fa-lock' },
            { name: 'SHA384 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha384-encrypt-verify', icon: 'fa-lock' },
            { name: 'SHA512 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha512-encrypt-verify', icon: 'fa-lock' },
            { name: 'JWT Encoder/Decoder', category: 'Coding', href: '/tools/coding/jwt-encoder-decoder', icon: 'fa-key' },
            { name: 'Advance JSON Tree Viewer', category: 'Coding', href: '/tools/coding/json-tree-viewer', icon: 'fa-sitemap' },
            { name: 'JSON Validator and Formatter', category: 'Coding', href: '/tools/coding/json-validator', icon: 'fa-database' },
          ],
          'Social Media': [
            { name: 'Instagram Filters', category: 'Social Media', href: '/tools/social-media/instagram-filters', icon: 'fa-instagram' },
            { name: 'Instagram Post Generator', category: 'Social Media', href: '/tools/social-media/instagram-post-generator', icon: 'fa-instagram' },
            { name: 'Instagram Photo Downloader', category: 'Social Media', href: '/tools/social-media/instagram-photo-downloader', icon: 'fa-instagram' },
            { name: 'Tweet Generator', category: 'Social Media', href: '/tools/social-media/tweet-generator', icon: 'fa-twitter' },
            { name: 'Tweet to Image Converter', category: 'Social Media', href: '/tools/social-media/tweet-to-image-converter', icon: 'fa-twitter' },
            { name: 'YouTube Thumbnail Downloader', category: 'Social Media', href: '/tools/social-media/youtube-thumbnail-downloader', icon: 'fa-youtube' },
            { name: 'YouTube KeyWord Tag Extractor', category: 'Social Media', href: '/tools/social-media/youtube-tag-extractor', icon: 'fa-hashtag' },
            { name: 'YouTube Metadata Extractor', category: 'Social Media', href: '/tools/social-media/youtube-metadata-extractor', icon: 'fa-hashtag' },
            { name: 'YouTube Region Restriction Finder', category: 'Social Media', href: '/tools/social-media/youtube-region-restriction-finder', icon: 'fa-globe' },
          ],
          Misc: [
            { name: 'Advance Password Generator', category: 'Misc', href: '/tools/misc/advance-password-generator', icon: 'fa-lock' },
            { name: 'List Randomizer', category: 'Misc', href: '/tools/misc/list-randomizer', icon: 'fa-random' },
            { name: 'QR Code Generator', category: 'Misc', href: '/tools/misc/qr-code-generator', icon: 'fa-qrcode' },
            { name: 'BarCode Generator', category: 'Misc', href: '/tools/misc/barcode-generator', icon: 'fa-barcode' },
            { name: 'Unit Converter', category: 'Misc', href: '/tools/misc/unit-converter', icon: 'fa-exchange-alt' },
            { name: 'Screen Resolution Checker', category: 'Misc', href: '/tools/misc/screen-resolution-checker', icon: 'fa-desktop' },
          ],
      }
    });
  }