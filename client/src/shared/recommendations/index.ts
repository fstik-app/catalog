import { attach, createEvent, createStore, sample } from 'effector';


import api from '../api';
import { $token } from '../session';

import { IStickerSet } from '@/types';


export const recommendationsRequested = createEvent<string[]>();
export const recommendationsAdded = createEvent<{ id: string, sets: IStickerSet[] }>();
export const recommendationsReseted = createEvent();
export const $recommendations = createStore<Record<string, IStickerSet[]>>({});

export const getRecommendationsFx = attach({
  effect: api.fetchStickersSetsFx,
  source: {
    user_token: $token,
    recommendations: $recommendations,
  },
  mapParams: (stickerSetIds: string[], { user_token, recommendations }) => ({
    query: stickerSetIds,
    skip: recommendations[stickerSetIds[0]]?.length || 0,
    type: 'more',
    user_token,
  }),
});

sample({
  source: recommendationsRequested,
  target: getRecommendationsFx,
});

sample({
  clock: getRecommendationsFx.done,
  source: $recommendations,
  fn: (recs, { params, result }) => {
    const [id] = params;

    const old = recs[id] || [];

    return {
      ...recs,
      [id]: [...old, ...result].sort((a, b) => a.index - b.index),
    };
  },
  target: $recommendations,
});

sample({
  clock: recommendationsReseted,
  fn: () => ({}),
  target: $recommendations,
});
