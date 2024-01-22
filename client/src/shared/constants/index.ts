export const STICKER_HEIGHT = 60;

export const STICKER_MAX_WIDTH = 100;

export const DEFAULT_LIMIT = 15;

export const SEARCH_DEBOUNCE = 1000;

export const MENU_OPTION_KEY = 'menu';

export const QUERY_PARAM_KEYS = {
  search: 'q',
  menu: 'menu',
};

export const ADD_STICKER_SET_URL = 'https://t.me/addstickers/';

export enum MENU_OPTIONS_ENUM {
  new = 'new',
  // popular = 'popular',
  trending = 'trending',
  verified = 'verified',
  // main = 'main',
  disabled = 'disabled',

  default = 'verified',
}

export enum CATALOG_KIND_ENUM {
  STICKER = 'regular',
  EMOJI = 'custom_emoji',
}

export enum STORAGE_KEYS {
  REFRESH = 'REFRESH',
  THEME = 'THEME',
  MAP_CENTER = 'MAP_CENTER',
}

export enum THEME_ENUM {
  dark = 'dark',
  light = 'light',
  auto = 'auto',
}

export enum LAYERS {
  MAP_CLICK = 'map-click-layer',
  USER_PROPERTIES = 'user-properties',
  OTHER_PROPERTIES = 'other-properties',
}
