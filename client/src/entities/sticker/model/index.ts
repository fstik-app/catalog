import { createEvent, restore } from 'effector';

import { SelectedSticker } from '../types';


export const stickerSelected = createEvent<SelectedSticker>();
export const $selectedSticker = restore(stickerSelected, null);
