import { CSSProperties, FC, ReactNode } from 'react';

import styles from './slider.module.scss';


export const WrapperSlide: FC<{ children: ReactNode, style: CSSProperties }> = ({
  children,
  style,
}) => {
  return (
    <li className={styles.sticker} style={style}>
      {children}
    </li>
  );
};
