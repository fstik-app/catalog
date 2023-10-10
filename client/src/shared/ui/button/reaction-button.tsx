import type { FC, MouseEventHandler, PropsWithChildren } from 'react';
import c from 'classnames';

import buttonStyles from './button.module.scss';
import styles from './reaction.module.scss';

import { REACTION_ENUM } from '@/types';
import like from '@/assets/img/thumbs-up.png';
import dislike from '@/assets/img/thumbs-down.png';


interface ButtonProps extends PropsWithChildren {
  onClick: MouseEventHandler,
  text: string,
  style?: string,
  type?: REACTION_ENUM,
  enabled?: boolean,
  children?: JSX.Element,
}

const types = {
  [REACTION_ENUM.LIKE]: like,
  [REACTION_ENUM.DISLIKE]: dislike,
};

export const Button: FC<ButtonProps> = (
  { onClick, enabled, text, type },
) => {
  return (
    <button
      onClick={onClick}
      className={c(
        styles.reaction_button,
        styles.like,
        enabled
          ? type ? styles.enabled : styles.bg_red
          : null,
      )}
    >
      {type && <img alt={type} src={types[type]}></img>}
      {text}
    </button>
  );
};

export const Skeleton: FC = () => {
  return (
    <button
      className={c(
        styles.reaction_button,
        styles.like,
        buttonStyles.animated,
      )}
    >
      {'text'}
    </button>
  );
};
