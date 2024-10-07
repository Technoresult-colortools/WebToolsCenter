
declare module 'conversion-types' {
    export interface PotraceOptions {
        turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority';
        turdSize?: number;
        alphaMax?: number;
        optCurve?: boolean;
        optTolerance?: number;
        threshold?: number;
        blackOnWhite?: boolean;
        color?: string;
        background?: string;
      }
  
    export interface ConversionOptions {
      color?: 'black' | 'color'
      turdSize?: number
      threshold?: number
      optCurve?: boolean
      optTolerance?: number
    }
  
    export interface ConversionResponse {
      svg: string
      error?: string
    }
  
    export interface ConversionRequest {
        file: string;
        options?: {
          color?: 'black' | 'color';
          turdSize?: number;
          threshold?: number;
          optCurve?: boolean;
          optTolerance?: number;
        };
      }
  }