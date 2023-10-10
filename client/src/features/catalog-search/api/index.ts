import { attach } from 'effector';

import api from '@/shared/api';
import { $token } from '@/shared/session';
import { $mainMenu } from '@/entities/menu/model';
import { DEFAULT_LIMIT } from '@/shared/constants';
import { $stickerSets } from '@/entities/sticker-set/model';
import { $searchQuery } from '@/entities/search';


export const searchStickerSetsFx = attach({
  effect: api.fetchStickersSetsFx,
  source: {
    query: $searchQuery,
    user_token: $token,
    menu: $mainMenu,
    stickerSets: $stickerSets,
  },
  mapParams: (_: unknown, { query, user_token, menu, stickerSets }) => {
    return ({
      user_token,
      query,
      limit: DEFAULT_LIMIT,
      skip: stickerSets.length,
      type: query.length > 0 ? '' : menu,
    });
  },
});
