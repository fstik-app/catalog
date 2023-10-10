import c from 'classnames';

import styles from './tab-scroller.module.scss';
import { TabsScrollerProps } from './types';


export const TabsScroller = ({ bounds }: TabsScrollerProps) => {
  return (
    <div
      className={c([styles.TabsScroller])}
      style={{
        left: bounds.left,
        width: bounds.width,
      }}
    />
  );
};
