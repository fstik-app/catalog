import QueryString from 'qs';


function isString (value: unknown) {
  return value?.constructor === String;
}

export const getInitialQueryParam = (key: string): string => {
  const qs = QueryString.parse(window.location.search, { ignoreQueryPrefix: true });

  let q = qs[key];

  if (q && !isString(q) && Array.isArray(q)) {
    q = q[0];
  }

  return isString(q) ? q as string : '';
};
