declare module 'react' {
  // Core React default export
  const React: any & {
    FC: any;
    ReactNode: any;
    ReactElement: any;
  };
  export default React;

  // Commonly-used hooks
  export function useState<T = any>(initial?: T): [T, (val: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useContext(context: any): any;
  export function useRef<T = any>(initial?: T): { current: T };
  export function useMemo<T = any>(factory: () => T, deps?: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(cb: T, deps?: any[]): T;

  // React components
  export const Fragment: any;
  export function Suspense(props: { fallback?: any; children?: any }): any;

  // Internal namespace for React types (to enable React.FC, ReactNode, etc.)
  export namespace React {
    interface FC<P = {}> {
      (props: P & { children?: any }): any;
    }

    type ReactNode = any;
    type ReactElement = any;
  }

  // Re-export shorthand types
  export type FC<P = {}> = React.FC<P>;
  export type ReactNode = React.ReactNode;
  export type ReactElement = React.ReactElement;

  // Event handler types for better type safety
  export type MouseEventHandler<T = Element> = (event: { currentTarget: T } & any) => void;
  export type ChangeEventHandler<T = Element> = (event: { currentTarget: T; target: T } & any) => void;
  export type KeyboardEventHandler<T = Element> = (event: { currentTarget: T } & any) => void;

  // Synthetic event wrappers
  export type ChangeEvent<T = Element> = { currentTarget: T; target: T } & any;
}

declare module 'react-router-dom' {
  // Components
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Link: any;
  export const NavLink: any;
  export const Outlet: any;
  export const Navigate: any;

  // Hooks
  export function useNavigate(): (path: string) => void;
  export function useParams<T extends Record<string, string | undefined> = Record<string, string>>(): T;
  export function useSearchParams(): [URLSearchParams, any];
}

declare module 'lucide-react' {
  // Export only the icons that are referenced in the project to avoid name-lookup issues
  export const User: any;
  export const ArrowLeft: any;
  export const ArrowRight: any;
  export const Award: any;
  export const Check: any;
  export const Upload: any;
  export const Camera: any;
  export const HelpCircle: any;
  export const Globe: any;
  export const Users: any;
  export const Loader2: any;
  export const ChevronDown: any;
  export const ChevronUp: any;
  export const Search: any;
  export const MapPin: any;
  export const Star: any;
  export const Eye: any;
  export const FileText: any;
  export const ExternalLink: any;
  export const Mail: any;
  export const Heart: any;
  export const AlertCircle: any;
  export const Bell: any;
  export const Menu: any;
  export const X: any;
}

// Augment ApiService typings
declare module './lib/api-fixed' {
  interface ApiService {
    getTeamDraft(): Promise<Record<string, any>>;
    saveTeamDraft(draft: Record<string, any>): Promise<{ success: boolean }>;
  }
}

declare module './lib/api' {
  interface ApiService {
    getTeamDraft(): Promise<Record<string, any>>;
    saveTeamDraft(draft: Record<string, any>): Promise<{ success: boolean }>;
  }
}