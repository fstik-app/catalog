import { attach } from 'effector';

import api from '@/shared/api';
import { REACTION_ENUM } from '@/types';
import { $token } from '@/shared/session';


export * from './restrict';

export const reactFx = attach({
  effect: api.reactStickerSetFx,
  source: $token,
  mapParams: ([stickerSetId, type]: [string, REACTION_ENUM], user_token) => {
    return ({
      user_token,
      stickerSetId,
      type,
    });},
});
