import { ReactNode, useMemo } from 'react';
import { noop } from 'lodash-es';
import c from 'classnames';

import { StickersProps } from './types';
import styles from './stickers.module.scss';

import { CATALOG_KIND_ENUM, STICKER_HEIGHT, STICKER_MAX_WIDTH } from '@/shared/constants';
import { ISticker } from '@/types';
import type RLottie from '@/shared/lib/rlottie/RLottie';
import { AnimatedSticker, ImageMedia } from '@/entities/sticker';
import { useIntersectionObserver } from '@/shared/lib/telegram-web';
import { IS_ANDROID } from '@/shared/environment';


export const Stickers = ({ type, kind, stickers, packIndex, onClick = () => noop, showFull }: StickersProps) => {
  const kindRatio = kind === CATALOG_KIND_ENUM.EMOJI ? 1.75 : 1;

  const { observe: observeIntersectionForMedia } = useIntersectionObserver({
    rootRef: { current: null },
    margin: 200,
  });

  const { observe: observeIntersectionDestroyAnimated } = useIntersectionObserver({
    rootRef: { current: null },
    margin: 0,
  });

  const stickersR = useMemo(() => {
    const stickerComponents = stickers.map(({ thumb, file_id, height, width }: ISticker, i: number) => {
      const forcedLoading = (packIndex < 4) && (i < 6);
      const src = import.meta.env.VITE_API_URL + '/file/' + file_id + '/sticker.webp';
      const thumb_src = import.meta.env.VITE_API_URL + '/file/' + (thumb?.file_id || '') + '/sticker.webp';
      const computedWidth = Math.round(STICKER_HEIGHT * width / height);

      const computedHeight = computedWidth > STICKER_MAX_WIDTH
        ? STICKER_MAX_WIDTH * height / computedWidth
        : STICKER_HEIGHT;

      const computedMarginY = computedHeight < STICKER_HEIGHT
        ? (STICKER_HEIGHT - computedHeight) / 2
        : 0;

      let stickerComponent: JSX.Element | undefined;

      if (type === 'animated') {
        stickerComponent = (<AnimatedSticker
          onClick={() => onClick({ animated: true, file_id, thumb })}
          tgsUrl={src}
          size={60 / kindRatio}
          play={true}
          forceOnHeavyAnimation={false}
          isLowPriority={IS_ANDROID}
          onLoad={(self: RLottie) => {
            self.container?.classList?.add(styles.backgroundNone);
          }}
          onDestroy={(self: RLottie) => {
            self?.container?.classList?.remove(styles.backgroundNone);
          }}
          observeIntersection={observeIntersectionForMedia}
          observeIntersectionDestroyAnimated={observeIntersectionDestroyAnimated}
        />);
      } else if (type === 'image' || type === 'video') {
        stickerComponent = (<ImageMedia
          onClick={() => onClick({ file_id })}
          src={thumb_src}
          size={60 / kindRatio}
          forcedLoading={forcedLoading}
          computedWidth={computedWidth / kindRatio}
          computedHeight={computedHeight / kindRatio}
          computedMarginY={computedMarginY / kindRatio}
          observeIntersection={observeIntersectionForMedia}
        />);
      }

      return {
        stickerComponent,
        computedWidth,
        file_id,
      };
    });

    return stickerComponents.map(({ stickerComponent, file_id, computedWidth }, index) => {
      const wrapper = (c: ReactNode) => (
        <li className={styles.sticker} key={file_id}
          style={{
            width: computedWidth / kindRatio,
            maxWidth: STICKER_MAX_WIDTH / kindRatio,
            height: STICKER_HEIGHT,
            padding: kind === CATALOG_KIND_ENUM.EMOJI && showFull ? '0 0.5rem' : '1rem 0.5rem',
          }}
        >
          {c}
        </li>
      );

      if (kind === CATALOG_KIND_ENUM.EMOJI && !showFull) {
        if (index < stickerComponents.length / 2) {
          return wrapper(<>
            {stickerComponent}
            <div style={{ marginBottom: '0.3rem' }}/>
            {
              stickerComponents[index + Math.ceil(stickerComponents.length / 2)]?.stickerComponent
              && stickerComponents[index + Math.ceil(stickerComponents.length / 2)].stickerComponent
            }
          </>);
        }
      } else {
        return wrapper(stickerComponent);
      }
    });
  }, [stickers]);

  return (
    <ul className={c(styles.Main, styles.android, showFull && styles.showFull)}>
      {stickersR}
    </ul>
  );
};
