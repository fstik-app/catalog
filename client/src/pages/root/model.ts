import { querySync } from 'atomic-router';
import { debounce } from 'patronum';
import { sample } from 'effector';

import { controls, routes } from '@/app/router';
import { } from '@/entities/search';
import { $searchQuery } from '@/entities/search/model';
import { QUERY_PARAM_KEYS } from '@/shared/constants';
import { $mainMenu } from '@/entities/menu/model';
import { searchStickerSetsFx } from '@/features/catalog-search/api';
import { $token, authFx } from '@/shared/session';
import { recommendationsReseted } from '@/shared/recommendations';


export const currentRoute = routes.root;

sample({
  clock: [$token, authFx.fail],
  filter: currentRoute.$isOpened,
  target: searchStickerSetsFx,
});

sample({
  clock: currentRoute.opened,
  target: recommendationsReseted,
});

querySync({
  source: { [QUERY_PARAM_KEYS.menu]: $mainMenu, [QUERY_PARAM_KEYS.search]: $searchQuery },
  route: routes.root,
  clock: [
    debounce({ source: $mainMenu, timeout: 1000 }),
    debounce({ source: $searchQuery, timeout: 1000 }),
  ],
  cleanup: {
    // Strip all params which aren't present in `source`
    irrelevant: true,
    // Strip empty params ('', 0, false, null)
    empty: true,
    // Preserves params that should've been removed by irerelevant/empty params
    preserve: [QUERY_PARAM_KEYS.search],
  },
  controls,
});
