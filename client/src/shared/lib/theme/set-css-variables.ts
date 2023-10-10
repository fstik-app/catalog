import WebApp from '@twa-dev/sdk';

import { RGBToHSL } from '../utils';

import { getCssProperty, setCssProperty } from '@/shared/lib/theme/css-variables';


export const setCssVariables = () => {
  const themeParams = WebApp.themeParams;
  const colorScheme = themeParams?.bg_color
    ? WebApp.colorScheme || 'dark'
    : 'dark';

  const bg_color = themeParams?.bg_color || getCssProperty('--tg-theme-bg-color');
  const hint_color = themeParams?.hint_color || getCssProperty('--tg-theme-hint-color');
  const sec_bg_color = themeParams?.secondary_bg_color || getCssProperty('--tg-theme-secondary-bg-color') || bg_color;


  setCssProperty('--tg-theme-scheme', colorScheme, colorScheme);
  setCssProperty('--tg-theme-bg-color-10', bg_color + '16', colorScheme);
  setCssProperty('--tg-theme-hint-color-20', hint_color + '35', colorScheme);
  // setCssProperty('--tg-theme-secondary-bg-color', sec_bg_color, colorScheme); // (toggle theme) sets root style and i cant get another scheme color

  const c = RGBToHSL(sec_bg_color);
  const res = colorScheme === 'dark'
    ? `hsl(${c[0]}deg 5% 70% / 15%)`
    : `hsl(${c[0]}deg 10% 10% / 5%)`;

  setCssProperty('--tg-theme-hint-button-hsl-color', res, colorScheme);
};
