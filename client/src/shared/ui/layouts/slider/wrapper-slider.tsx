import { FC, memo } from 'react';
import { ReactNode } from 'react';

import styles from './slider.module.scss';


const Component: FC<{ children: ReactNode }> = ({ children }) => {
  return (<ul className={styles.Main + ' ' + styles.android}>{children}</ul>);
};

export const WrapperSlider = memo(Component);
