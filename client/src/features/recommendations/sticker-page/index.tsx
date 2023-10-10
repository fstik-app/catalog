import { useTranslation } from 'react-i18next';

import styles from './recommendations.module.scss';


export const ListRecommendationsDivider = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.Title}>
      <div/><span>{t('relatedStickerSets')}</span><div/>
    </div>
  );
};
