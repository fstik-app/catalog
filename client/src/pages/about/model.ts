import { routes } from '@/app/router';
// import { chainAuthorized } from '@/shared/session';
import { } from '@/entities/search';


export const currentRoute = routes.about;
// export const authorizedRoute = chainAuthorized(currentRoute, { otherwise: routes.welcome.open });

// querySync({
//   source: { [QUERY_PARAM_KEYS.search]: $searchQuery },
//   route: routes.root,
//   controls,
// });

// querySync({
//   source: { [QUERY_PARAM_KEYS.menu]: $mainMenu, [QUERY_PARAM_KEYS.search]: $searchQuery },
//   route: routes.root,
//   cleanup: {
//     // Strip all params which aren't present in `source`
//     irrelevant: true,
//     // Strip empty params ('', 0, false, null)
//     empty: true,
//     // Preserves params that should've been removed by irerelevant/empty params
//     preserve: [QUERY_PARAM_KEYS.search],
//   },
//   controls,
// });

// redirect({
//   clock: propertyClicked,
//   query: (id) => ({ id }),
//   route: routes.building,
// });

// export function onRowClick (id: number) {
//   propertyClicked(id);
// }
