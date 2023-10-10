import { useUnit } from 'effector-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { $searchQuery } from '@/entities/search';
import { $mainMenu } from '@/entities/menu/model';


export const usePageTitle = (text?: string) => {
  const query = useUnit($searchQuery);
  const menu = useUnit($mainMenu);
  const { t } = useTranslation();
  const timeout = useRef<NodeJS.Timeout>();

  const title = text || query || menu;

  useEffect(() => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      document.title = `${title}${title ? ' - ' : ''}${t('meta.title')}`;
    }, 1000);
  }, [t, title]);
};
