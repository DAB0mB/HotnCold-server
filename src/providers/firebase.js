import * as container from '../container';

const $firebase = Symbol('firebase');

export const provideFirebase = (firebase) => {
  container.set($firebase, firebase);
};

export const useFirebase = () => {
  return container.get($firebase);
};
