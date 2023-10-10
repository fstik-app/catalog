import { Link } from 'atomic-router-react';

import styles from './sticker-card.module.scss';

import { ImageMedia, AnimatedSticker } from '@/entities/sticker';
import RLottie from '@/shared/lib/rlottie/RLottie';
import { useIntersectionObserver } from '@/shared/lib/telegram-web';
import { IStickerSet, StickerSetEnum } from '@/types';


const STICKER_SIZE = 150;

export const StickerCard = ({
  stickerSet,
}: {
  stickerSet: IStickerSet
}) => {
  return (<div className={styles.StickerCard}>
    <FirstSticker stickerSet={stickerSet}/>
    <Link to={`stickerset/${stickerSet.name}`}>
      {stickerSet.title}
    </Link>
  </div>);
};

export const FirstSticker = ({
  stickerSet,
  width,
  height,
}: {
  stickerSet: IStickerSet,
  width?: number,
  height?: number,
}) => {
  const type = stickerSet.type;
  const sticker = stickerSet.stickers[0];

  const { observe: observeIntersectionForMedia } = useIntersectionObserver({
    rootRef: { current: null },
    margin: 0,
  });

  const { observe: observeIntersectionDestroyAnimated } = useIntersectionObserver({
    rootRef: { current: null },
    margin: 0,
  });

  if (!sticker) {
    return null;
  }

  if (type === StickerSetEnum.IMAGE) {
    const src = type === StickerSetEnum.IMAGE
      ? sticker.file_id
      : sticker.thumb?.file_id || '';

    return (<>
      <ImageMedia
        src={import.meta.env.VITE_API_URL + '/file/' + src + '/sticker.webp'}
        size={STICKER_SIZE}
        forcedLoading={true}
        computedWidth={width || sticker.width}
        computedHeight={height || sticker.height}
        computedMarginY={0}
      />
    </>);
  }

  if (type === StickerSetEnum.VIDEO) {
    const src = sticker.thumb?.file_id || '';

    return (<>
      <ImageMedia
        src={import.meta.env.VITE_API_URL + '/file/' + src + '/sticker.webp'}
        size={STICKER_SIZE}
        forcedLoading={true}
        computedWidth={width || sticker.width}
        computedHeight={height || sticker.height}
        computedMarginY={0}
      />
    </>);
  }

  // if (type === StickerSetEnum.VIDEO) {
  //   const src = import.meta.env.VITE_API_URL + '/file/' + sticker.file_id + '/sticker.mp4';
  //   const scrThumb = import.meta.env.VITE_API_URL + '/file/' + (sticker.thumb?.file_id || '') + '/sticker.webp';

  //   return (<>
  //     <Video
  //       src={src}
  //       thumb_src={scrThumb}
  //       forcedLoading={true}
  //       computedWidth={width || STICKER_SIZE}
  //       computedHeight={height || STICKER_SIZE}
  //       computedMarginY={10}
  //       observeIntersection={observeIntersectionForMedia}
  //     />
  //   </>);
  // }

  if (type === StickerSetEnum.ANIMATED) {
    const src = import.meta.env.VITE_API_URL + '/file/' + sticker.file_id + '/sticker.webp';

    return (<>
      <AnimatedSticker
        tgsUrl={src}
        size={width || STICKER_SIZE}
        play={true}
        forceOnHeavyAnimation={false}
        isLowPriority={false}
        onLoad={(self: RLottie) => {
          self.container?.classList?.add(styles.backgroundNone);
        }}
        onDestroy={(self: RLottie) => {
          self?.container?.classList?.remove(styles.backgroundNone);
        }}
        observeIntersection={observeIntersectionForMedia}
        observeIntersectionDestroyAnimated={observeIntersectionDestroyAnimated}
      />
    </>);
  }

  return null;
};
