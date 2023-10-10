import { sample } from 'effector';

import { $mainMenu, mainMenuVisibilityToggled } from '@/entities/menu/model';
import { stickerSetsReseted } from '@/entities/sticker-set/model';
import { $searchQuery } from '@/entities/search';
import { MENU_OPTIONS_ENUM } from '@/shared/constants';


sample({
  clock: $mainMenu,
  fn: () => true,
  target: [mainMenuVisibilityToggled, stickerSetsReseted],
});

sample({
  clock: $searchQuery,
  source: $mainMenu,
  fn: (menu, query) => query === ''
    ? menu === MENU_OPTIONS_ENUM.disabled ? MENU_OPTIONS_ENUM.default : menu
    : MENU_OPTIONS_ENUM.disabled,
  target: $mainMenu,
});
