import { sample } from 'effector';

import { reactFx } from '../api';

import { reactionsCountUpdated } from '@/entities/sticker-set/model';
import Haptic from '@/shared/lib/haptic';


export * from './restrict';

sample({
  clock: reactFx.doneData,
  fn: (res) => { Haptic.impactLight(); return res;},
  target: reactionsCountUpdated,
});

sample({
  clock: reactFx.fail,
  fn: Haptic.impactError,
});
