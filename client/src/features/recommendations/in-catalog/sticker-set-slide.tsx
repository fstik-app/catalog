import styles from './slide.module.scss';

import { IStickerSet } from '@/types';
import { routes } from '@/app/router';
import { FirstSticker } from '@/shared/ui/sticker-card';


export const StickerSetSlide = ({
  stickerSet,
}: {
  stickerSet: IStickerSet
}) => {
  const title = stickerSet.title.split(' ').slice(0, 4).join(' ');


  return (
    <div
      className={styles.CarousellSlide}
      key={stickerSet.name}
      onClick={() => {
        // https://atomic-router.github.io/react/api/use-link.html
        routes.stickerSet.open({ stickerSetName: stickerSet.name });
      }}
    >
      <div className={styles.title}>
        <span>
          {title}
        </span>
      </div>
      <div className={styles.image}>
        <FirstSticker
          stickerSet={stickerSet}
          width={120}
          height={120}
        />
      </div>
    </div>
  );
};
