import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Skeleton as SkeletonButton,
} from './button';
import styles from './button.module.scss';


export const ShareButton = ({ name }: { name: string }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`https://t.me/fstikbot/catalog?startApp=set=${name}&startapp=set=${name}`);

    // in some cases, it was necessary to use this.
    const textarea = document.createElement('textarea');

    textarea.value = `https://t.me/fstikbot/catalog?startApp=set=${name}&startapp=set=${name}`;
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();

    setIsCopied(true);


    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };


  return (
    <Button
      text={isCopied ? t('copied') : t('share')}
      onClick={handleCopyClick}
      style={styles.share}
    />
  );
};

export const Skeleton = () => {
  const { t } = useTranslation();

  return (
    <SkeletonButton text={t('share')}/>
  );
};
