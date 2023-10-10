import { createBrowserHistory } from 'history';
import {
  createRoute,
  createHistoryRouter,
  createRouterControls,
} from 'atomic-router';
import { sample } from 'effector';

import { appStarted } from '@/shared/config/init';


export const routes = {
  stickerSet: createRoute<{ stickerSetName: string }>(),
  notFound: createRoute(),
  root: createRoute(),
  about: createRoute(),
};

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: [
    {
      path: '/404',
      route: routes.notFound,
    },
    {
      path: '/',
      route: routes.root,
    },
    {
      path: '/stickerSet/:stickerSetName',
      route: routes.stickerSet,
    },
    {
      path: '/about',
      route: routes.about,
    },
  ],
  controls,
});

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});
