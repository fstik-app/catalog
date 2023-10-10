import { attach } from 'effector';

import api from '@/shared/api';
import { $token } from '@/shared/session';


export const banUserFx = attach({ effect: api.banUserFx, source: $token, mapParams: (stickerSetId: string, user_token) => ({ stickerSetId, user_token }) });
export const updateStickerSetSafeFx = attach({ effect: api.updateStickerSetSafeFx, source: $token, mapParams: (stickerSetId: string, user_token) => ({ stickerSetId, user_token }) });
export const updateStickerSetPublicFx = attach({ effect: api.updateStickerSetPublicFx, source: $token, mapParams: (stickerSetId: string, user_token) => ({ stickerSetId, user_token }) });
