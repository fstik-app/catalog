import { createRouteView } from 'atomic-router-react';

import { currentRoute } from './model';
import { Privacy } from './page';

import { PageLayout } from '@/shared/ui/layouts';


export const PrivacyRoute = {
  view: createRouteView({
    route: currentRoute,
    view: Privacy,
  }),
  layout: PageLayout,
  route: currentRoute,
};
