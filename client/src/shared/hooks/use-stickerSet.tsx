import { useStoreMap } from 'effector-react';

import { $stickerSets } from '@/entities/sticker-set/model';


export const useStickerSet = (stickerSetId?: string) => {
  const set = useStoreMap({
    store: $stickerSets,
    keys: [stickerSetId],
    fn: (stickerSets, [currentId]) => stickerSets.find(({ id }) => id === currentId) || null,
  });

  return set;
};
