import { useTranslation } from 'react-i18next';
import { useUnit } from 'effector-react';

import styles from './recommendations.module.scss';

import { $catalogKind } from '@/entities/menu/model';
import { CATALOG_KIND_ENUM } from '@/shared/constants';


export const ListRecommendationsDivider = () => {
  const { t } = useTranslation();
  const kind = useUnit($catalogKind); // TODO

  return (
    <div className={styles.Title}>
      <div/><span>
        {
          t(kind === CATALOG_KIND_ENUM.EMOJI ? 'relatedCustomEmojis' : 'relatedStickerSets')
        }
      </span><div/>
    </div>
  );
};
