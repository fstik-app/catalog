import { createEffect } from 'effector';

import request from './request';

import type {
  ISafe,
  IBanned,
  IPublic,
  IStickerSetId,
  IStickerStatus,
} from '@/types';


type RestrictReq = IStickerSetId & { user_token: string | null };

export const banUserFx = createEffect(async (payload: RestrictReq) => {
  const { data } = await request.post<IBanned, RestrictReq>('banUser', payload);

  return [payload.stickerSetId, data.result] as [string, IStickerStatus];
});

export const updateStickerSetSafeFx = createEffect(async (payload: RestrictReq) => {
  const { data } = await request.post<ISafe, RestrictReq>('updateStickerSetSafe', payload);

  return [payload.stickerSetId, data.result] as [string, IStickerStatus];
});

export const updateStickerSetPublicFx = createEffect(async (payload: RestrictReq) => {
  const { data } = await request.post<IPublic, RestrictReq>('updateStickerSetPublic', payload);

  return [payload.stickerSetId, data.result] as [string, IStickerStatus];
});
