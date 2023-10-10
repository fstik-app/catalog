import { useEffect, useRef, useState } from 'react';


export const useOnScroll = () => {
  const [isOpen, setIsOpen] = useState(true);
  const prevScrollpos = useRef(window.scrollY);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (prevScrollpos.current > currentScrollPos || window.scrollY <= 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }

      prevScrollpos.current = currentScrollPos;
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isOpen]);

  return isOpen;
};
