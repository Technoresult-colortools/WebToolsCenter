import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import potrace from 'potrace'
import { promisify } from 'util'
import type { ConversionRequest, PotraceOptions } from 'conversion-types'

// Extend the potrace type definition
declare module 'potrace' {
  export function posterize(
    file: Buffer | string,
    options: PotraceOptions & {
      colormode?: string;
      colorFirst?: boolean;
      colorMax?: number;
    },
    callback: (err: Error | null, svg: string) => void
  ): void;
}

const trace = promisify(potrace.trace)
const posterize = promisify(potrace.posterize)


export async function POST(request: NextRequest) {
  try {
    const body: ConversionRequest = await request.json()
    
    if (!body.file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Extract base64 data
    const base64Data = body.file.split(';base64,').pop()
    if (!base64Data) {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 })
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64')

    // Process image with sharp
    let processedBuffer: Buffer
    if (body.options?.color === 'black') {
      processedBuffer = await sharp(imageBuffer)
        .grayscale()
        .toColorspace('b-w')
        .toBuffer()
    } else {
      processedBuffer = await sharp(imageBuffer)
        .toColorspace('srgb')
        .toBuffer()
    }

    // Configure potrace options
    const potraceOptions: PotraceOptions = {
      turnPolicy: 'majority',
      turdSize: body.options?.turdSize ?? 2,
      alphaMax: 1,
      optCurve: body.options?.optCurve ?? true,
      optTolerance: body.options?.optTolerance ?? 0.2,
      threshold: body.options?.threshold ?? 128,
      blackOnWhite: true,
      color: body.options?.color === 'black' ? '#000000' : undefined,
      background: 'transparent'
    }

    let svg: string
    if (body.options?.color === 'color') {
      const colorPotraceOptions: PotraceOptions & Record<string, unknown> = {
        ...potraceOptions,
        // These will be added without TypeScript errors
        colormode: 'color',
        colorFirst: true,
        colorMax: body.options?.threshold ?? 32, // Use threshold as a proxy for color reduction
      }

      svg = await posterize(processedBuffer, colorPotraceOptions)
    } else {
      svg = await trace(processedBuffer, potraceOptions)
    }

    // Add XML declaration
    const fullSvg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svg}`

    console.log('Generated SVG:', fullSvg)

    return new NextResponse(fullSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      }
    })
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}