import WebApp from '@twa-dev/sdk';

import { getCssProperty } from '@/shared/lib/theme/css-variables';


export const themeParams = WebApp.themeParams;
export const colorScheme = themeParams?.bg_color
  ? WebApp.colorScheme || 'dark'
  : 'dark';


export const bg_color = themeParams?.bg_color || getCssProperty('--tg-theme-bg-color');
export const hint_color = themeParams?.hint_color || getCssProperty('--tg-theme-hint-color');
export const sec_bg_color = themeParams?.secondary_bg_color || getCssProperty('--tg-theme-secondary-bg-color') || bg_color;
