import { FC } from 'react';
import { SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';

import styles from './on-like-recommendations.module.scss';
import { StickerSetSlide } from './sticker-set-slide';

import { useRecommendations } from '@/shared/hooks/use-recommendations';
import { IS_ANDROID } from '@/shared/environment';
import { WrapperSlider } from '@/shared/ui/layouts/slider';
import { IStickerSet } from '@/types';


export const OnLikeRecommendations: FC<{ stickerSetId: string }> = ({ stickerSetId }) => {
  const likeRecommendations = useRecommendations(stickerSetId);
  const { t } = useTranslation();

  const swiper = likeRecommendations
    .map((stickerSet: IStickerSet) => {
      const { id } = stickerSet;

      return IS_ANDROID
        ? (
          <div
            key={id}
            className={styles.sticker}
          >
            <StickerSetSlide stickerSet={stickerSet}/>
          </div>
        )
        : (
          <SwiperSlide
            key={id}
            className={styles.sticker}
          >
            <StickerSetSlide stickerSet={stickerSet}/>
          </SwiperSlide>
        );
    });

  return (<div
    style={{
      maxHeight: likeRecommendations.length > 0
        ? '300px'
        : '0px',
    }}
    className={styles.OnLikeRecommendations}
  >
    {
      likeRecommendations.length > 0 && (
        <>
          <span className={styles.BlockTitle}>{t('relatedStickerSets') + ' ✨'}</span>
          <WrapperSlider>{swiper}</WrapperSlider>
        </>
      )
    }
  </div>);
};
