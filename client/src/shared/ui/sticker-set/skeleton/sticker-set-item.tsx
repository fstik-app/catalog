import { forwardRef } from 'react';
import c from 'classnames';
import { useTranslation } from 'react-i18next';

import { ButtonSkeleton, ReactionSkeleton } from '../../button';

import styles from './sticker-set.module.scss';


export const StickerSetSkeleton = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <div
      ref={ref}
      className={styles.StickerSet}
    >
      <div className={styles.Head}>
        <div className={styles.label}>
          <label className={c(styles.name, styles.animated)}>
            Nom du pack de stickers
          </label>
          <div className={c(styles.description, styles.animated)}>
            Description très intéressante
          </div>
        </div>
        <ButtonSkeleton text={t('add')}/>
      </div>
      <div>
        <div
          className={styles.Main}
          style={{ marginLeft: 7.5 }}
        >
          {Array.from({ length: 5 }).map((_, j) => (
            <div
              key={'main' + j}
              className={c([styles.sticker, styles.animated])}
              style={{
                width: '60px',
                height: '60px',
              }}
            >
            </div>
          ))}
        </div>
        <div className={styles.Likes}>
          <ReactionSkeleton />
          <ReactionSkeleton />
        </div>
      </div>
    </div>
  );
});
