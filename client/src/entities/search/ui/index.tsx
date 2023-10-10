import c from 'classnames';
import { FC } from 'react';
import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';

import type { SearchProps } from '../types';
import { searchQueryUpdated } from '../model';

import styles from './search.module.scss';

import { CircleInfo, CircleXMark, SearchIcon } from '@/shared/ui/icons';
import { routes } from '@/app/router';


export const Search: FC<SearchProps> = ({
  border = false,
  disableInfo = false,
  onChange,
  queryStore,
  value,
}) => {
  const { t } = useTranslation();
  const searchQuery = useUnit(queryStore);

  return (
    <div className={styles.Search}>
      <div className={c([styles.searchInput, border ? styles.border : ''])}>
        <label className={styles.label}>
          <SearchIcon/>
          <input
            value={value || searchQuery}
            type="text"
            placeholder={t('search-placeholder') || ''}
            onChange={onChange}
          />
        </label>
        {
          searchQuery
            ? <div
              className={styles.cirleWrapper}
              onClick={() => searchQueryUpdated('')}
            >
              <CircleXMark/>
            </div>
            : !disableInfo &&
            <Link
              to={routes.about}
              className={styles.cirleWrapper}
            >
              <CircleInfo/>
            </Link>
        }
      </div>
    </div>
  );
};
