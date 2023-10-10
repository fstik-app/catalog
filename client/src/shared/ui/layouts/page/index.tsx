import { FC, ReactNode } from 'react';

import styles from './page.module.scss';


interface PageProps {
  children?: ReactNode;
  overflow?: boolean;
}

export const Layout: FC<PageProps> = ({
  children,
}) => {
  return (
    <div className={styles.Page}>
      {children}
    </div>
  );
};
