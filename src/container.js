let container = new Map();
const containersStack = [];

export const get = (key) => {
  if (!has(key)) {
    throw Error(`"${key}" was not provided!`);
  }

  return container.get(key);
};

export const set = (key, value) => {
  return container.set(key, value);
};

export const has = (key) => {
  return container.has(key);
};

// Affects the global container exported from this module. Useful to change the resolved
// values across diffrent components in the project.
// DO NOT expose it, it's dangerous to use it explicitly
const fork = () => {
  const childContainer = new Map(container);
  containersStack.push(container);
  container = childContainer;
};

const converge = () => {
  if (!containersStack.length) {
    throw Error('Cannot converge from root container');
  }

  container = containersStack.pop();
};

export const forkBefore = (beforeCb = Function) => {
  if (process.env.NODE_ENV != 'test') {
    throw Error(`expected NODE_ENV to be "test", got "${process.env.NODE_ENV}" instead`);
  }

  before(() => {
    fork();
    beforeCb();
  });
  after(converge);
};

export const forkBeforeEach = (beforeEachCb = Function) => {
  if (process.env.NODE_ENV != 'test') {
    throw Error(`expected NODE_ENV to be "test", got "${process.env.NODE_ENV}" instead`);
  }

  beforeEach(() => {
    forkContainer();
    beforeEachCb();
  });
  afterEach(converge);
};

export const forkScope = (cb) => {
  fork();

  let result;
  try {
    result = cb();
  }
  finally {
    if (result && typeof result.then == 'function' && typeof result.catch == 'function') {
      result = result.then((r) => {
        converge();

        return r;
      }, (e) => {
        converge();

        return Promise.reject(e);
      });
    }
    else {
      converge();
    }
  }

  return result;
};
