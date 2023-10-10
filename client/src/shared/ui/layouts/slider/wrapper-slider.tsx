import { FC, memo } from 'react';
import { Swiper } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { ReactNode } from 'react';

import styles from './slider.module.scss';

import { IS_ANDROID } from '@/shared/environment';


const Component: FC<{ children: ReactNode }> = ({ children }) => {
  return IS_ANDROID
    ? <div className={styles.Main + ' ' + styles.android}>{children}</div>
    : <Swiper
      className={styles.Main}

      modules={[FreeMode]}
      mousewheel={false}

      centeredSlides={false}
      pagination={false}
      spaceBetween={0}
      slidesPerView={'auto'}

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
      {children}
    </Swiper>;
};

export const WrapperSlider = memo(Component);
