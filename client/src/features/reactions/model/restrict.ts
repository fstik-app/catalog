import { sample } from 'effector';

import {
  banUserFx,
  updateStickerSetSafeFx,
  updateStickerSetPublicFx,
} from '../api';

import Haptic from '@/shared/lib/haptic';
import { stickerSetStatusUpdated } from '@/entities/sticker-set/model';


sample({
  clock: [
    banUserFx.doneData,
    updateStickerSetSafeFx.doneData,
    updateStickerSetPublicFx.doneData,
  ],
  fn: (res) => { Haptic.impactLight(); return res;},
  target: stickerSetStatusUpdated,
});

sample({
  clock: [
    banUserFx.fail,
    updateStickerSetSafeFx.fail,
    updateStickerSetPublicFx.fail,
  ],
  fn: Haptic.impactError,
});
