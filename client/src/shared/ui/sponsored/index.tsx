import { useTranslation } from 'react-i18next';

import styles from './sponsored.module.scss';

import { openTelegramLink } from '@/shared/lib/utils';


export const Sponsored = () => {
  const { t } = useTranslation();

  return (
    <span onClick={() => openTelegramLink('https://t.me/Ly_oBot')} className={styles.Sponsored}>
      {t('sponsored')}
    </span>
  );
};
