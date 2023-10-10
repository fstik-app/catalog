import { useUnit } from 'effector-react';

import styles from './index.module.scss';

import RLottie from '@/shared/lib/rlottie/RLottie';
import { AnimatedSticker, ImageMedia } from '@/entities/sticker';
import { $selectedSticker, stickerSelected } from '@/entities/sticker/model';


export const SelectedSticker = () => {
  const sticker = useUnit($selectedSticker);

  if (!sticker?.thumb && !sticker?.file_id) {
    return null;
  }

  return (<div onClick={() => stickerSelected(null)}>
    <div className={styles.StickerExpanded}>
      {
        sticker.animated
          ? <AnimatedSticker
            tgsUrl={import.meta.env.VITE_FILE_URL + (sticker.file_id || '') + '/sticker.webp'}
            size={240}
            play={true}
            forceOnHeavyAnimation={false}
            isLowPriority={false}
            onLoad={(self: RLottie) => {
              self.container?.classList?.add(styles.backgroundNone);
            }}
            onDestroy={(self: RLottie) => {
              self?.container?.classList?.remove(styles.backgroundNone);
            }}
          />
          : <ImageMedia
            size={240}
            src={import.meta.env.VITE_FILE_URL + (sticker.file_id || sticker.thumb?.file_id || '') + '/sticker.webp'}
            forcedLoading={false}
            computedWidth={240}
            computedHeight={240}
            computedMarginY={0}
            maxWidth={240}
          />
      }
    </div>
    <div className={styles.StickerExpandedWrapper}/>
  </div>
  );
};
