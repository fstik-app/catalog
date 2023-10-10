import { createEvent, restore } from 'effector';

import { MENU_OPTIONS_ENUM } from '@/shared/constants';


export const setOption = createEvent<MENU_OPTIONS_ENUM>();
export const $mainMenu = restore(setOption, MENU_OPTIONS_ENUM.default);

export const mainMenuVisibilityDisabled = createEvent();
export const mainMenuVisibilityToggled = createEvent<boolean | undefined>();
export const $mainMenuVisibility = restore(mainMenuVisibilityToggled, true).on(mainMenuVisibilityDisabled, () => false);
