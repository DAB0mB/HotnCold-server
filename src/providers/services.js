import * as container from '../container';

const $services = Symbol('services');

export const provideServices = (services) => {
  container.set($services, services);
};

export const useServices = () => {
  return container.get($services);
};
