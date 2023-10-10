import { sample } from 'effector';
import { debounce, condition } from 'patronum';

import { searchStickerSetsFx } from '../api';

import {
  $hasMore,
  $searchQuery,
  hasMoreReceived,
  noMoreReceived,
  searchDebounce,
  searchQueryReseted,
} from '@/entities/search/model';
import { $authenticationStatus, AuthStatus } from '@/shared/session';
import { $$stickerSetsCount, stickerSetsAdded, stickerSetsReseted } from '@/entities/sticker-set/model';
import { $mainMenu } from '@/entities/menu/model';
import { scrollLoaderIntersected } from '@/shared/ui/sticker-set/model';
import { MENU_OPTIONS_ENUM } from '@/shared/constants';
import { recommendationsReseted } from '@/shared/recommendations';


// new page received
condition({
  source: searchStickerSetsFx.doneData,
  if: (stickerSets) => stickerSets.length > 0,
  then: stickerSetsAdded,
  else: noMoreReceived,
});

// Search sample
sample({
  clock: searchDebounce,
  source: {
    authStatus: $authenticationStatus,
    isFetching: searchStickerSetsFx.pending,
    query: $searchQuery,
    menu: $mainMenu,
  },
  filter ({ isFetching, authStatus }) {
    if (authStatus === AuthStatus.Initial
      || authStatus === AuthStatus.Pending) {
      return false;
    }

    if (isFetching) {
      return false;
    }

    return true;
  },
  fn: ({ query }) => query,
  target: [hasMoreReceived, recommendationsReseted, stickerSetsReseted, searchStickerSetsFx],
});

// menu changed
sample({
  clock: $mainMenu,
  source: {
    authStatus: $authenticationStatus,
    isFetching: searchStickerSetsFx.pending,
    query: $searchQuery,
    menu: $mainMenu,
  },
  filter ({ isFetching, authStatus, menu }) {

    if (menu === MENU_OPTIONS_ENUM.disabled) {
      return false;
    }

    if (authStatus === AuthStatus.Initial
      || authStatus === AuthStatus.Pending) {
      return false;
    }

    if (isFetching) {
      return false;
    }

    return true;
  },
  fn: ({ query }) => query,
  target: [searchQueryReseted, hasMoreReceived, recommendationsReseted, stickerSetsReseted, searchStickerSetsFx],
});

// infinity scroll
sample({
  clock: debounce({
    source: scrollLoaderIntersected,
    timeout: 500,
  }),
  source: {
    count: $$stickerSetsCount,
    hasMore: $hasMore,
    pending: searchStickerSetsFx.pending,
    authStatus: $authenticationStatus,
  },
  filter: ({ hasMore, pending, authStatus, count }) => {
    return hasMore && !pending && authStatus > 1 && count > 0;
  },
  target: searchStickerSetsFx,
});
