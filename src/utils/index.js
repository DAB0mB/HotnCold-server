export { default as Mutex } from './mutex';
export * from './sequelize';
export * from './units';

export const omit = (obj, ...blacklist) => {
  obj = { ...obj };

  blacklist.forEach(k => delete obj[k]);

  return obj;
};

export const pick = (obj, ...whitelist) => {
  const newObj = {};

  whitelist.forEach(k => newObj[k] = obj[k]);

  return newObj;
};

export const get = (obj, path) => {
  return path.split('.').reduce((value, key) => {
    return value && value[key];
  }, obj);
};

export const set = (obj, path, newValue) => {
  return path.split('.').reduce((value, key, i, keys) => {
    if (i == keys.length - 1) {
      return value && (value[key] = newValue);
    }

    return value && value[key];
  }, obj);
};

export const generatePasscode = (length = 4) => {
  return Array.apply(null, { length }).reduce((passcode) => {
    return passcode + Math.floor(Math.random() * 10);
  }, '');
};
