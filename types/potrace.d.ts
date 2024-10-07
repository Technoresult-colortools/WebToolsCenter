// potrace.d.ts
declare module 'potrace' {
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
  
    export function trace(
      file: Buffer | string,
      options: PotraceOptions,
      callback: (err: Error | null, svg: string) => void
    ): void;
  }
  