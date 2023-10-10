import type {
  FC,
  MouseEventHandler,
  PropsWithChildren,
} from 'react';
import c from 'classnames';

import {
  Button,
  Skeleton as ButtonSkeleton,
} from './button';
import {
  ShareButton,
  Skeleton as ShareButtonSkeleton,
} from './share-button';
import styles from './sticky-button.module.scss';


export const StickyButtonWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (<div className={c(styles.StickyButtonWrapper)}>
    {children}
  </div> );
};

export const AddShareButtonsSticky = ({
  onClick,
  text,
  name,
}: {
  onClick: MouseEventHandler,
  text: string,
  name?: string,
}) => {
  return (
    <StickyButtonWrapper>
      <Button onClick={onClick} text={text}/>
      {
        name && <ShareButton name={name}/>
      }
    </StickyButtonWrapper>
  );
};

export const Skeleton = ({
  text,
}: {
  text: string,
}) => {
  return (
    <StickyButtonWrapper>
      <ButtonSkeleton text={text}/>
      <ShareButtonSkeleton />
    </StickyButtonWrapper>
  );
};
