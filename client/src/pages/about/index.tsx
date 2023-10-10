import { createRouteView } from 'atomic-router-react';

import { currentRoute } from './model';
import { Privacy } from './page';

// import { LoaderLottie } from '@/shared/ui/loader-lottie';
import { PageLayout } from '@/shared/ui/layouts';


export const AboutRoute = {
  view: createRouteView({
    route: currentRoute,
    view: Privacy,
    // otherwise: LoaderLottie,
  }),
  layout: PageLayout,
  route: currentRoute,
};
