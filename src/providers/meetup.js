import * as container from '../container';

const $meetup = Symbol('meetup');

export const provideMeetup = (meetup) => {
  container.set($meetup, meetup);
};

export const useMeetup = () => {
  return container.get($meetup);
};
