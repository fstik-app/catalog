import WebApp from '@twa-dev/sdk';
import {
  attach,
  createStore,
  restore,
  sample,
} from 'effector';
import { reshape } from 'patronum';

import api from '../api';
import { appStarted } from '../config/init';

import { User } from '@/types';


export enum AuthStatus {
  Initial = 0,
  Pending,
  Anonymous,
  Authenticated,
}

export const authFx = attach({
  effect: api.authUserFx,
  // source: routes.root.$query,
  mapParams: () => ({ initData: WebApp.initData || import.meta.env.VITE_APP_INIT_DATA }),
});

export const $authenticationStatus = createStore(AuthStatus.Initial);

const $user = restore<User>(authFx.doneData, {
  user_token: null,
  isModerator: false,
});

export const { $token, $isModerator } = reshape({
  source: $user,
  shape: {
    ['$token']: (user) => user.user_token,
    ['$isModerator']: (user) => user.isModerator,
  },
});

$authenticationStatus.on(authFx, (status) => {
  if (status === AuthStatus.Initial) return AuthStatus.Pending;
  return status;
});

$authenticationStatus.on(authFx.doneData, () => AuthStatus.Authenticated);
$authenticationStatus.on(authFx.fail, () => AuthStatus.Anonymous);

sample({
  clock: appStarted,
  target: authFx,
});
