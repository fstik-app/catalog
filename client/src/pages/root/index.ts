import { currentRoute } from './model';
import { RootPage } from './page';

import { PageLayout } from '@/shared/ui/layouts';


export const RootRoute = {
  view: RootPage,
  layout: PageLayout,
  route: currentRoute,
};
