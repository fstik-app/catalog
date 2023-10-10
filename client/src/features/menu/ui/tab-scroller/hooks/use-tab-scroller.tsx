import {
  useState,
  useEffect,
  useCallback,
  MutableRefObject,
} from 'react';


export const useTabsScroller = (
  myRef: MutableRefObject<HTMLElement> | MutableRefObject<null>,
  menuOption: string,
) => {
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleResize = useCallback(() => {
    let element = null;

    for (const el of myRef.current?.children || []) {
      if (menuOption === el?.getAttribute('data-menu-option')) {
        element = el;
        break;
      }
    }

    if (!element) {
      setLeft(0);
      setWidth(0);

      return;
    }

    const { x, width, height } = element?.getBoundingClientRect() || {};

    const scrollLeft = myRef.current?.parentElement?.scrollLeft || 0;

    const parentX = myRef.current?.parentElement?.getBoundingClientRect()?.x || 0;

    setLeft((x || 0) + scrollLeft - parentX);
    setWidth(width || 0);
    setHeight(height || 0);
  }, [menuOption, myRef]);


  useEffect(() => {
    handleResize();

    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOption, myRef, handleResize]);

  return { left, width, height };
};
