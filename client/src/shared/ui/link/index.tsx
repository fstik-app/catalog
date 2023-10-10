import { CSSProperties, FC, PropsWithChildren } from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';


type LinkProps = PropsWithChildren & {
  style?: CSSProperties;
  round?: boolean;
  link: string;
};

export const Link: FC<LinkProps> = ({ children, style, round, link }) => {
  return (
    <a
      className={cn(styles.Link, { [styles.round]: round })}
      style={style || {}}
      href={link}
    >
      {children}
    </a>
  );
};
