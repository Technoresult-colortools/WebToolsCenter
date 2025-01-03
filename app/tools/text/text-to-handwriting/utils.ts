import { Font, PaperStyleKey, PAPER_STYLES } from './constants'

export const loadFonts = async (fonts: Font[]): Promise<boolean> => {
  const loadedFonts = await Promise.all(
    fonts.map(async (font) => {
      try {
        const fontFace = new FontFace(font.name, `url(${font.src})`, {
          style: 'normal',
          weight: '400',
          display: 'swap'
        })
        
        const loadedFont = await fontFace.load()
        document.fonts.add(loadedFont)
        return true
      } catch (error) {
        return false
      }
    })
  )

  return loadedFonts.every(Boolean)
}

export const fitTextBetweenLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
 fontSize: number // eslint-disable-line @typescript-eslint/no-unused-vars
) => {

  const words = text.split(' ')
  let line = ''
  let posY = y
  
  const fontMetrics = ctx.measureText('M')
  const actualHeight = fontMetrics.actualBoundingBoxAscent + fontMetrics.actualBoundingBoxDescent
  const baselineOffset = (lineHeight - actualHeight) / 2 + fontMetrics.actualBoundingBoxAscent

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const testLine = line + (line ? ' ' : '') + word
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, posY + baselineOffset)
      line = word
      posY += lineHeight
    } else {
      line = testLine
    }
  }
  
  ctx.fillText(line, x, posY + baselineOffset)
  return posY + lineHeight
}

export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export const calculateLineHeight = (paperStyle: PaperStyleKey) => {
  return PAPER_STYLES[paperStyle].lineHeight
}

export const splitTextIntoPages = (
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  lineHeight: number,
  maxWidth: number,
  maxHeight: number
): string[] => {
  const words = text.split(' ')
  const pages: string[] = []
  let currentPage = ''
  let currentLine = ''
  let currentY = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth) {
      if (currentY + lineHeight > maxHeight) {
        pages.push(currentPage.trim())
        currentPage = ''
        currentY = 0
      }
      currentPage += (currentPage ? '\n' : '') + currentLine
      currentY += lineHeight
      currentLine = word
    } else {
      currentLine = testLine
    }

    if (i === words.length - 1) {
      if (currentY + lineHeight > maxHeight) {
        pages.push(currentPage.trim())
        currentPage = currentLine
      } else {
        currentPage += (currentPage ? '\n' : '') + currentLine
      }
    }
  }

  if (currentPage) {
    pages.push(currentPage.trim())
  }

  return pages
}

