import { useRef } from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import c from 'classnames';

import styles from './menu.module.scss';

import { CATALOG_KIND_ENUM } from '@/shared/constants';
import { $catalogKind, $mainMenuVisibility, setCatalogKind } from '@/entities/menu/model';
import { Button } from '@/shared/ui';


export const CatalogKindMenu = () => {
  const { t } = useTranslation();
  const isOpen = useUnit($mainMenuVisibility);
  const kind = useUnit($catalogKind);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={c([styles.Menu, isOpen && styles.isOpen])}
    >
      <div
        className={styles.buttonsWrapper}
        ref={wrapperRef}
      >
        <Button
          style={c(styles.MenuButton, kind === CATALOG_KIND_ENUM.STICKER && styles.active)}
          onClick={() => setCatalogKind(CATALOG_KIND_ENUM.STICKER)}
          text={t('Stickers')}
        />
        <Button
          style={c(styles.MenuButton, kind === CATALOG_KIND_ENUM.EMOJI && styles.active)}
          onClick={() => setCatalogKind(CATALOG_KIND_ENUM.EMOJI)}
          text={t('Emojis')}
        />
      </div>
    </div>
  );
};
