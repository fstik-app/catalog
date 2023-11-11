import { ReactNode, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as ISwiper } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { noop } from 'lodash-es';
import c from 'classnames';

import { StickersProps } from './types';
import styles from './stickers.module.scss';

import { CATALOG_KIND_ENUM, STICKER_HEIGHT, STICKER_MAX_WIDTH, SWIPER_STICKER_MARGIN_RIGHT } from '@/shared/constants';
import { ISticker } from '@/types';
import type RLottie from '@/shared/lib/rlottie/RLottie';
import { AnimatedSticker, ImageMedia } from '@/entities/sticker';
import { useIntersectionObserver } from '@/shared/lib/telegram-web';


export const Stickers = ({ type, kind, stickers, packIndex, isAndroid, onClick = () => noop, showFull }: StickersProps) => {
  const kindRatio = kind === CATALOG_KIND_ENUM.EMOJI ? 1.75 : 1;
  const IS_ANDROID = isAndroid;

  const allWidth = useMemo(() => {
    if (IS_ANDROID) {
      return 5000;
    }

    const width = stickers.reduce((a: number, { width, height }) => {
      return Math.round(STICKER_HEIGHT * width / height) + SWIPER_STICKER_MARGIN_RIGHT + a;
    }, 0);

    return width < 450 ? width : width - 300;
  }, [IS_ANDROID, stickers]);

  const onSetTranslateHandler = useMemo(() => (swiper: ISwiper) => {
    if (~swiper.translate > allWidth) {
      swiper.setTranslate(-allWidth);
    }
  }, [allWidth]);

  const { observe: observeIntersectionForMedia } = useIntersectionObserver({
    rootRef: { current: null },
    margin: 200,
  });

  const { observe: observeIntersectionDestroyAnimated } = useIntersectionObserver({
    rootRef: { current: null },
    margin: 0,
  });

  const Wrapper = useMemo(() => IS_ANDROID
    ? (node: ReactNode) => (
      <div
        className={c(styles.Main, styles.android, showFull && styles.showFull)}>
        {node}
      </div>
    )
    : (node: ReactNode) => (
      <Swiper
        className={styles.Main}

        modules={[FreeMode]}
        mousewheel={false}

        centeredSlides={false}
        pagination={false}
        spaceBetween={0}
        slidesPerView={'auto'}

        onSetTranslate={onSetTranslateHandler}
        freeMode={{
          sticky: false,
          enabled: true,
          momentum: true,
          momentumVelocityRatio: 1,
        }}
        centeredSlidesBounds={true}
        // loopFillGroupWithBlank={true}
        slidesPerGroup={1}
      >
        {node}
      </Swiper>
    ), [IS_ANDROID, onSetTranslateHandler, showFull]);

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
      // TODO
      // else if (type === 'video') {
      // video: /* isNativePlatform
      //   ? <Video
      //     src={src}
      //     thumb_src={thumb_src}
      //     forcedLoading={forcedLoading}
      //     computedWidth={computedWidth}
      //     computedHeight={computedHeight}
      //     computedMarginY={computedMarginY}
      //     observeIntersection={observeIntersectionForMedia}
      //   />
      // }

      return {
        stickerComponent,
        computedWidth,
        file_id,
      };
    });

    // const wrappedComponents = stickerComponents.map((component, index) => {
    //   if (kind === 'emoji') {
    //     // If kind is 'emoji', wrap two elements together
    //     if (index % 2 === 0) {
    //       return (
    //         <div key={index} className="wrapper">
    //           {component}
    //           {stickerComponents[index + 1]}
    //         </div>
    //       );
    //     }
    //   } else if (kind === 'sticker') {
    //     // If kind is 'sticker', wrap each element individually
    //     return (
    //       <div key={index} className="wrapper">
    //         {component}
    //       </div>
    //     );
    //   }
    // });

    return stickerComponents.map(({ stickerComponent, file_id, computedWidth }, index) => {
      const wrapper = IS_ANDROID
        ? (c: ReactNode) => (
          <div className={styles.sticker} key={file_id}
            style={{
              width: computedWidth / kindRatio,
              maxWidth: STICKER_MAX_WIDTH / kindRatio,
              height: STICKER_HEIGHT,
              padding: kind === CATALOG_KIND_ENUM.EMOJI && showFull ? '0 0.5rem' : '1rem 0.5rem',
            }}
          >
            {c}
          </div>
        )
        : (c: ReactNode) => (
          <SwiperSlide className={styles.sticker} key={file_id}
            style={{
              width: computedWidth / kindRatio,
              maxWidth: STICKER_MAX_WIDTH / kindRatio,
              height: STICKER_HEIGHT,
            }}
          >
            {c}
          </SwiperSlide>
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

  return Wrapper(stickersR);
};
