import * as container from '../container';

const $whitelist = Symbol('whitelist');

export const provideWhitelist = (whitelist) => {
  container.set($whitelist, whitelist);
};

export const useWhitelist = () => {
  return container.get($whitelist);
};
