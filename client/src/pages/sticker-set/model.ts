import { sample } from 'effector';
import WebApp from '@twa-dev/sdk';
import { redirect } from 'atomic-router';

import { routes } from '@/app/router';
import { getStickerSetByName } from '@/entities/sticker-set/api';
import { $token, authFx } from '@/shared/session';
import { appStarted } from '@/shared/config/init';
import { recommendationsReseted } from '@/shared/recommendations';


export const currentRoute = routes.stickerSet;

redirect({
  clock: sample({
    clock: appStarted,
    filter: () => Boolean(WebApp.initDataUnsafe.start_param),
  }),
  params: () => ({
    stickerSetName: WebApp.initDataUnsafe.start_param?.replace('set=', '') || '',
  }),
  route: currentRoute,
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
