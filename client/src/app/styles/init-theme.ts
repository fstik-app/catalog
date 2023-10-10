// import { setCssVariables, setThemeSchemeFx } from '@/shared/lib/theme';

import { getProperty } from '@/shared/lib/storage';
import { STORAGE_KEYS } from '@/shared/constants';


// document.querySelector(':root')?.classList.add('light');
// setCssVariables();

getProperty(STORAGE_KEYS.THEME).then((schema) => {
  // setThemeSchemeFx(schema || 'light');
}).catch(console.error);
