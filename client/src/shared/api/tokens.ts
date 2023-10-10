import { createEffect } from 'effector';
import { isString } from 'lodash';


import request from './request';

import type { User } from '@/types';


interface AuthUserI {
  // query: RouteQuery | WebAppInitData,
  initData: string,
}

export const authUserFx = createEffect(async ({ initData }: AuthUserI): Promise<User> => {
  if (!initData || !isString(initData)) {
    throw new Error('initData invalid');
  }

  const { data } = await request.post<User, AuthUserI>('authUser', { initData });

  // await sleep(1000);

  return data.result;
});
