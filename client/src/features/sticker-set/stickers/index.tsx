import { ReactNode, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as ISwiper } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { noop } from 'lodash';
import c from 'classnames';

import { StickersProps } from './types';
import styles from './stickers.module.scss';

import { STICKER_HEIGHT, STICKER_MAX_WIDTH, SWIPER_STICKER_MARGIN_RIGHT } from '@/shared/constants';
import { ISticker } from '@/types';
import type RLottie from '@/shared/lib/rlottie/RLottie';
import { AnimatedSticker, ImageMedia } from '@/entities/sticker';
import { useIntersectionObserver } from '@/shared/lib/telegram-web';


export const Stickers = ({ type, stickers, packIndex, isAndroid, onClick = () => noop, showFull }: StickersProps) => {
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

  const stickersR = useMemo(() => stickers.map(({ thumb, file_id, height, width }: ISticker, i: number) => {
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

    const STICKER_COMPONENTS = {
      animated: <AnimatedSticker
        onClick={() => onClick({ animated: true, file_id, thumb })}
        tgsUrl={src}
        size={60}
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
      />,
      image: <ImageMedia
        onClick={() => onClick({ file_id })}
        src={thumb_src}
        size={60}
        forcedLoading={forcedLoading}
        computedWidth={computedWidth}
        computedHeight={computedHeight}
        computedMarginY={computedMarginY}
        observeIntersection={observeIntersectionForMedia}
      />,
      // TODO
      video: /* isNativePlatform
        ? <Video
          src={src}
          thumb_src={thumb_src}
          forcedLoading={forcedLoading}
          computedWidth={computedWidth}
          computedHeight={computedHeight}
          computedMarginY={computedMarginY}
          observeIntersection={observeIntersectionForMedia}
        />
        : **/ <ImageMedia
        onClick={() => onClick({ thumb })}
        src={thumb_src}
        size={60}
        forcedLoading={forcedLoading}
        computedWidth={computedWidth}
        computedHeight={computedHeight}
        computedMarginY={computedMarginY}
        observeIntersection={observeIntersectionForMedia}
      />,
    };

    const sticker = STICKER_COMPONENTS[
      type as 'image' | 'video' | 'animated'
    ];

    return IS_ANDROID
      ? (
        <div className={styles.sticker} key={file_id}
          style={{
            width: computedWidth,
            maxWidth: STICKER_MAX_WIDTH,
            height: STICKER_HEIGHT,
          }}
        >
          {sticker}
        </div>
      )
      : (
        <SwiperSlide className={styles.sticker} key={file_id}
          style={{
            width: computedWidth,
            maxWidth: STICKER_MAX_WIDTH,
            height: STICKER_HEIGHT,
          }}
        >
          {sticker}
        </SwiperSlide>
      );
  }), [stickers]);

  return Wrapper(stickersR);
};
