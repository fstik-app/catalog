import { createEvent, restore } from 'effector';

import { CATALOG_KIND_ENUM, MENU_OPTIONS_ENUM } from '@/shared/constants';


export const setOption = createEvent<MENU_OPTIONS_ENUM>();
export const $mainMenu = restore(setOption, MENU_OPTIONS_ENUM.default);

export const mainMenuVisibilityDisabled = createEvent();
export const mainMenuVisibilityToggled = createEvent<boolean | undefined>();
export const $mainMenuVisibility = restore(mainMenuVisibilityToggled, true).on(mainMenuVisibilityDisabled, () => false);


// catalog type menu
export const setCatalogKind = createEvent<CATALOG_KIND_ENUM>();
export const $catalogKind = restore(setCatalogKind, CATALOG_KIND_ENUM.STICKER);
