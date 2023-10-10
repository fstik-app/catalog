import { createEffect } from 'effector';
import { isString } from 'lodash';

import { STORAGE_KEYS } from '@/shared/constants';


export const getPropertyFx = createEffect(getProperty);

interface LocalStorageKV { key: STORAGE_KEYS, data: string | number }

export const setPropertyFx = createEffect(setProperty);

export const removePropertyFx = createEffect(async (key: STORAGE_KEYS) => {
  window.localStorage.removeItem(key);
});

export async function getProperty (key: STORAGE_KEYS) {
  const value = window.localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function setProperty ({ key, data }: LocalStorageKV) {
  const value = isString(data) ? data : JSON.stringify(data);

  window.localStorage.removeItem(key);
  window.localStorage.setItem(key, value);
}
