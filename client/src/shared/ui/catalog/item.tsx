import type { CSSProperties, FC, PropsWithChildren } from 'react';

import styles from './styles.module.scss';


export const Item: FC<PropsWithChildren & { style?: CSSProperties }> = (
  { children, style },
) => {
  return (
    <div className={styles.CatalogItem} style={style}>
      {children}
    </div>
  );
};
