export const omit = (obj, ...blacklist) => {
  obj = { ...obj };

  blacklist.forEach(k => delete obj[k]);

  return obj;
};

export const pick = (obj, ...whitelist) => {
  newObj = {};

  whitelist.forEach(k => newObj = obj[k]);

  return newObj;
};
