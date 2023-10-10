import { useEffect } from 'react';


export function scrollToTop () {
  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, []);

  return null;
}
