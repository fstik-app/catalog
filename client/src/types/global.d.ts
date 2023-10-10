declare module 'pako/dist/pako_inflate' {
  function inflate (...args: any[]): string;
}

type AnyClass = new (...args: any[]) => any;
type AnyFunction = (...args: any[]) => any;
type AnyToVoidFunction = (...args: any[]) => void;
type NoneToVoidFunction = () => void;
