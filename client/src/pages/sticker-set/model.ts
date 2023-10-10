import { sample } from 'effector';
import WebApp from '@twa-dev/sdk';

import { routes } from '@/app/router';
import { getStickerSetByName } from '@/entities/sticker-set/api';
import { $token, authFx } from '@/shared/session';
import { appStarted } from '@/shared/config/init';
import { recommendationsReseted } from '@/shared/recommendations';


export const currentRoute = routes.stickerSet;

sample({
  source: appStarted,
  filter: () => Boolean(WebApp.initDataUnsafe.start_param),
  fn: () => ({
    stickerSetName: WebApp.initDataUnsafe.start_param?.replace('set=', '') || '',
  }),
  target: [currentRoute.$params, currentRoute.open],
});

sample({
  clock: [$token, authFx.fail],
  source: currentRoute.$params,
  filter: currentRoute.$isOpened,
  fn: (params) => params.stickerSetName,
  target: getStickerSetByName,
});

sample({
  clock: currentRoute.opened,
  target: recommendationsReseted,
});
