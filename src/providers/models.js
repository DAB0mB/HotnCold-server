import * as container from '../container';

const $models = Symbol('models');

export const provideModels = (models) => {
  container.set($models, models);
};

export const useModels = () => {
  return container.get($models);
};
