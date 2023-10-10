import { useEffect, useRef, useState } from 'react';
import { noop } from 'lodash';

import styles from './stickers.module.scss';

import { IS_WEBM_SUPPORTED } from '@/shared/environment';
import { ObserveFn, useIsIntersecting } from '@/shared/lib/telegram-web/useIntersectionObserver';


export const Video = ({
  src,
  // forcedLoading,
  thumb_src,
  computedWidth,
  computedHeight,
  computedMarginY,
  observeIntersection,
}: {
  src: string
  forcedLoading: boolean
  thumb_src?: string
  style?: Record<string, string>
  computedWidth: number
  computedHeight: number
  computedMarginY: number
  observeIntersection: ObserveFn
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoadingFired, setLoadingFired] = useState(false); // todo

  const isIntesecting = useIsIntersecting(ref, observeIntersection, (entry: { isIntersecting: boolean; }) => {
    ref.current?.classList.add(styles.backgroundNone);
    if (entry.isIntersecting && IS_WEBM_SUPPORTED) {
      setLoadingFired(true);
      // addMedia(() => setLoadingFired(true));
      // console.log('set video src');
    }
  });

  useEffect(() => {
    const video = ref.current?.childNodes.item(0) as HTMLVideoElement | undefined;

    if (video && isLoadingFired) {
      if (IS_WEBM_SUPPORTED) {
        // TODO webm is not enabled yet;
        // video.src = src;
      }

      // if (isNativePlatform) {
      //   video.src = src;
      // }

      setTimeout(() => {
        ref.current?.classList.add(styles.backgroundNone);
        ref.current?.classList.add(styles.backgroundNone);
      }, 200);
    }
  }, [isLoadingFired, src]);

  useEffect(() => {
    if (!ref.current || !IS_WEBM_SUPPORTED) {
      return;
    }

    const video = ref.current?.childNodes.item(0) as HTMLVideoElement | undefined;

    video && isIntesecting ? video?.play().catch(noop) : video?.pause();

  }, [ref, isIntesecting]);

  return (
    <div
      ref={ref}
      style={{
        overflow: 'hidden',
        // width: computedWidth,
        // maxWidth: '120px',
        height: computedHeight,
        // marginTop: computedMarginY,
        // maxHeight: '60px',
        overflowY: 'hidden',
      }}
    >
      <video
        data-computed-height={computedHeight}
        loop
        muted
        disablePictureInPicture
        playsInline

        poster={thumb_src}
        style={{
          width: computedWidth,
          maxWidth: '180px',
          // height: computedHeight,
          marginTop: computedMarginY,
          maxHeight: '180px',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
};
