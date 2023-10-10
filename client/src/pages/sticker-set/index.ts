import { currentRoute } from './model';
import { StickerSetPage } from './page';


import { PageLayout } from '@/shared/ui/layouts';


export const StickerSetRoute = {
  view: StickerSetPage,
  layout: PageLayout,
  route: currentRoute,
};
