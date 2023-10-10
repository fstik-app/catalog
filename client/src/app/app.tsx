import '@/shared/i18n';
import '@/shared/lib/theme';
import 'react-virtualized/styles.css';

import './styles/index.scss';

import { RouterProvider } from 'atomic-router-react';

import { router } from '@/app/router';
import { RoutesView } from '@/pages';
import { setCssVariables } from '@/shared/lib/theme';


setCssVariables();


function App () {
  return (
    <RouterProvider router={router}>
      <RoutesView />
    </RouterProvider>
  );
}

export default App;
