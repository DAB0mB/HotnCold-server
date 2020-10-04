import * as container from '../container';

const $db = Symbol('db');

export const provideDb = (db) => {
  container.set($db, db);
};

export const useDb = () => {
  return container.get($db);
};
