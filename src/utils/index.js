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

export const isUUID = (str) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

// Will use the shortest indention as an axis
export const freeText = (text) => {
  if (text instanceof Array) {
    text = text.join('');
  }

  // This will allow inline text generation with external functions, same as ctrl+shift+c
  // As long as we surround the inline text with ==>text<==
  text = text.replace(
    /( *)==>((?:.|\n)*?)<==/g,
    (match, baseIndent, content) => {
      return freeText(content)
        .split('\n')
        .map(line => `${baseIndent}${line}`)
        .join('\n');
    });

  const lines = text.split('\n');

  const minIndent = lines.filter(line => line.trim()).reduce((soFar, line) => {
    const currIndent = line.match(/^ */)[0].length;

    return currIndent < soFar ? currIndent : soFar;
  }, Infinity);

  return lines
    .map(line => line.slice(minIndent))
    .join('\n')
    .trim()
    .replace(/\n +\n/g, '\n\n');
};

export const fork = (obj) => {
  if (!(obj instanceof Object)) {
    return obj;
  }

  const clone = {};
  const keys = [];
  keys.push(...Object.getOwnPropertyNames(obj));
  keys.push(...Object.getOwnPropertySymbols(obj));

  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    Object.defineProperty(clone, key, descriptor);
  }

  const proto = Object.getPrototypeOf(obj);
  Object.setPrototypeOf(clone, proto);

  return clone;
};
