import * as container from '../container';

const $twilio = Symbol('twilio');

export const provideTwilio = (twilio) => {
  container.set($twilio, twilio);
};

export const useTwilio = () => {
  return container.get($twilio);
};

