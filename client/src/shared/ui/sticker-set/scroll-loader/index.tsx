import { useState, useCallback } from 'react';

import { StickerSetSkeleton } from '../skeleton/sticker-set-item';
import { scrollLoaderIntersected } from '../model';


export const ScrollLoader = ({ onIntersect }: { onIntersect?: IntersectionObserverCallback }) => {
  const [observer] = useState(new IntersectionObserver(
    (entries, observer) => {
      if (entries[0]?.isIntersecting) {
        scrollLoaderIntersected();
        onIntersect?.(entries, observer);
      }
    },
    {
      root: null,
      threshold: 0,
      rootMargin: '0px',
    },
  ));

  const ref = useCallback((el: HTMLElement | null) => {
    observer.disconnect();
    if (el) {
      observer.observe(el);
    }
  }, [observer]);

  return (<StickerSetSkeleton ref={ref}/>);
};
