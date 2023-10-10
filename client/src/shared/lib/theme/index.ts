import WebApp from '@twa-dev/sdk';
import { createEffect } from 'effector';


import { getProperty, setProperty } from '../storage';

import { setCssVariables } from './set-css-variables';

import { STORAGE_KEYS, THEME_ENUM } from '@/shared/constants';


export * from './set-css-variables';


export async function getTheme (): Promise<THEME_ENUM> {
  const schema = await getProperty(STORAGE_KEYS.THEME);

  const themes = Object.keys(THEME_ENUM);

  if (!themes.includes(schema)) {
    return THEME_ENUM.light;
  }

  return schema;
}

export const toggleThemeFx = createEffect(async () => {
  const schema = document.documentElement.classList.contains(THEME_ENUM.light)
    ? THEME_ENUM.dark
    : THEME_ENUM.light;

  setThemeSchemeFx(schema);
});

export const setThemeSchemeFx = createEffect(async (schema: typeof WebApp.colorScheme) => {
  document.documentElement.classList.remove(THEME_ENUM.dark, THEME_ENUM.light);
  document.documentElement.classList.add(schema);
  setCssVariables();
  await setProperty({ key: STORAGE_KEYS.THEME, data: schema });
});
