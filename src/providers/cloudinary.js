import * as container from '../container';

const $cloudinary = Symbol('cloudinary');

export const provideCloudinary = (cloudinary) => {
  container.set($cloudinary, cloudinary);
};

export const useCloudinary = () => {
  return container.get($cloudinary);
};
