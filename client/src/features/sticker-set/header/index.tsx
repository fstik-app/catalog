import { useTranslation } from 'react-i18next';
import { Link } from 'atomic-router-react';
import { useMemo, MouseEvent } from 'react';

import styles from './header.module.scss';
import { HeaderProps } from './types';

import { ADD_STICKER_SET_URL } from '@/shared/constants';
import { openTelegramLink } from '@/shared/lib/utils';
import { routes } from '@/app/router';
import { AddShareButtonsSticky, Button } from '@/shared/ui';
import haptic from '@/shared/lib/haptic';


const Tags = ({ description, tags, name }:
  { description: string, tags: string[], name: string },
) => {
  if (!description) {
    return null;
  }

  const tagString = useMemo(() => {
    return description
      .split(' ')
      .map((d, key) => {
        const i = tags.indexOf(d.replace('#', ''));

        return i > -1
          ? <div className={styles.Tag} key={key}>{d}</div>
          : <span key={key}>{d}</span>;
      });
  }, [description, tags]);

  return (<div
    onClick={() => routes.stickerSet.open({ stickerSetName: name })}
    className={styles.description}>
    {tagString}
  </div>);
};

export const Header = ({
  name,
  title,
  description,
  tags,
  addButton = true,
}: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.Head}>
      <div className={styles.label}>
        <Link to={`/stickerSet/${name}`} className={styles.name}>
          {title}
        </Link>
        <Tags
          name={name}
          tags={tags}
          description={description}
        />
      </div>
      {
        addButton && <Button
          text={t('add')}
          onClick={(evt) => onAddButtonClick(evt, name)}
        />
      }
    </div>
  );
};

export const AddButtonRound = ({ name, length }: {
  name: string,
  length: number,
}) => {
  const { t } = useTranslation();

  return (
    <AddShareButtonsSticky
      onClick={(evt) => onAddButtonClick(evt, name)}
      text={`${t('add')} ${length} ${t('STICKERS')}`}
      name={name}
    />
  );
};

function onAddButtonClick (evt: MouseEvent, name: string) {
  evt.preventDefault();
  evt.stopPropagation();

  haptic.impactLight();

  openTelegramLink(ADD_STICKER_SET_URL + name);
}
