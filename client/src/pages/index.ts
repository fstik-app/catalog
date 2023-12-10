import { createRoutesView } from 'atomic-router-react';

import { RootRoute } from './root';
import { RootPage } from './root/page';
import { AboutRoute } from './about';
import { StickerSetRoute } from './sticker-set';
import { PrivacyRoute } from './privacy';


export const RoutesView = createRoutesView({
  routes: [StickerSetRoute, RootRoute, AboutRoute, PrivacyRoute],
  otherwise: RootPage,
});
