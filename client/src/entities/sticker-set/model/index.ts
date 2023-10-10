import { createEvent, restore, sample } from 'effector';

import { getStickerSetByName } from '../api';

import type { IReaction, IStickerSet, IStickerStatus } from '@/types';
import { $recommendations } from '@/shared/recommendations';
import { routes } from '@/app/router';


export const stickersSetsPushed = createEvent<IStickerSet[]>('push sets to store');
export const $stickerSets = restore<IStickerSet[]>(stickersSetsPushed, []);
export const $$stickerSetIds = $stickerSets.map((stickerSets) => stickerSets.map(({ id }) => id));
export const $$stickerSetsCount = $stickerSets.map(({ length }) => length);

export const stickerSetsAdded = createEvent<IStickerSet[]>('add sticker(s) ');
export const stickerSetAdded = createEvent<IStickerSet[]>('add sticker(s) ');
export const stickerSetsReseted = createEvent('reset $stickerSets');
export const reactionsCountUpdated = createEvent<[string, IReaction]>('update reactions count');
export const stickerSetStatusUpdated = createEvent<[string, IStickerStatus]>('update stickerSet status');


$stickerSets
  .on(stickerSetsAdded, (stickerSets, newStickerSets) => {
    for (const newStickerSet of newStickerSets) {
      const i = stickerSets.findIndex(({ id }) => id === newStickerSet.id);

      if (i === -1) {
        stickerSets.push(newStickerSet);
      } else {
        stickerSets.splice(i, 1, newStickerSet);
      }
    }

    return [...stickerSets].sort((a, b) => a.index - b.index);
  })
  .on(reactionsCountUpdated, (state, [stickerSetId, reaction]) => {
    const stickerSetIndex = state.findIndex(({ id }) => id === stickerSetId);

    if (stickerSetIndex === -1) {
      return;
    }

    const newState: IStickerSet[] = [...state];

    newState[stickerSetIndex] = {
      ...newState[stickerSetIndex],
      reaction,
    };

    return newState;
  })
  .on(stickerSetStatusUpdated, (state, [stickerSetId, status]) => {
    const stickerSetIndex = state.findIndex(({ id }) => id === stickerSetId);

    if (stickerSetIndex === -1) {
      return;
    }

    const newState: IStickerSet[] = [...state];

    newState[stickerSetIndex] = {
      ...newState[stickerSetIndex],
      ...status,
    };

    return newState;
  })
  .on(stickerSetsReseted, () => []);

sample({
  source: getStickerSetByName.doneData,
  fn: (stickerSet) => [stickerSet],
  target: stickerSetsAdded,
});

sample({
  clock: [reactionsCountUpdated, stickerSetStatusUpdated],
  source: {
    stickerSets: $stickerSets,
    recommendations: $recommendations,
    params: routes.stickerSet.$params,
  },
  filter: routes.stickerSet.$isOpened,
  fn: ({ stickerSets, recommendations, params: { stickerSetName } }, [id, reaction]) => {
    const stickerSetId = stickerSets.find(({ name }) => name === stickerSetName)?.id;

    if (!stickerSetId || !recommendations[stickerSetId]) {
      return recommendations;
    }

    const newState: IStickerSet[] = [...recommendations[stickerSetId]];

    const reactedIndex = newState.findIndex((set) => set.id === id);

    if (reactedIndex === -1) {
      return recommendations;
    }

    newState[reactedIndex] = {
      ...newState[reactedIndex],
      ...('current' in reaction ? { reaction } : reaction),
    };

    return {
      ...recommendations,
      [stickerSetId]: newState,
    };
  },
  target: $recommendations,
});
