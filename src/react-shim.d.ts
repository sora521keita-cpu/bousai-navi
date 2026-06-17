declare module 'react' {
  export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((current: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), dependencies?: unknown[]): void;
  export const StrictMode: (props: { children?: ReactNode }) => JSX.Element;
  export type ReactNode = JSX.Element | string | number | boolean | null | undefined | ReactNode[];
}

declare module 'react-dom/client' {
  export function createRoot(element: Element): { render(children: JSX.Element): void };
}

declare namespace JSX {
  type Element = unknown;
  interface IntrinsicElements {
    [elementName: string]: Record<string, unknown>;
  }
}

declare module 'react/jsx-runtime' {
  export function jsx(type: unknown, props: unknown, key?: unknown): JSX.Element;
  export function jsxs(type: unknown, props: unknown, key?: unknown): JSX.Element;
  export const Fragment: unknown;
}

declare module '*.css' {}

declare namespace JSX {
  interface IntrinsicAttributes {
    key?: string | number;
  }
}
