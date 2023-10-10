import { attach } from 'effector';

import api from '@/shared/api';
import { $token } from '@/shared/session';


export const getStickerSetByName = attach({
  effect: api.fetchStickerSetByNameFx,
  source: $token,
  mapParams: (name: string, user_token) => ({ name, user_token }),
});
