declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}

declare module 'react/jsx-dev-runtime' {
  export function jsxDEV(type: any, props: any, key: any, isStaticChildren?: boolean, source?: any, self?: any): any;
  export const Fragment: any;
}

// Fallback global JSX namespace to prevent "JSX element implicitly has type 'any'" errors
declare global {
  namespace JSX {
    // tslint:disable-next-line:interface-name
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}