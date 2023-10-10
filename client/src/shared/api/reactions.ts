import { createEffect } from 'effector';

import request from './request';

import type { ReactStickerSetType, IReaction } from '@/types';


interface ReactStickerSetI {
  stickerSetId: ReactStickerSetType['0'],
  type: ReactStickerSetType['1'],
  user_token: string | null,
}

interface ReactionResI {
  current: IReaction['current'],
  total: {
    like: number,
    dislike: number,
  },
}

export const reactStickerSetFx = createEffect(
  async (payload: ReactStickerSetI) => {
    const { data } = await request.post<ReactionResI, ReactStickerSetI>('reactStickerSet', payload);

    const reaction = {
      current: data.result.current,
      ...data.result.total,
    };

    return [payload.stickerSetId, reaction] as [string, IReaction];
  },
);

