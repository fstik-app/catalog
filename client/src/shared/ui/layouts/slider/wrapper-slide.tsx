import { SwiperSlide } from 'swiper/react';
import { CSSProperties, FC, ReactNode } from 'react';

import styles from './slider.module.scss';

import { IS_ANDROID } from '@/shared/environment';


export const WrapperSlide: FC<{ children: ReactNode, style: CSSProperties }> = ({
  children,
  style,
}) => {
  return IS_ANDROID
    ? (
      <div
        className={styles.sticker}
        style={style}
      >
        {children}
      </div>
    )
    : (
      <SwiperSlide
        className={styles.sticker}
        style={style}
      >
        {children}
      </SwiperSlide>
    );
};
