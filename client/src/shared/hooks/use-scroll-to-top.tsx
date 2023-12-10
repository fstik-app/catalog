import { useEffect } from 'react';


export function useScrollToTop (deps: unknown[] = []) {
  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, deps);

  return null;
}
