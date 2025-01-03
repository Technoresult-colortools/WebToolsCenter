// Page dimensions (US Letter size at 96 DPI)
export const PAGE_WIDTH = 816 // 8.5 inches at 96 DPI
export const PAGE_HEIGHT = 1056 // 11 inches at 96 DPI
export const MARGIN_LEFT = 72 // 0.75 inch margin
export const MARGIN_TOP = 72 // 0.75 inch margin

// Handwriting fonts
export interface Font {
  name: string
  src: string
}

export const HANDWRITING_FONTS: Font[] = [
  { name: "Caveat", src: "/fonts/Caveat-Regular.ttf" },
  { name: "Kalam", src: "/fonts/Kalam-Regular.ttf" },
  { name: "Architects Daughter", src: "/fonts/ArchitectsDaughter-Regular.ttf" },
  { name: "Patrick Hand", src: "/fonts/PatrickHand-Regular.ttf" },
  { name: "Indie Flower", src: "/fonts/IndieFlower-Regular.ttf" },
  { name: "Permanent Marker", src: "/fonts/PermanentMarker-Regular.ttf" },
  { name: "Shadows Into Light", src: "/fonts/ShadowsIntoLight-Regular.ttf" },
  { name: "Comic Neue", src: "/fonts/ComicNeue-Regular.ttf" },
  { name: "Handlee", src: "/fonts/Handlee-Regular.ttf" },
  { name: "Rock Salt", src: "/fonts/RockSalt-Regular.ttf" },
  { name: "Homemade Apple", src: "/fonts/HomemadeApple-Regular.ttf" },
  { name: "Cedarville Cursive", src: "/fonts/CedarvilleCursive-Regular.ttf" },
  { name: "Reenie Beanie", src: "/fonts/ReenieBeanie-Regular.ttf" },
  { name: "Schoolbell", src: "/fonts/Schoolbell-Regular.ttf" },
  { name: "HarryPotter", src: "/fonts/HarryPotter.ttf" },
  { name: "Just Another Hand", src: "/fonts/JustAnotherHand-Regular.ttf" }
]

export const FONT_SIZES = Array.from({ length: 37 }, (_, i) => i + 12) // 12px to 48px

export interface PaperStyle {
  name: string
  src: string
  lineHeight: number
  defaultFontSize: number
  marginLeft: number
}

export const PAPER_STYLES: { [key: string]: PaperStyle } = {
  RULED_BLUE: {
    name: 'Blue Ruled',
    src: '/Images/TextToHand/Ruled-BlueLine.jpg',
    lineHeight: 37,
    defaultFontSize: 38,
    marginLeft: 65
  },
  RULED_BLACK: {
    name: 'Black Ruled',
    src: '/Images/TextToHand/Ruled-BlackLine.jpg',
    lineHeight: 37,
    defaultFontSize: 38,
    marginLeft: 65
  },
  RULED_GREY: {
    name: 'Grey Ruled',
    src: '/Images/TextToHand/Ruled-GreyLine.jpg',
    lineHeight: 37,
    defaultFontSize: 38,
    marginLeft: 65
  },
  SQUARED: {
    name: 'Squared',
    src: '/Images/TextToHand/Squared-Papper.jpg',
    lineHeight: 24,
    defaultFontSize: 38,
    marginLeft: 40
  },
  WHITE_PLAIN: {
    name: 'White Plain',
    src: '/Images/TextToHand/White-Paper1.jpg',
    lineHeight: 32,
    defaultFontSize: 38,
    marginLeft: 40
  },
  WHITE_TEXTURE: {
    name: 'White Textured',
    src: '/Images/TextToHand/White-Paper2.jpg',
    lineHeight: 32,
    defaultFontSize: 38,
    marginLeft: 40
  },
  PALE: {
    name: 'Pale',
    src: '/Images/TextToHand/Pale-Papper.jpg',
    lineHeight: 32,
    defaultFontSize: 38,
    marginLeft: 40
  },
  RECYCLED: {
    name: 'Recycled',
    src: '/Images/TextToHand/RufNote-Papper.jpg',
    lineHeight: 32,
    defaultFontSize: 38,
    marginLeft: 40
  },
  DECORATIVE: {
    name: 'Gift Border',
    src: '/Images/TextToHand/GiftPapper-1.jpg',
    lineHeight: 32,
    defaultFontSize: 38,
    marginLeft: 80
  },
  HOGWARTS_STYLE: {
    name: 'Hogwarts',
    src: '/Images/TextToHand/Hogwarts Style.jpg',
    lineHeight: 42,
    defaultFontSize: 38,
    marginLeft: 65
  },
  YELLOW_LEGAL: {
    name: 'Yellow Legal',
    src: '/Images/TextToHand/Yellow-Legal-Pad.jpg',
    lineHeight: 37,
    defaultFontSize: 38,
    marginLeft: 65
  },
  GRAPH_PAPER: {
    name: 'Graph Paper',
    src: '/Images/TextToHand/Graph-Paper.jpg',
    lineHeight: 24,
    defaultFontSize: 38,
    marginLeft: 40
  },
  VINTAGE_PARCHMENT: {
    name: 'Vintage Parchment',
    src: '/Images/TextToHand/Vintage-Parchment.jpg',
    lineHeight: 32,
    defaultFontSize: 38,
    marginLeft: 40
  }
}


export const PEN_TYPE_STYLES = {
  BALLPOINT: {
    lineWidth: 1,
    lineCap: 'round',
    shadowBlur: 0,
    opacity: 0.9
  },
  FOUNTAIN: {
    lineWidth: 1.5,
    lineCap: 'round',
    shadowBlur: 1,
    opacity: 0.85
  },
  GEL: {
    lineWidth: 1.2,
    lineCap: 'round',
    shadowBlur: 0.5,
    opacity: 0.8
  },
  MARKER: {
    lineWidth: 2.5,
    lineCap: 'square',
    shadowBlur: 2,
    opacity: 0.75
  }
}

export const INK_COLORS = {
  BLUE: '#0000FF',
  BLACK: '#000000',
  RED: '#FF0000',
  GREEN: '#008000',
  PURPLE: '#800080',
  BROWN: '#A52A2A',
  CUSTOM: '#000000'
}

export type PaperStyleKey = keyof typeof PAPER_STYLES
export type PenTypeKey = keyof typeof PEN_TYPE_STYLES
export type InkColorKey = keyof typeof INK_COLORS

