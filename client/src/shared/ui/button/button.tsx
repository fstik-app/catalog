import type { FC, MouseEventHandler } from 'react';
import c from 'classnames';

import styles from './button.module.scss';


export interface IButtonProps {
  onClick: MouseEventHandler,
  text: string,
  style?: string,
  children?: JSX.Element,
}

export const Button: FC<IButtonProps> = ({
  onClick,
  text,
  style = '',
}) => {
  return (
    <div>
      <div
        className={c(styles.button, style)}
        onClick={onClick}
      >
        {text}
      </div>
    </div>
  );
};

export const Skeleton:FC<Pick<IButtonProps, 'text'>> = ({
  text = 'Ajouter',
}) => {
  return (
    <div>
      <div className={c(styles.button, styles.animated)}>
        {text}
      </div>
    </div>
  );
};
