import * as container from '../container';

const $mapbox = Symbol('mapbox');

export const provideMapbox = (mapbox) => {
  container.set($mapbox, mapbox);
};

export const useMapbox = () => {
  return container.get($mapbox);
};
