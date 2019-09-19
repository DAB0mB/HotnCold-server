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
