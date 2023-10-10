export const generateIdFor = (store: { hasOwnProperty: AnyFunction }) => {
  let id;

  do {
    id = String(Math.random()).replace('0.', 'id');
  } while (Object.prototype.hasOwnProperty.call(store, id));

  return id;
};
