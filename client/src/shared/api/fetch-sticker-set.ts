import { createEffect } from 'effector';

import request from './request';

import type { IStickerSet } from '@/types';


interface IFetchStickerSet {
  name: string,
  user_token: string | null,
}

export const fetchStickerSetByNameFx = createEffect(async (payload: IFetchStickerSet) => {
  const { data } = await request.post<IStickerSet, IFetchStickerSet>('getStickerSetByName', payload);

  return data.result;
});
