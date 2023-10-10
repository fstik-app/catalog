import { sample } from 'effector';
import WebApp from '@twa-dev/sdk';

import { appStarted } from '../config/init';


sample({
  clock: appStarted,
  fn: () => {
    WebApp.ready();
    WebApp.expand();
  },
});
