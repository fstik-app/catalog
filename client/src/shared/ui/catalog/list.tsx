import type { FC, PropsWithChildren } from 'react';

import styles from './styles.module.scss';


export const List: FC<PropsWithChildren> = ({ children }) => (
  <div className={styles.Catalog}>
    {children}
  </div>
);
