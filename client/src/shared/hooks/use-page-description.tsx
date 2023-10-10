import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';


export const usePageDescription = (description: string) => {
  const { t } = useTranslation();

  useEffect(() => {
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `${description}${description ? ' - ' : ''}${t('meta.title')}`,
      );
  }, [t, description]);
};
