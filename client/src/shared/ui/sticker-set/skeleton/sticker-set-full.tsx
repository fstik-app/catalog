import { forwardRef } from 'react';
import c from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactionSkeleton, StickySkeleton } from '../../button';

import styles from './sticker-set.module.scss';


export const StickerSetFullSkeleton = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <div
      ref={ref}
      className={styles.StickerSet}
    >
      <div className={styles.Head}>
        <div className={styles.label}>
          <label className={c(styles.name, 'skeleton')}>
            Nom du pack de stickers
          </label>
          <div className={c(styles.description, 'skeleton')}>
            Description très intéressante
          </div>
        </div>
      </div>
      <div className={styles.Likes}>
        <ReactionSkeleton />
        <ReactionSkeleton />
      </div>
      <div>
        <div
          className={c(styles.Main, styles.showFull)}
          style={{ marginLeft: 7.5 }}
        >
          {Array.from({ length: 60 }).map((_, j) => (
            <div
              key={'main' + j}
              className={c([styles.sticker, 'skeleton'])}
              style={{
                width: '60px',
                height: '60px',
                margin: '0 10px 10px 0',
              }}
            >
            </div>
          ))}
        </div>
      </div>
      <StickySkeleton text={`${t('add')} 100 ${t('STICKERS')}`}/>
    </div>
  );
});
