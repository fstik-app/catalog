import styles from './index.module.scss';

import { $searchQuery, searchQueryUpdated } from '@/entities/search/model';
import { Search } from '@/entities/search/ui';


export const CatalogSearch = () => {
  return (
    <div className={styles.SearchWrapper}>
      <Search
        queryStore={$searchQuery}
        onChange={(evt) => searchQueryUpdated(evt.target.value)}
      />
    </div>
  );
};
