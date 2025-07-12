// Global JSX fallback to satisfy TypeScript when @types/react is absent
import { ReactNode } from 'react';

declare global {
  namespace JSX {
    // Intrinsic element attributes
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    // Element
    interface Element {
      readonly props: any;
      readonly type: any;
    }

    type ElementClass = any;
    type ElementAttributesProperty = any;
  }
}

export {};