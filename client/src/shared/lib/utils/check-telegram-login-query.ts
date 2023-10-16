import has from 'lodash/has';


const keys = ['auth_date', 'hash', 'id'];

export const checkTgLoginQuery = (obj: object) => {
  return keys.reduce((a, c) => a && has(obj, c), true);
};
