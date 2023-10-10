import WebApp from '@twa-dev/sdk';

import { iOS } from './user-agent';


export const openTelegramLink = (url: string) => {
  if (iOS()) {
    window.location.replace(url);
  } else if (WebApp.openTelegramLink) {
    WebApp.openTelegramLink(url);
  } else {
    window.open(url);
  }
};
