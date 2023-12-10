import { BackButton } from '@twa-dev/sdk/react';

import { routes } from '@/app/router';
import { useScrollToTop } from '@/shared/hooks';
import { TermsOfUse } from '@/widgets/terms';


export const Privacy = () => {
  useScrollToTop();

  return (
    <>
      <BackButton onClick={routes.root.open} />

      <section className="policy" style={{ padding: '0 2rem' }}>
        <TermsOfUse/>
      </section>
    </>);
};
