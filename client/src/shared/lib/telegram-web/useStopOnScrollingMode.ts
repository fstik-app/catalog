import { useEffect, useRef } from 'react';


export default function useStopOnScrollingMode (
  onScroll?: AnyToVoidFunction,
  onScrollEnd?: AnyToVoidFunction,
) {
  const timer = useRef<string | number | NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (onScroll) {
      document.addEventListener('scroll', () => {
        clearTimeout(timer.current);
        onScroll();

        if (onScrollEnd) {
          timer.current = setTimeout(onScrollEnd, 100);
        }
      });
    }

    return () => {
      if (onScrollEnd) {
        clearTimeout(timer.current);
      }

      if (onScroll) {
        document.removeEventListener('scroll', onScroll);
      }
    };
  }, [onScroll, onScrollEnd]);
}
