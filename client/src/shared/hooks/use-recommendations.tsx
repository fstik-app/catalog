import { useStoreMap } from 'effector-react';

import { $recommendations } from '../recommendations';


export const useRecommendations = (stickerSetId?: string) => {
  const set = useStoreMap({
    store: $recommendations,
    keys: [stickerSetId],
    fn: (likeRecommendations, [id]) => (id && likeRecommendations[id]) || [],
  });

  return set;
};
