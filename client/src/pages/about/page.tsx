import { BackButton } from '@twa-dev/sdk/react';

import { routes } from '@/app/router';
import { useScrollToTop } from '@/shared/hooks';
import { TermsOfUse } from '@/widgets/terms';


export const About = () => {
  useScrollToTop();

  return (
    <>
      <BackButton onClick={routes.root.open} />

      <section className="policy" style={{ padding: '0 2rem' }}>
        <div
          className="container"
          style={{ minHeight: '100vh' }}
        >
          <h1 className="sectionTitle">ABOUT</h1>
      Telegram bot: <a href='https://t.me/fstikbot'>@fstikbot</a>
          <br/>
          <br/>
      Support chat: <a href='https://t.me/fStikChat'>@fStikChat</a>
          <br/>
          <br/>
      Mail: <a href="mailto:support@fstik.app">support@fstik.app</a>
          <br/>
          <br/>
      Site: <a href="https://webapp.fstik.app">https://webapp.fstik.app</a>
          <br/>
          <br/>
      Terms: <a
            href="https://webapp.fstik.app/about#terms"
            onClick={(e) => {
              e.preventDefault();
              const terms = document.querySelector('#terms');

              terms?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
        Terms of Use
          </a>
          <br/>
          <br/>
      Github: <a href="https://github.com/fstik-app">https://github.com/fstik-app</a>

        </div>
        <TermsOfUse/>
      </section>
    </>);
};
