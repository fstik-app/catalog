import { useEffect, useRef, useState } from 'react';

import { ObserveFn, useIsIntersecting } from '@/shared/lib/telegram-web';


export const ImageMedia = ({
  onClick,
  src,
  size = 'auto',
  forcedLoading,
  computedWidth,
  computedHeight,
  computedMarginY,
  maxWidth = 120,
  observeIntersection,
}: {
  onClick?: AnyToVoidFunction,
  src: string
  size?: number | 'auto'
  forcedLoading: boolean
  style?: Record<string, string>
  computedWidth: number
  computedHeight: number
  computedMarginY: number
  maxWidth?: number
  observeIntersection?: ObserveFn
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isIntesecting = useIsIntersecting(ref, observeIntersection);

  useEffect(() => {
    if (!ref.current || isLoaded) {
      return;
    }

    if (!isLoaded && (forcedLoading || isIntesecting)) {
      const img = new Image();
      const imageDiv = ref.current;

      img.style.width = computedWidth + 'px';
      img.style.maxWidth = maxWidth + 'px';
      img.style.height = computedHeight + 'px';
      img.style.marginTop = computedMarginY + 'px';
      img.style.maxHeight = size + 'px';
      img.style.backgroundSize = 'contain';
      img.style.backgroundImage = '';
      img.style.backgroundRepeat = 'no-repeat';

      img.addEventListener('load', function () {
        setIsLoaded(true);
        setTimeout(() => {
          if (imageDiv.childNodes.length === 0) {
            imageDiv.append(img);
          }
          imageDiv.style.background = 'none';
        }, 100);
      });

      img.src = src || '';
    }
  }, [isIntesecting, isLoaded, forcedLoading, src, computedWidth, maxWidth, computedHeight, computedMarginY, size]);

  return (
    <div
      onClick={onClick}
      ref={ref}
      style={{
        width: computedWidth,
        maxWidth,
        height: computedHeight,
        marginTop: computedMarginY,
        maxHeight: size,
        overflow: 'hidden',
      }}
    />
  );
};
